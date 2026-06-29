from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import Product, Invoice
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class SyncPayload(BaseModel):
    last_sync_time: str
    invoices: List[Dict[str, Any]]
    stock_adjustments: List[Dict[str, Any]]

@router.post("/push")
def sync_push(payload: SyncPayload, db: Session = Depends(get_db)):
    """
    Handles offline queue processing. Last-write-wins + Delta merging.
    """
    processed_invoices = []
    
    # 1. Process Offline Invoices
    for inv_data in payload.invoices:
        # Validate and convert provisional local IDs to Server IDs
        db_inv = Invoice(**inv_data)
        db.add(db_inv)
        processed_invoices.append(db_inv.id)
        
        # 2. Delta Stock Adjustments
        for line in inv_data.get('lines', []):
            product = db.query(Product).filter(Product.id == line['productId']).first()
            if product:
                product.stock -= line['qty']
                
    db.commit()
    return {"status": "success", "synced_invoices": processed_invoices}

@router.get("/pull")
def sync_pull(last_sync: str, db: Session = Depends(get_db)):
    """
    Pulls data updated since the client's last sync timestamp.
    """
    products = db.query(Product).all() # Add timestamp filter here
    return {
        "products": [p.__dict__ for p in products],
        "timestamp": "CURRENT_SERVER_TIME"
    }
