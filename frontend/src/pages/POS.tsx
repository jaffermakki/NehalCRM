import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { db } from '../lib/db';

export const POS = () => {
  const { cart, addToCart, clearCart, isOnline } = useStore();
  const [barcode, setBarcode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0.13); // Default ON (HST 13%)

  // Derived State
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxTotal = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxTotal;

  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode.trim() !== '') {
      // Offline-first lookup
      const product = await db.products.where('sku').equals(barcode).first();
      
      if (product) {
        addToCart({ ...product, qty: 1 });
      } else {
        alert('Product not found in local database!');
      }
      setBarcode('');
    }
  };

  const processCheckout = async (paymentMethod: string) => {
    if (cart.length === 0) return;

    const invoice = {
      id: crypto.randomUUID(),
      number: `PROV-${Date.now()}`, // Provisional ID until synced
      subtotal,
      taxTotal,
      total,
      paymentMethod,
      lines: cart,
      syncStatus: 'PENDING' as const,
      createdAt: new Date().toISOString()
    };

    // 1. Save to local DB instantly (Offline First)
    await db.invoices.add(invoice);
    
    // 2. Queue Sync Event
    await db.syncQueue.add({
      id: crypto.randomUUID(),
      type: 'INVOICE_CREATED',
      payload: invoice
    });

    // 3. Clear UI
    clearCart();
    setDiscount(0);
    alert(`Sale Completed! Invoice ${invoice.number} saved ${isOnline ? '(Syncing...)' : '(Offline)'}.`);
  };

  return (
    <div className="flex h-full gap-5">
      {/* Left Panel: Cart & Scanner */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="card p-4 flex gap-3 items-center">
          <input 
            autoFocus
            type="text" 
            placeholder="Scan Barcode or enter SKU..." 
            className="flex-1 p-3 border border-[var(--border)] rounded-[8px] focus:outline-none focus:border-[var(--accent)] bg-[var(--bg)] font-mono text-[14px]"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleScan}
          />
          <button className="btn btn-secondary px-6">Search</button>
        </div>

        <div className="card flex-1 overflow-y-auto p-0 border-[var(--border2)]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--surface2)] text-[11px] uppercase tracking-wide text-[var(--text2)] border-b border-[var(--border)]">
              <tr>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold w-24">Qty</th>
                <th className="p-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-[var(--text3)]">Cart is empty</td></tr>
              ) : (
                cart.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                    <td className="p-4 font-medium">{item.name} <br/><span className="text-[11px] text-[var(--text3)] font-mono">{item.sku}</span></td>
                    <td className="p-4">${item.price.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="w-7 h-7 rounded bg-[var(--surface2)] border border-[var(--border)]">-</button>
                        <span className="w-6 text-center font-mono">{item.qty}</span>
                        <button className="w-7 h-7 rounded bg-[var(--surface2)] border border-[var(--border)]">+</button>
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-[var(--accent)]">${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel: Checkout Totals */}
      <div className="w-[340px] flex flex-col gap-4">
        <div className="card">
          <div className="text-[11.5px] font-bold text-[var(--text2)] uppercase tracking-wide mb-3 flex items-center gap-1.5">
             Customer
          </div>
          <button className="btn btn-secondary w-full justify-start text-[var(--text2)]">+ Attach Customer Profile</button>
        </div>

        <div className="card flex-1 flex flex-col">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[14px]">
              <span className="text-[var(--text2)]">Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[var(--text2)]">Discount (%)</span>
              <input 
                type="number" 
                className="w-16 text-right border border-[var(--border)] rounded px-1 font-mono bg-[var(--bg)]" 
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[var(--text2)]">Tax (ON - 13%)</span>
              <span className="font-mono text-[var(--red)]">+ ${taxTotal.toFixed(2)}</span>
            </div>
            <div className="pt-4 mt-2 border-t-2 border-[var(--gold)] flex justify-between items-end">
              <span className="text-[16px] font-bold text-[var(--text)]">Total</span>
              <span className="text-[32px] font-extrabold text-[var(--accent)] font-mono tracking-tighter leading-none">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2.5">
            <button className="btn bg-[var(--green-bg)] text-[var(--green)] hover:bg-[var(--accent)] hover:text-white h-14 text-[15px]" onClick={() => processCheckout('CASH')}>
              Cash
            </button>
            <button className="btn bg-[var(--purple-bg)] text-[var(--purple)] hover:bg-[var(--purple)] hover:text-white h-14 text-[15px]" onClick={() => processCheckout('CARD')}>
              Credit/Debit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
