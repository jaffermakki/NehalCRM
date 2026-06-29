from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.models.domain import Invoice, Product
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter()

class CartItem(BaseModel):
    id: str
    sku: str
    qty: int
    price: float

class CheckoutRequest(BaseModel):
    store_id: str
    customer_id: str | None = None
    subtotal: float
    tax_total: float
    total: float
    payment_method: str
    lines: List[CartItem]

@router.post("/checkout")
def process_checkout(payload: CheckoutRequest, db: Session = Depends(get_db)):
    """
    Process an online POS transaction.
    """
    try:
        # 1. Deduct Stock (Atomically)
        for item in payload.lines:
            product = db.query(Product).filter(
                Product.id == item.id, 
                Product.store_id == payload.store_id
            ).with_for_update().first() # Lock row to prevent race conditions
            
            if not product or product.stock < item.qty:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for SKU: {item.sku}")
            
            product.stock -= item.qty

        # 2. Generate Server Invoice Number
        # In prod, use a sequence or date-based format: STORE-YYYY-NNNN
        server_inv_number = f"INV-{str(uuid.uuid4())[:8].upper()}"

        # 3. Create Invoice Record
        new_invoice = Invoice(
            id=str(uuid.uuid4()),
            store_id=payload.store_id,
            number=server_inv_number,
            customer_id=payload.customer_id,
            subtotal=payload.subtotal,
            tax_total=payload.tax_total,
            total=payload.total,
            payment_method=payload.payment_method,
            lines=[item.dict() for item in payload.lines],
            sync_status="SYNCED"
        )
        
        db.add(new_invoice)
        db.commit()
        db.refresh(new_invoice)
        
        return {"status": "success", "invoice": new_invoice.number}
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error during checkout")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
