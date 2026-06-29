import React, { useState } from 'react';

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockCustomers = [
    { id: 'CUS-001', name: 'Alice Walker', phone: '(416) 555-0198', loyaltyPoints: 450, tier: 'Silver', totalSpent: 1250.00 },
    { id: 'CUS-002', name: 'Robert Chen', phone: '(647) 555-8821', loyaltyPoints: 1200, tier: 'Gold', totalSpent: 3400.00 },
    { id: 'CUS-003', name: 'Sarah Miller', phone: '(905) 555-3341', loyaltyPoints: 50, tier: 'Bronze', totalSpent: 150.00 },
  ];

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'Gold': return 'text-[var(--gold)] bg-[var(--gold-bg)] border-[var(--gold)]';
      case 'Silver': return 'text-[#7f8c8d] bg-[#ecf0f1] border-[#bdc3c7]';
      case 'Platinum': return 'text-[var(--purple)] bg-[var(--purple-bg)] border-[var(--purple)]';
      default: return 'text-[var(--text2)] bg-[var(--surface3)] border-[var(--border)]';
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center">
        <div className="relative w-[300px]">
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full p-2.5 pl-3 border border-[var(--border)] rounded-[8px] focus:outline-none focus:border-[var(--accent)] bg-[var(--surface)] text-[13px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">+ Add Customer</button>
      </div>

      <div className="card flex-1 p-0 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--surface2)] text-[11px] uppercase tracking-wide text-[var(--text2)] sticky top-0 border-b border-[var(--border)]">
              <tr>
                <th className="p-4 font-semibold">Customer Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Loyalty Tier</th>
                <th className="p-4 font-semibold text-right">Lifetime Value</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map(customer => (
                <tr key={customer.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors cursor-pointer">
                  <td className="p-4">
                    <div className="font-bold text-[var(--text)]">{customer.name}</div>
                    <div className="text-[11px] font-mono text-[var(--text3)] mt-0.5">{customer.id}</div>
                  </td>
                  <td className="p-4 text-[13px] text-[var(--text2)]">{customer.phone}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border uppercase tracking-wider ${getTierColor(customer.tier)}`}>
                        {customer.tier}
                      </span>
                      <span className="text-[12px] font-mono font-medium text-[var(--text2)]">{customer.loyaltyPoints} pts</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold">${customer.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
