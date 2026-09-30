import React from 'react';
import { useItems } from '../context/ItemsContext';
import { Sparkles, ShieldCheck, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';

interface StatsBannerProps {
  onReportLost: () => void;
  onReportFound: () => void;
  onViewMatches: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  onReportLost,
  onReportFound,
  onViewMatches,
}) => {
  const { items, allMatches } = useItems();

  const lostCount = items.filter(i => i.type === 'lost' && i.status !== 'reunited').length;
  const foundCount = items.filter(i => i.type === 'found' && i.status !== 'reunited').length;
  const reunitedCount = items.filter(i => i.status === 'reunited').length;

  return (
    <div className="mb-8">
      {/* Hero Headline & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <span>SRM Campus Community Portal</span>
            <span aria-hidden="true">·</span>
            <span>Live Property Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Recover lost belongings, register found items, and connect with owners.
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            A centralized lost-and-found system for students, faculty, and security personnel. Search items by keyword, check automated smart matches, and verify ownership securely.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReportLost}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Report Lost Item</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onReportFound}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Report Found Item</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-500">Currently Lost</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">{lostCount}</span>
            <span className="text-[11px] text-slate-500">reported</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-500">Found Belongings</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-teal-700 tabular-nums">{foundCount}</span>
            <span className="text-[11px] text-slate-500">awaiting owner</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-500">Reunited Items</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">{reunitedCount}</span>
            <span className="text-[11px] text-emerald-600 font-medium">recovered ✓</span>
          </div>
        </div>

        <button
          onClick={onViewMatches}
          className="p-4 bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col justify-between text-left transition-colors group cursor-pointer"
        >
          <div className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Smart Match Signals</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">{allMatches.length}</span>
              <span className="text-[11px] text-indigo-600">potential pairs</span>
            </div>
            <span className="text-xs font-medium text-indigo-700 group-hover:translate-x-0.5 transition-transform">
              Review →
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
