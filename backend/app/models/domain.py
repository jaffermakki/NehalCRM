from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Store(Base):
    __tablename__ = "stores"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    tax_province = Column(String, default="ON")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    category = Column(String)
    cost = Column(Float)
    price = Column(Float)
    stock = Column(Integer, default=0)
    threshold = Column(Integer, default=5)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    number = Column(String, unique=True)
    customer_id = Column(String, nullable=True)
    subtotal = Column(Float)
    tax_total = Column(Float)
    total = Column(Float)
    payment_method = Column(String)
    lines = Column(JSON) # Stores serialized cart items
    sync_status = Column(String, default="SYNCED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
