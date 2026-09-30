import React, { useState } from 'react';
import { Item } from '../types';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  Trash2,
  Archive,
  RotateCcw,
  Building2,
} from 'lucide-react';

interface ItemDetailsModalProps {
  item: Item | null;
  onClose: () => void;
  onOpenClaim: (item: Item) => void;
  onSelectCandidateItem: (candidate: Item) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onOpenClaim,
  onSelectCandidateItem,
}) => {
  const { markStatus, markAsResolved, reopenItem, deleteItem, getItemMatches } = useItems();
  const { currentUser } = useAuth();
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  if (!item) return null;

  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';
  const isResolved = item.status === 'resolved';
  const isReporter = currentUser && (currentUser.id === item.reporterId || currentUser.role === 'security');
  const matches = getItemMatches(item);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                isResolved
                  ? 'bg-slate-700 text-slate-100 flex items-center gap-1'
                  : isReunited
                  ? 'bg-emerald-600 text-white'
                  : isLost
                  ? 'bg-amber-600 text-white'
                  : 'bg-teal-700 text-white'
              }`}
            >
              {isResolved ? (
                <>
                  <Archive className="w-3.5 h-3.5" />
                  <span>Resolved & Archived</span>
                </>
              ) : isReunited ? (
                'Reunited & Returned'
              ) : isLost ? (
                'Reported Lost'
              ) : (
                'Reported Found'
              )}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-600 font-mono">ID: {item.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Resolved notice banner */}
          {isResolved && (
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-slate-600 shrink-0" />
                <span>
                  This item has been <strong>marked as resolved</strong> and archived from active search results.
                </span>
              </div>
              {isReporter && (
                <button
                  onClick={() => reopenItem(item.id)}
                  className="text-xs font-semibold text-slate-900 hover:underline shrink-0 ml-2"
                >
                  Restore to Active
                </button>
              )}
            </div>
          )}

          {/* Hero Media + Title */}
          <div className="space-y-4">
            <div className="relative aspect-16/9 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              {/* Unboxed metadata row */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700">{item.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 inline" />
                  <span className="tabular-nums">
                    {isLost ? 'Lost on' : 'Found on'} {item.date}
                  </span>
                </span>
                {item.zone && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.zone}</span>
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{item.title}</h1>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">
                  {item.location}
                  {item.specificSpot && ` (Spot: ${item.specificSpot})`}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* Custody storage location for found items */}
          {item.storageLocation && (
            <div className="p-4 bg-teal-50/70 border border-teal-200/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Safekeeping & Custody Spot</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed pl-5.5">{item.storageLocation}</p>
            </div>
          )}

          {/* Reward notice */}
          {item.reward && (
            <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Reward Offered by Owner</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed pl-5.5">{item.reward}</p>
            </div>
          )}

          {/* Reporter Contact Info Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isLost ? 'Owner Contact Details' : 'Finder / Custodian Contact'}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-semibold text-slate-900">{item.reporterName}</span>
                  {item.reporterPhoneVerified !== false && (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Phone Verified (OTP)</span>
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Prefers: {item.preferredContact}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-800 truncate">{item.reporterPhone}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(item.reporterPhone, 'phone')}
                  className="text-[11px] text-slate-600 hover:text-slate-900 font-medium ml-2 shrink-0"
                >
                  {copiedContact === 'phone' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 truncate">{item.reporterEmail}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(item.reporterEmail, 'email')}
                  className="text-[11px] text-slate-600 hover:text-slate-900 font-medium ml-2 shrink-0"
                >
                  {copiedContact === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Quick action buttons for calling / emailing */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${item.reporterPhone}`}
                className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Directly</span>
              </a>
              <a
                href={`mailto:${item.reporterEmail}?subject=${encodeURIComponent(
                  `Regarding ${item.title} on Lost & Found Portal`
                )}`}
                className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </div>

          {/* Potential Matches Section for this item */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Possible Smart Matches ({matches.length})
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">Auto-detected opposite reports</span>
            </div>

            {matches.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-100">
                No matching reports registered yet. As new reports come in, the portal will automatically connect them!
              </div>
            ) : (
              <div className="space-y-2">
                {matches.slice(0, 3).map((match, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectCandidateItem(match.candidate)}
                    className="p-3 bg-indigo-50/40 hover:bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                        <img
                          src={match.candidate.imageUrl}
                          alt={match.candidate.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              match.candidate.type === 'lost' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {match.candidate.type.toUpperCase()}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700">
                            {match.candidate.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {match.candidate.location} · {match.candidate.date}
                        </div>
                        <div className="text-[10px] text-indigo-700 mt-1">
                          {match.reasons.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <div className="text-xs font-mono font-bold text-indigo-700 tabular-nums">
                        {match.score}% Match
                      </div>
                      <div className="text-[11px] text-indigo-600 flex items-center gap-0.5 justify-end mt-1 font-medium">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reporter Control Toolbar if current user owns this report */}
          {isReporter && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Reporter Management Tools</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {/* Mark as Resolved button */}
                {!isResolved ? (
                  <button
                    onClick={() => markAsResolved(item.id)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Archive className="w-3.5 h-3.5 text-slate-300" />
                    <span>Mark as Resolved & Archive</span>
                  </button>
                ) : (
                  <button
                    onClick={() => reopenItem(item.id)}
                    className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-open Active Listing</span>
                  </button>
                )}

                {/* Mark Reunited */}
                {!isReunited && !isResolved && (
                  <button
                    onClick={() => markStatus(item.id, 'reunited')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Reunited!</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this report?')) {
                      deleteItem(item.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Report</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer Action */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isResolved
              ? 'Archived: Hidden from active search results.'
              : isReunited
              ? 'This item was successfully recovered!'
              : 'Think this matches your item?'}
          </div>

          <div className="flex items-center gap-2">
            {!isReunited && !isResolved && (
              <button
                onClick={() => {
                  onClose();
                  onOpenClaim(item);
                }}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5 ${
                  isLost ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isLost ? 'I Found This Item!' : 'Submit Claim as Owner'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
