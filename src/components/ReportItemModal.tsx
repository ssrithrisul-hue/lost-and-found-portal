import React, { useState, useEffect } from 'react';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { ItemCategory, ItemType } from '../types';
import { CATEGORIES, COMMON_LOCATIONS, CAMPUS_ZONES } from '../data/initialData';
import { X, Upload, Check, AlertCircle, Camera, Image as ImageIcon, MapPin, Calendar, ShieldCheck, Building2 } from 'lucide-react';

import walletImg from '../assets/images/lost_black_wallet_1790791346780.jpg';
import airpodsImg from '../assets/images/lost_airpods_case_1790791362460.jpg';
import keysImg from '../assets/images/lost_campus_keys_1790791376458.jpg';
import bottleImg from '../assets/images/found_water_bottle_1790791387767.jpg';

interface ReportItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'lost' | 'found';
}

const PRESET_IMAGES = [
  { label: 'Leather Wallet', url: walletImg },
  { label: 'AirPods / Earbuds', url: airpodsImg },
  { label: 'Lanyard & Keys', url: keysImg },
  { label: 'Thermos Bottle', url: bottleImg },
];

export const ReportItemModal: React.FC<ReportItemModalProps> = ({ isOpen, onClose, initialType = 'lost' }) => {
  const { reportItem } = useItems();
  const { currentUser } = useAuth();

  const [type, setType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Personal Item');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('Tech Park');
  const [specificSpot, setSpecificSpot] = useState('');
  const [date, setDate] = useState('2026-09-30');
  const [imageUrl, setImageUrl] = useState(walletImg);
  const [storageLocation, setStorageLocation] = useState('With finder');
  const [reward, setReward] = useState('');

  // Contact details
  const [reporterName, setReporterName] = useState(currentUser?.name || '');
  const [reporterPhone, setReporterPhone] = useState(currentUser?.phone || '');
  const [reporterEmail, setReporterEmail] = useState(currentUser?.email || '');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'whatsapp' | 'in-app' | 'any'>('phone');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  useEffect(() => {
    if (currentUser) {
      setReporterName(currentUser.name);
      setReporterPhone(currentUser.phone);
      setReporterEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter the item name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description.');
      return;
    }
    if (!location.trim()) {
      setError('Please provide the location.');
      return;
    }
    if (!reporterName.trim() || !reporterPhone.trim() || !reporterEmail.trim()) {
      setError('Please provide your contact name, phone number, and email.');
      return;
    }

    reportItem({
      type,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      zone,
      specificSpot: specificSpot.trim() || undefined,
      date,
      imageUrl,
      reporterId: currentUser?.id || `anon_${Date.now()}`,
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim(),
      reporterPhoneVerified: Boolean(currentUser?.isPhoneVerified && reporterPhone.trim() === currentUser?.phone),
      reporterEmail: reporterEmail.trim(),
      preferredContact,
      storageLocation: type === 'found' ? storageLocation.trim() : undefined,
      reward: type === 'lost' && reward.trim() ? reward.trim() : undefined,
      tags: [title, category, location, zone, specificSpot].filter(Boolean).map(s => s.toLowerCase()),
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setReward('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {type === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details to list this item on the university portal and trigger smart matching.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Type Segmented Toggle */}
        <div className="px-6 pt-4">
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                type === 'lost'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              I Lost Something (Report Lost)
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                type === 'found'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              I Found Something (Report Found)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Report submitted successfully! Now searching for possible matches...</span>
            </div>
          )}

          {/* Section 1: Item Specifics */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={type === 'lost' ? 'e.g. Black Wallet' : 'e.g. Black Leather Bifold Wallet'}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date {type === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Campus Zone</span>
                </label>
                <select
                  value={zone}
                  onChange={e => {
                    const newZone = e.target.value;
                    setZone(newZone);
                    if (!location || COMMON_LOCATIONS.some(l => l.includes(zone))) {
                      setLocation(`SRM Campus - ${newZone}`);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                >
                  {CAMPUS_ZONES.map(z => (
                    <option key={z.name} value={z.name}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Specific Spot / Floor</span>
                </label>
                <input
                  type="text"
                  value={specificSpot}
                  onChange={e => setSpecificSpot(e.target.value)}
                  placeholder="e.g. 2nd Floor Study Tables, Lobby Bench"
                  list="zone-spots"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
                <datalist id="zone-spots">
                  {CAMPUS_ZONES.find(z => z.name === zone)?.spots.map(spot => (
                    <option key={spot} value={spot} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Location Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. SRM Campus - Main Tech Park 3rd Floor, SRM Central Library"
                list="location-options"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
              <datalist id="location-options">
                {COMMON_LOCATIONS.map(loc => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={
                  type === 'lost'
                    ? 'Black leather wallet containing college ID card, student pass, and cash...'
                    : 'Found on table 14 near the reference racks. Brought to the circulation counter...'
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 leading-relaxed"
              />
            </div>

            {type === 'found' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Storage / Custody Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storageLocation}
                  onChange={e => setStorageLocation(e.target.value)}
                  placeholder="e.g. Main Gate Security Office, Locker 4B or With finder"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Let the owner know where they can safely inspect or collect the item.
                </span>
              </div>
            )}

            {type === 'lost' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reward / Token of Appreciation (Optional)
                </label>
                <input
                  type="text"
                  value={reward}
                  onChange={e => setReward(e.target.value)}
                  placeholder="e.g. Gratitude & Coffee treat, Cash token"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Section 2: Photo Selection */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Item Photo
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Photo Preview */}
              <div className="w-28 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative group">
                <img
                  src={imageUrl}
                  alt="Item preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload & Presets */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">or pick a sample:</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2 py-1 text-[11px] rounded border transition-colors ${
                        imageUrl === preset.url
                          ? 'border-slate-900 bg-slate-900 text-white font-medium'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Reporter Contact Details */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Reporter Contact Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  placeholder="e.g. Sudharsan B"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  {currentUser?.isPhoneVerified && reporterPhone.trim() === currentUser?.phone && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>OTP Verified</span>
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  value={reporterPhone}
                  onChange={e => setReporterPhone(e.target.value)}
                  placeholder="e.g. +91 98401 23456"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={reporterEmail}
                  onChange={e => setReporterEmail(e.target.value)}
                  placeholder="e.g. bsudharsan232@gmail.com"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Contact Channel
                </label>
                <select
                  value={preferredContact}
                  onChange={e => setPreferredContact(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                >
                  <option value="phone">Direct Phone Call</option>
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="email">Email</option>
                  <option value="any">Any of the above</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors ${
                type === 'lost'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-teal-700 hover:bg-teal-800'
              }`}
            >
              {type === 'lost' ? 'Publish Lost Item Report' : 'Publish Found Item Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
