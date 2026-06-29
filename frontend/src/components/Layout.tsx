import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-[222px] flex-shrink-0 bg-[#0d1410] border-r border-[#1a2620] flex flex-col p-0">
        <div className="p-[22px_18px_18px] border-b border-[#1a2620]">
          <h1 className="text-[15px] font-bold text-[#f5f5f0] tracking-tight">Tech-Pro+ Enterprise</h1>
          <p className="text-[10.5px] text-[var(--gold)] mt-0.5 font-mono uppercase tracking-wide">Main Branch</p>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {/* Active Navigation Item (Add Router Link handling later) */}
          <div className="flex items-center gap-2.5 p-[9px_12px] rounded-lg cursor-pointer bg-[rgba(15,139,95,0.16)] text-[#f5f5f0] border border-[rgba(15,139,95,0.3)] relative">
            <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[var(--gold)] rounded-r-sm"></div>
            Dashboard
          </div>
          <div className="flex items-center gap-2.5 p-[9px_12px] rounded-lg cursor-pointer text-[#8a9690] hover:bg-white/5 hover:text-[#f5f5f0] transition-colors mt-1">
            Point of Sale
          </div>
          {/* ... Add remaining Nav items ... */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        <div className="p-[16px_26px] border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)] shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--text)] tracking-tight">Dashboard</h2>
            <p className="text-[12px] text-[var(--text2)] mt-px">Welcome back — here's today's overview</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-[22px_26px] min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};
