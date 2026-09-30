import React, { useState } from 'react';
import { Item } from '../types';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Archive,
  RotateCcw,
} from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onClaim?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, onClaim }) => {
  const { getItemMatches, markAsResolved, reopenItem } = useItems();
  const { currentUser } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [resolvedToast, setResolvedToast] = useState(false);

  const matches = getItemMatches(item);
  const bestMatch = matches[0];

  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';
  const isResolved = item.status === 'resolved';

  // The user who reported the item (or a security officer) can perform 'Mark as Resolved'
  const canManage = Boolean(
    currentUser && (currentUser.id === item.reporterId || currentUser.role === 'security')
  );

  const handleToggleResolved = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isResolved) {
      reopenItem(item.id);
    } else {
      markAsResolved(item.id);
      setResolvedToast(true);
      setTimeout(() => setResolvedToast(false), 2500);
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer relative ${
        isResolved
          ? 'border-slate-300 opacity-85 bg-slate-50/70'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Visual Feedback Toast when archived */}
      {resolvedToast && (
        <div className="absolute top-2 inset-x-2 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-lg flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Marked as resolved & archived from active search!</span>
          </span>
        </div>
      )}

      {/* Image Thumbnail Slot with Zero-Broken-Image Fallback */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {!imgError && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
            <span className="text-2xl font-bold uppercase tracking-wider text-slate-300">
              {item.title.slice(0, 2)}
            </span>
            <span className="text-xs font-medium text-slate-500 mt-1">{item.category}</span>
          </div>
        )}

        {/* Clean Type & Status Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-xs ${
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
                <Archive className="w-3 h-3 text-slate-300" />
                <span>Resolved & Archived</span>
              </>
            ) : isReunited ? (
              'Reunited ✓'
            ) : isLost ? (
              'Lost Item'
            ) : (
              'Found Item'
            )}
          </span>
        </div>

        {/* Smart Match Indicator if candidate exists and not resolved */}
        {bestMatch && bestMatch.score >= 50 && !isReunited && !isResolved && (
          <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white backdrop-blur-xs text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="tabular-nums font-mono font-bold text-indigo-300">{bestMatch.score}%</span> match
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line: Unboxed text separated by dots per anti-slop rules */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5">
              <Calendar className="w-3 h-3 text-slate-400 inline" />
              <span className="tabular-nums">{item.date}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h3>

          {/* Location with Campus Zone badge if present */}
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {item.location}
              {item.specificSpot && ` · ${item.specificSpot}`}
            </span>
          </div>

          {/* Short description */}
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {item.storageLocation && (
            <div className="mt-2 text-[11px] text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-100/60 truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="truncate">Custody: {item.storageLocation}</span>
            </div>
          )}
        </div>

        {/* Card Footer: Reporter Actions & Details */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          {/* Reporter & Claim buttons row */}
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-500 truncate max-w-[145px] flex items-center gap-1">
              <span className="shrink-0">By</span>
              <span className="font-medium text-slate-700 truncate">{item.reporterName}</span>
              {item.reporterPhoneVerified !== false && (
                <span
                  title="Reporter phone number is verified via SMS OTP"
                  className="shrink-0 text-emerald-600"
                >
                  <ShieldCheck className="w-3.5 h-3.5 inline text-emerald-600" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mark as Resolved button for the reporter */}
              {canManage && (
                <button
                  type="button"
                  onClick={handleToggleResolved}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-colors text-xs flex items-center gap-1 shadow-xs ${
                    isResolved
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                  title={
                    isResolved
                      ? 'Restore this item back to active search'
                      : 'Archive this item and hide from active search'
                  }
                >
                  {isResolved ? (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      <span>Reopen</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark as Resolved</span>
                    </>
                  )}
                </button>
              )}

              {onClaim && !isReunited && !isResolved && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClaim(item);
                  }}
                  className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                    isLost
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                      : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                  }`}
                >
                  {isLost ? 'I Found This' : 'Claim Item'}
                </button>
              )}

              <span className="text-slate-400 group-hover:text-slate-700 transition-colors flex items-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
