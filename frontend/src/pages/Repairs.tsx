import React, { useState } from 'react';

const COLUMNS = [
  { id: 'RECEIVED', label: 'Received', color: 'var(--amber)' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'var(--purple)' },
  { id: 'READY_PICKUP', label: 'Ready for Pickup', color: 'var(--accent)' },
  { id: 'COMPLETED', label: 'Completed', color: 'var(--text2)' },
];

export const Repairs = () => {
  const [tickets] = useState([
    { id: 'REP-001', customer: 'John Doe', device: 'iPhone 13 Pro', issue: 'Screen Replacement', status: 'RECEIVED' },
    { id: 'REP-002', customer: 'Jane Smith', device: 'Samsung S22', issue: 'Battery Drain', status: 'IN_PROGRESS' },
  ]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[18px] font-bold">Repair Pipeline</h2>
        <button className="btn btn-primary">+ New Ticket</button>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div key={col.id} className="min-w-[300px] w-[300px] bg-[var(--surface2)] rounded-[12px] p-3 border border-[var(--border)] flex flex-col">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-[13px] font-bold tracking-wide uppercase" style={{ color: col.color }}>{col.label}</h3>
              <span className="bg-[var(--surface3)] text-[var(--text2)] px-2 py-0.5 rounded-full text-[11px] font-bold">
                {tickets.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {tickets.filter(t => t.status === col.id).map(ticket => (
                <div key={ticket.id} className="card p-3.5 cursor-pointer hover:border-[var(--accent)] transition-colors group">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[var(--accent)] bg-[var(--green-bg)] px-1.5 py-0.5 rounded">{ticket.id}</span>
                    <span className="w-6 h-6 rounded-full bg-[var(--surface3)] text-[10px] flex items-center justify-center font-bold text-[var(--text2)] border border-[var(--border2)]">
                      {ticket.customer.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-bold text-[14px] text-[var(--text)] mb-0.5">{ticket.device}</h4>
                  <p className="text-[12px] text-[var(--text2)] leading-tight">{ticket.issue}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
