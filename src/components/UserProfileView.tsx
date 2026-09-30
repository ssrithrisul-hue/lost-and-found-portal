import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { Item, ItemStatus } from '../types';
import { PhoneOtpVerification } from './PhoneOtpVerification';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Archive,
  RotateCcw,
  Trash2,
  Plus,
  ExternalLink,
  Calendar,
  MapPin,
  Sparkles,
  Smartphone,
  X,
} from 'lucide-react';

interface UserProfileViewProps {
  onSelectItem: (item: Item) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onSelectItem,
  onOpenReportModal,
}) => {
  const { currentUser, updateProfile } = useAuth();
  const { items, markAsResolved, reopenItem, deleteItem } = useItems();

  // Profile Form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP verification modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Sub-filter for user's items
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [itemStatusFilter, setItemStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const handleOtpVerified = () => {
    const result = updateProfile({
      phone: phoneToVerify,
      isPhoneVerified: true,
      phoneVerifiedAt: new Date().toISOString(),
    });
    setIsOtpModalOpen(false);
    if (result.success) {
      setPhone(phoneToVerify);
      setFeedback({
        type: 'success',
        message: `Phone number ${phoneToVerify} has been successfully verified with OTP!`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({
        type: 'error',
        message: result.error || 'Failed to update phone verification status.',
      });
    }
  };

  const openOtpVerification = (targetPhone?: string) => {
    const clean = (targetPhone || phone || currentUser?.phone || '').trim();
    if (!clean || clean.replace(/\D/g, '').length < 6) {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid phone number before starting OTP verification.',
      });
      return;
    }
    setPhoneToVerify(clean);
    setIsOtpModalOpen(true);
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Please Sign In</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Log in or register an account to view and edit your profile credentials and manage your reported items.
        </p>
      </div>
    );
  }

  // Get items reported by current user
  const myItems = items.filter(item => item.reporterId === currentUser.id);

  const filteredMyItems = myItems.filter(item => {
    if (itemTypeFilter !== 'all' && item.type !== itemTypeFilter) {
      return false;
    }
    if (itemStatusFilter === 'active' && item.status === 'resolved') {
      return false;
    }
    if (itemStatusFilter === 'resolved' && item.status !== 'resolved') {
      return false;
    }
    return true;
  });

  const totalLost = myItems.filter(i => i.type === 'lost').length;
  const totalFound = myItems.filter(i => i.type === 'found').length;
  const totalResolved = myItems.filter(i => i.status === 'resolved').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }
    if (!email.trim()) {
      setFeedback({ type: 'error', message: 'Email cannot be empty.' });
      return;
    }
    if (!phone.trim()) {
      setFeedback({ type: 'error', message: 'Phone number cannot be empty.' });
      return;
    }

    // Password validation if attempting to change password
    const updates: Partial<typeof currentUser> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
        return;
      }
      updates.password = newPassword.trim();
    }

    const result = updateProfile(updates);
    if (!result.success) {
      setFeedback({ type: 'error', message: result.error || 'Failed to update profile.' });
    } else {
      setFeedback({ type: 'success', message: 'Profile details and credentials updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-bold text-2xl flex items-center justify-center border-2 border-slate-100 shadow-sm">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded capitalize">
                {currentUser.role || 'Member'}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.email}</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </span>
              {currentUser.isPhoneVerified ? (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
                  title={
                    currentUser.phoneVerifiedAt
                      ? `Verified via OTP on ${new Date(currentUser.phoneVerifiedAt).toLocaleDateString()}`
                      : 'Phone verified via OTP'
                  }
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Phone Verified</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => openOtpVerification(currentUser.phone)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  title="Verify this phone number using a 6-digit SMS OTP"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verify Phone via OTP</span>
                </button>
              )}
              <span className="text-slate-400">·</span>
              <span>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Report CTAs */}
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

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-slate-500 font-medium">Total Reported</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {myItems.length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-amber-700 font-medium">Lost Items</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {totalLost}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-teal-700 font-medium">Found Items</div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
            {totalFound}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-slate-600 font-medium">Resolved / Archived</div>
          <div className="text-2xl font-bold font-mono text-slate-800 mt-1 tabular-nums">
            {totalResolved}
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Left = Edit Profile Credentials, Right = My Reported Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: View & Edit Profile Info */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Account Credentials & Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit your contact information and update your account password.
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Phone Number</label>
                {currentUser.isPhoneVerified && phone.trim() === currentUser.phone ? (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>OTP Verified</span>
                  </span>
                ) : phone.trim() !== currentUser.phone ? (
                  <button
                    type="button"
                    onClick={() => openOtpVerification(phone)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Verify New Number with OTP</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openOtpVerification(phone)}
                    className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Verify Phone with OTP</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 font-mono"
                />
              </div>
              {phone.trim() !== currentUser.phone && (
                <div className="mt-1.5 p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center justify-between">
                  <span>Phone number modified. OTP verification required to verify this number.</span>
                  <button
                    type="button"
                    onClick={() => openOtpVerification(phone)}
                    className="font-bold underline text-amber-900 hover:text-amber-950 ml-1 shrink-0 cursor-pointer"
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </div>

            {/* Password Update Section */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">Change Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password (leave blank to keep current)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                />
              </div>

              {newPassword && (
                <div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                  />
                </div>
              )}
              <span className="text-[11px] text-slate-400 block">
                Minimum 6 characters. Used to secure your reporter contact and verification claims.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs flex items-center justify-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: List of Items Reported as Lost or Found */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Items You Have Reported</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your active and resolved lost and found listings.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
              {filteredMyItems.length} item{filteredMyItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Sub-Filters for Reported Items */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            {/* Type filter */}
            <div className="flex p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setItemTypeFilter('all')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  itemTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setItemTypeFilter('lost')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  itemTypeFilter === 'lost' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Lost ({totalLost})
              </button>
              <button
                type="button"
                onClick={() => setItemTypeFilter('found')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  itemTypeFilter === 'found' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Found ({totalFound})
              </button>
            </div>

            {/* Status filter: Active vs Resolved */}
            <div className="flex p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setItemStatusFilter('all')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  itemStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Statuses
              </button>
              <button
                type="button"
                onClick={() => setItemStatusFilter('active')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  itemStatusFilter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Active Only
              </button>
              <button
                type="button"
                onClick={() => setItemStatusFilter('resolved')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  itemStatusFilter === 'resolved'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Resolved ({totalResolved})
              </button>
            </div>
          </div>

          {/* List of Reported Items */}
          {filteredMyItems.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center space-y-3">
              <Archive className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No reported items match the selected filter.</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => onOpenReportModal('lost')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                >
                  Report Lost Item
                </button>
                <button
                  onClick={() => onOpenReportModal('found')}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold"
                >
                  Report Found Item
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMyItems.map(item => {
                const isResolved = item.status === 'resolved';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isResolved
                        ? 'bg-slate-50/70 border-slate-200 opacity-85'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              item.type === 'lost'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {item.type.toUpperCase()}
                          </span>

                          {isResolved && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 flex items-center gap-0.5">
                              <Archive className="w-2.5 h-2.5" />
                              <span>RESOLVED (ARCHIVED)</span>
                            </span>
                          )}

                          <span className="text-xs text-slate-500">{item.category}</span>
                        </div>

                        <h3
                          onClick={() => onSelectItem(item)}
                          className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                        >
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 truncate">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </span>
                          <span>·</span>
                          <span className="tabular-nums">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for this item */}
                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                      {/* Mark as Resolved button */}
                      {!isResolved ? (
                        <button
                          onClick={() => markAsResolved(item.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          title="Archive and hide this item from active search results"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark as Resolved</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => reopenItem(item.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors flex items-center gap-1"
                          title="Restore item back to active search"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reopen Listing</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectItem(item)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Permanently delete this report?')) deleteItem(item.id);
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Phone OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Verify Phone Number</h3>
                <p className="text-xs text-slate-500 mt-0.5">Secure your profile credentials with OTP</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <PhoneOtpVerification
                phone={phoneToVerify}
                onVerified={handleOtpVerified}
                onCancel={() => setIsOtpModalOpen(false)}
                title="Verify Phone Number with OTP"
                subtitle={`Enter the 6-digit OTP code sent to ${phoneToVerify} to verify this number.`}
                actionLabel="Verify & Update Phone"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
