import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PhoneOtpVerification } from './PhoneOtpVerification';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Check,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, register, users, sendOtp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [regStep, setRegStep] = useState<'details' | 'otp'>('details');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'staff' | 'security' | 'member'>('student');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        return;
      }
      const res = login(email);
      if (!res.success) {
        setError(res.error || 'Failed to sign in.');
      } else {
        setSuccess('Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 700);
      }
    } else {
      // Register Step 1 validation
      if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
        setError('Please fill out all required fields.');
        return;
      }

      if (password.trim().length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 8) {
        setError('Please provide a valid phone number (at least 8-10 digits).');
        return;
      }

      // Check if email is already taken
      const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }

      // Dispatch OTP and transition to OTP verification step
      const otpRes = sendOtp(phone.trim());
      if (!otpRes.success) {
        setError(otpRes.error || 'Could not send verification code.');
        return;
      }

      setRegStep('otp');
    }
  };

  const handleOtpVerified = () => {
    // Register user with phone verified flag
    const res = register(name, email, phone, password, role, true);
    if (!res.success) {
      setError(res.error || 'Registration failed.');
      setRegStep('details');
    } else {
      setSuccess('Phone verified & account created successfully! Welcome to the portal.');
      setTimeout(() => {
        onClose();
        // Reset states
        setRegStep('details');
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
      }, 1000);
    }
  };

  const quickLoginAs = (userEmail: string) => {
    login(userEmail);
    setSuccess('Signed in as demo user!');
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'login'
                ? 'Sign In to Your Account'
                : regStep === 'otp'
                ? 'Verify Mobile Number'
                : 'Create Verified Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login'
                ? 'Lost & Found Portal authentication'
                : regStep === 'otp'
                ? 'Step 2: SMS OTP Verification'
                : 'Step 1: Account credentials & contact'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (only shown on step 1) */}
        {regStep === 'details' && (
          <div className="px-6 pt-4">
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Multi-step progress badge for registration */}
        {mode === 'register' && (
          <div className="px-6 pt-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  regStep === 'details'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {regStep === 'otp' ? (
                  <Check className="w-3 h-3 text-emerald-700" />
                ) : (
                  <span>1</span>
                )}
                <span>Profile Details</span>
              </div>
              <div className="h-0.5 w-4 bg-slate-200" />
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  regStep === 'otp'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Phone OTP</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {error && regStep === 'details' && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Registration Step 2: OTP Verification */}
          {mode === 'register' && regStep === 'otp' ? (
            <PhoneOtpVerification
              phone={phone}
              onVerified={handleOtpVerified}
              onCancel={() => {
                setRegStep('details');
                setError(null);
              }}
              onEditPhone={() => {
                setRegStep('details');
                setError(null);
              }}
              title="Verify Mobile Number"
              subtitle="To ensure safety and verified communication for lost items, verify your phone number with the 6-digit OTP."
              actionLabel="Verify OTP & Complete Registration"
            />
          ) : (
            /* Details Form (Login or Register Step 1) */
            <form onSubmit={handleDetailsSubmit} className="space-y-3.5 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sudharsan B"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. bsudharsan232@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-slate-700">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>OTP Verified</span>
                      </span>
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
                        placeholder="+91 98401 23456"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      A 6-digit OTP verification code will be sent to this number.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Campus Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                    >
                      <option value="student">Student</option>
                      <option value="staff">Faculty / Staff Member</option>
                      <option value="security">Campus Security Officer</option>
                      <option value="member">Campus Visitor / Resident</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {mode === 'login' ? (
                    'Sign In'
                  ) : (
                    <>
                      <span>Continue to Phone OTP Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick Demo Switchers */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 text-center mb-2 font-medium">
                  Or instantly sign in with a pre-configured demo account:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLoginAs('bsudharsan232@gmail.com')}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className="font-semibold text-slate-800 truncate">Sudharsan B</div>
                    <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Phone Verified</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLoginAs('security.desk@srmcampus.edu')}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className="font-semibold text-slate-800 truncate">Officer Raman</div>
                    <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Phone Verified</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
