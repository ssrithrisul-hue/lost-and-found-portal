import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { Item, Claim } from '../types';
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Plus,
  Clock,
  Check,
  X as CloseIcon,
  ChevronRight,
  Eye,
  Archive,
  RotateCcw,
} from 'lucide-react';

interface MyReportsViewProps {
  onSelectItem: (item: Item) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({ onSelectItem, onOpenReportModal }) => {
  const { currentUser } = useAuth();
  const { items, claims, updateClaimStatus, markStatus, markAsResolved, reopenItem, deleteItem } = useItems();
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'claims'>('items');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Please Log In</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Sign in or register an account to view and manage your reported items and received claims.
        </p>
      </div>
    );
  }

  const myItems = items.filter(i => i.reporterId === currentUser.id);
  const myItemIds = new Set(myItems.map(i => i.id));
  const receivedClaims = claims.filter(c => myItemIds.has(c.itemId));

  const myLostCount = myItems.filter(i => i.type === 'lost').length;
  const myFoundCount = myItems.filter(i => i.type === 'found').length;
  const myReunitedCount = myItems.filter(i => i.status === 'reunited').length;

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center border-2 border-slate-100 shadow-xs">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded capitalize">
                {currentUser.role || 'Member'}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.email}</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </span>
              {currentUser.isPhoneVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Phone Verified (OTP)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenReportModal('lost')}
            className="px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => onOpenReportModal('found')}
            className="px-3.5 py-2 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-slate-400 font-medium">Total Reported</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {myItems.length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-amber-700 font-medium">Lost Items</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {myLostCount}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-teal-700 font-medium">Found Items</div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
            {myFoundCount}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-emerald-700 font-medium">Reunited & Returned</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {myReunitedCount}
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('items')}
          className={`pb-3 px-4 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'items'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>My Published Items</span>
          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
            {myItems.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('claims')}
          className={`pb-3 px-4 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'claims'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Received Verification Claims</span>
          <span className="font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
            {receivedClaims.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Published Items */}
      {activeSubTab === 'items' && (
        <div>
          {myItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <h3 className="text-sm font-semibold text-slate-900">You haven&apos;t reported any items yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Did you lose a belonging on campus, or did you find something that belongs to someone else?
              </p>
              <button
                onClick={() => onOpenReportModal('lost')}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Report an Item Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.status === 'reunited'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.type === 'lost'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {item.status === 'reunited' ? 'REUNITED' : item.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">{item.category}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 tabular-nums">{item.date}</span>
                      </div>
                      <h4
                        onClick={() => onSelectItem(item)}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{item.description}</p>
                      <div className="text-[11px] text-slate-500 mt-1">Location: {item.location}</div>
                    </div>
                  </div>

                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {item.status !== 'resolved' ? (
                      <button
                        onClick={() => markAsResolved(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        title="Archive and hide from active search"
                      >
                        <Archive className="w-3.5 h-3.5 text-slate-300" />
                        <span>Mark as Resolved</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => reopenItem(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors flex items-center gap-1"
                        title="Restore item to active search"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reopen</span>
                      </button>
                    )}

                    {item.status !== 'reunited' && item.status !== 'resolved' && (
                      <button
                        onClick={() => markStatus(item.id, 'reunited')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Reunited!</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Delete this report?')) deleteItem(item.id);
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Claims Received */}
      {activeSubTab === 'claims' && (
        <div>
          {receivedClaims.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No claims or inquiries received on your reports yet.
            </div>
          ) : (
            <div className="space-y-4">
              {receivedClaims.map(claim => {
                const item = items.find(i => i.id === claim.itemId);

                return (
                  <div
                    key={claim.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs text-slate-500">
                          Claim for:{' '}
                          <strong className="text-slate-900">{claim.itemTitle}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Received on {new Date(claim.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                          claim.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {claim.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Claimant Contact Details */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                        <div className="font-semibold text-slate-900">{claim.claimantName}</div>
                        <div className="text-slate-600 flex items-center justify-between font-mono">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{claim.claimantPhone}</span>
                          </span>
                          {claim.claimantPhoneVerified !== false && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-sans font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>OTP Verified</span>
                            </span>
                          )}
                        </div>
                        <div className="text-slate-600 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{claim.claimantEmail}</span>
                        </div>
                      </div>

                      {/* Identifying Proof Submitted */}
                      <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 space-y-1">
                        <div className="font-bold text-indigo-950 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Submitted Verification Proof:</span>
                        </div>
                        <p className="text-indigo-900 leading-relaxed italic">
                          &ldquo;{claim.identifyingProof}&rdquo;
                        </p>
                      </div>
                    </div>

                    {claim.message && (
                      <div className="text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                        <strong>Message:</strong> {claim.message}
                      </div>
                    )}

                    {/* Resolution Actions */}
                    {claim.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => updateClaimStatus(claim.id, 'declined')}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CloseIcon className="w-3.5 h-3.5" />
                          <span>Decline Claim</span>
                        </button>
                        <button
                          onClick={() => {
                            updateClaimStatus(claim.id, 'accepted');
                            if (item) markStatus(item.id, 'reunited');
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Hand Over (Mark Reunited)</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
