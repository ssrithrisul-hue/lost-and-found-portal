import React, { useState } from 'react';
import { Item } from '../types';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, Check, AlertCircle, Phone, Mail } from 'lucide-react';

interface ClaimModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, isOpen, onClose }) => {
  const { submitClaim } = useItems();
  const { currentUser } = useAuth();

  const [claimantName, setClaimantName] = useState(currentUser?.name || '');
  const [claimantEmail, setClaimantEmail] = useState(currentUser?.email || '');
  const [claimantPhone, setClaimantPhone] = useState(currentUser?.phone || '');
  const [message, setMessage] = useState('');
  const [identifyingProof, setIdentifyingProof] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const isLostReport = item.type === 'lost';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!claimantName.trim() || !claimantEmail.trim() || !claimantPhone.trim()) {
      setError('Please provide your name, email, and phone number.');
      return;
    }

    if (!identifyingProof.trim()) {
      setError('Please provide identifying proof details so the reporter can verify ownership.');
      return;
    }

    submitClaim({
      itemId: item.id,
      itemTitle: item.title,
      claimantId: currentUser?.id || `claimant_${Date.now()}`,
      claimantName: claimantName.trim(),
      claimantEmail: claimantEmail.trim(),
      claimantPhone: claimantPhone.trim(),
      claimantPhoneVerified: Boolean(currentUser?.isPhoneVerified && claimantPhone.trim() === currentUser?.phone),
      message: message.trim() || `I am contacting you regarding ${item.title}.`,
      identifyingProof: identifyingProof.trim(),
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setMessage('');
      setIdentifyingProof('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              {isLostReport ? 'Notify Owner: I Found Your Item' : 'Claim Ownership of Found Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Preview Strip */}
        <div className="px-6 py-3 bg-slate-100/60 border-b border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-200 overflow-hidden shrink-0">
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate text-xs">
            <span className="font-semibold text-slate-900">{item.title}</span>
            <span className="text-slate-500 block truncate">{item.location} · Reported by {item.reporterName}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Claim submitted! The reporter has been notified and can view your details.</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={claimantName}
                onChange={e => setClaimantName(e.target.value)}
                placeholder="e.g. Sudharsan B"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  {currentUser?.isPhoneVerified && claimantPhone.trim() === currentUser?.phone && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>OTP Verified</span>
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  value={claimantPhone}
                  onChange={e => setClaimantPhone(e.target.value)}
                  placeholder="+91 98401 23456"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={e => setClaimantEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Identifying Proof / Distinctive Features <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={identifyingProof}
                onChange={e => setIdentifyingProof(e.target.value)}
                placeholder={
                  isLostReport
                    ? 'Describe where you found it, where it is kept right now, or when you can hand it over...'
                    : 'Describe specific unique identifiers (e.g., student ID name/reg number inside, unique stickers, wallpaper, scratches) to verify ownership.'
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 leading-relaxed"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                This verification step protects belongings against unauthorized claims.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Message / Meeting Details (Optional)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Let them know your availability or propose a campus pickup location (e.g. Main Gate Security Post at 4 PM)..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Send Verification Claim</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
