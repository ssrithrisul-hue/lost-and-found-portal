import React, { useState } from 'react';
import { useItems } from '../context/ItemsContext';
import { Item, MatchScore } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

interface SmartMatchesViewProps {
  onSelectItem: (item: Item) => void;
  onOpenClaim: (item: Item) => void;
}

export const SmartMatchesView: React.FC<SmartMatchesViewProps> = ({ onSelectItem, onOpenClaim }) => {
  const { allMatches, markStatus } = useItems();
  const [comparingPair, setComparingPair] = useState<MatchScore | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI & Text Pattern Matching Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Possible Lost & Found Matches
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            The portal analyzes keywords, item categories, campus locations, and reporting timestamps to automatically pair lost belongings with found items.
          </p>
        </div>
      </div>

      {/* Matches List */}
      {allMatches.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No active match pairs detected yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            When users register lost and found items with overlapping categories or keywords, potential pairs will show up here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Detected <strong className="text-slate-900 tabular-nums">{allMatches.length}</strong> candidate match pair{allMatches.length > 1 ? 's' : ''}
            </span>
            <span>Sorted by match confidence</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {allMatches.map((pair, idx) => {
              const lost = pair.item;
              const found = pair.candidate;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left: Lost Item */}
                  <div className="flex-1 flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={lost.imageUrl}
                        alt={lost.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          LOST ITEM
                        </span>
                        <span className="text-xs text-slate-500">{lost.category}</span>
                      </div>
                      <h4
                        onClick={() => onSelectItem(lost)}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {lost.title}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{lost.location}</span>
                        <span>·</span>
                        <span className="tabular-nums">{lost.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate">
                        Reported by: <span className="font-medium text-slate-700">{lost.reporterName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Match Bridge */}
                  <div className="flex flex-col items-center justify-center shrink-0 px-4 py-2 bg-indigo-50/70 border border-indigo-100/80 rounded-xl text-center min-w-[150px]">
                    <div className="flex items-center gap-1 text-indigo-700 text-xs font-bold font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-base tabular-nums">{pair.score}%</span> MATCH
                    </div>
                    <div className="text-[10px] text-indigo-600 mt-1 max-w-[170px] leading-tight">
                      {pair.reasons[0] || 'High correlation'}
                    </div>
                    {pair.reasons[1] && (
                      <div className="text-[9px] text-indigo-500 mt-0.5 max-w-[170px] truncate">
                        {pair.reasons[1]}
                      </div>
                    )}
                  </div>

                  {/* Right: Found Item */}
                  <div className="flex-1 flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={found.imageUrl}
                        alt={found.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                          FOUND ITEM
                        </span>
                        <span className="text-xs text-slate-500">{found.category}</span>
                      </div>
                      <h4
                        onClick={() => onSelectItem(found)}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {found.title}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{found.location}</span>
                        <span>·</span>
                        <span className="tabular-nums">{found.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate">
                        Custodian: <span className="font-medium text-slate-700">{found.reporterName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                    <button
                      type="button"
                      onClick={() => setComparingPair(pair)}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Compare Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenClaim(found)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Claim Found Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {comparingPair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Side-by-Side Comparison ({comparingPair.score}% Match)
                </h3>
              </div>
              <button
                onClick={() => setComparingPair(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Match Factors */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1">
                <h4 className="font-bold text-indigo-950 text-xs">Match Signals Identified:</h4>
                <ul className="list-disc list-inside text-indigo-800 space-y-0.5">
                  {comparingPair.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* 2-Column Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Lost Column */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 space-y-3">
                  <div className="text-amber-800 font-bold uppercase tracking-wider text-[11px]">
                    Lost Item Report
                  </div>
                  <div className="aspect-16/9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={comparingPair.item.imageUrl}
                      alt={comparingPair.item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{comparingPair.item.title}</h3>
                  <div className="space-y-1 text-slate-600">
                    <div><strong>Category:</strong> {comparingPair.item.category}</div>
                    <div><strong>Lost At:</strong> {comparingPair.item.location}</div>
                    <div><strong>Date Lost:</strong> {comparingPair.item.date}</div>
                    <div><strong>Description:</strong> {comparingPair.item.description}</div>
                    <div><strong>Reporter:</strong> {comparingPair.item.reporterName} ({comparingPair.item.reporterPhone})</div>
                  </div>
                </div>

                {/* Found Column */}
                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/20 space-y-3">
                  <div className="text-teal-800 font-bold uppercase tracking-wider text-[11px]">
                    Found Item Report
                  </div>
                  <div className="aspect-16/9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={comparingPair.candidate.imageUrl}
                      alt={comparingPair.candidate.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{comparingPair.candidate.title}</h3>
                  <div className="space-y-1 text-slate-600">
                    <div><strong>Category:</strong> {comparingPair.candidate.category}</div>
                    <div><strong>Found At:</strong> {comparingPair.candidate.location}</div>
                    <div><strong>Date Found:</strong> {comparingPair.candidate.date}</div>
                    <div><strong>Description:</strong> {comparingPair.candidate.description}</div>
                    {comparingPair.candidate.storageLocation && (
                      <div className="text-teal-900 font-medium">
                        <strong>Storage Spot:</strong> {comparingPair.candidate.storageLocation}
                      </div>
                    )}
                    <div><strong>Custodian:</strong> {comparingPair.candidate.reporterName} ({comparingPair.candidate.reporterPhone})</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Are these the same item? You can mark them resolved or submit a verification claim.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    markStatus(comparingPair.item.id, 'reunited');
                    markStatus(comparingPair.candidate.id, 'reunited');
                    setComparingPair(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Both as Reunited!</span>
                </button>
                <button
                  onClick={() => setComparingPair(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
