import React from 'react';

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-5">
        <div className="card relative overflow-hidden group hover:border-[var(--border2)] transition-colors">
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[var(--border2)]"></div>
          <div className="text-[11px] text-[var(--text2)] uppercase tracking-wide font-semibold">Today's Sales</div>
          <div className="text-[27px] font-extrabold mt-1 font-mono tracking-tight text-[var(--accent)]">$1,249.00</div>
          <div className="text-[11px] text-[var(--text3)] mt-0.5">8 invoices</div>
        </div>
        {/* Replicate other stat cards... */}
      </div>
      
      {/* Quick Actions Replicated */}
      <div className="card mt-3">
        <div className="text-[11.5px] font-bold text-[var(--text2)] uppercase tracking-wide mb-3.5 flex items-center gap-1.5">
          <span className="w-[3px] h-[11px] bg-[var(--gold)] rounded-[1px] inline-block"></span> Quick Actions
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button className="btn btn-secondary flex-col h-auto py-3.5">
             New Sale
          </button>
          <button className="btn btn-secondary flex-col h-auto py-3.5">
             Intake Repair
          </button>
        </div>
      </div>
    </div>
  );
};
