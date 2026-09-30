import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Smartphone,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface PhoneOtpVerificationProps {
  phone: string;
  onVerified: () => void;
  onCancel?: () => void;
  onEditPhone?: () => void;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
}

export const PhoneOtpVerification: React.FC<PhoneOtpVerificationProps> = ({
  phone,
  onVerified,
  onCancel,
  onEditPhone,
  title = 'Verify Your Phone Number',
  subtitle,
  actionLabel = 'Verify & Confirm',
}) => {
  const { sendOtp, verifyOtp, activeOtpSession } = useAuth();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Send OTP when component mounts if not already sent for this phone
  useEffect(() => {
    if (!activeOtpSession || activeOtpSession.phone !== phone) {
      sendOtp(phone);
    }
    setCooldown(45);
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, [phone]);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    setError(null);
    const res = sendOtp(phone);
    if (!res.success) {
      setError(res.error || 'Failed to send OTP code.');
    } else {
      setCooldown(45);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    setError(null);

    // If pasted multiple characters into a single input box
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      cleanDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextFocus = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Single character input
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    // Auto-advance
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = ['', '', '', '', '', ''];
    pasted.split('').forEach((char, idx) => {
      if (idx < 6) newDigits[idx] = char;
    });
    setDigits(newDigits);

    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleAutofill = () => {
    if (!activeOtpSession?.code) return;
    const codeDigits = activeOtpSession.code.split('');
    setDigits(codeDigits);
    setError(null);
    inputRefs.current[5]?.focus();
  };

  const handleCopyCode = () => {
    if (!activeOtpSession?.code) return;
    navigator.clipboard.writeText(activeOtpSession.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVerify = () => {
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      const firstEmpty = digits.findIndex(d => !d);
      if (firstEmpty !== -1) {
        inputRefs.current[firstEmpty]?.focus();
      }
      return;
    }

    setIsVerifying(true);
    setError(null);

    const res = verifyOtp(phone, fullCode);
    if (!res.success) {
      setIsVerifying(false);
      setError(res.error || 'Invalid verification code. Please check the simulated SMS and try again.');
      return;
    }

    // Success state
    setIsSuccess(true);
    setIsVerifying(false);
    setTimeout(() => {
      onVerified();
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Smartphone className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {subtitle || (
            <>
              Enter the 6-digit one-time password (OTP) sent to{' '}
              <span className="font-semibold text-slate-800 font-mono">{phone}</span>
            </>
          )}
        </p>
        {onEditPhone && (
          <button
            type="button"
            onClick={onEditPhone}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline pt-0.5 inline-block"
          >
            Wrong number? Edit phone number
          </button>
        )}
      </div>

      {/* Simulated SMS Notification Alert Card */}
      {activeOtpSession && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-md border border-slate-800 relative overflow-hidden">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Simulated SMS Delivery Gateway</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Just now</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Carrier SMS
            </span>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed font-sans">
            Your verification code for Lost &amp; Found Portal is{' '}
            <span className="font-mono font-bold text-emerald-400 text-sm tracking-widest bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
              {activeOtpSession.code}
            </span>
            . Valid for 5 minutes.
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleAutofill}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-md text-[11px] transition-colors flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Autofill Code</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Success state */}
      {isSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">Phone number verified successfully! Redirecting...</span>
        </div>
      )}

      {/* 6 Digit Inputs */}
      <div className="py-2">
        <label className="block text-center text-xs font-semibold text-slate-700 mb-2.5">
          Enter 6-Digit Code
        </label>
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={el => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isSuccess || isVerifying}
              className={`w-10 sm:w-12 h-12 text-center text-xl font-bold font-mono rounded-xl border transition-all focus:outline-none ${
                digit
                  ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900'
              } ${error ? 'border-rose-400 bg-rose-50/20' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Resend OTP Row */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-500">
        <span>Didn&apos;t receive code?</span>
        {cooldown > 0 ? (
          <span className="font-mono text-slate-400">Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Resend OTP</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || isSuccess || digits.join('').length < 6}
          className={`w-full py-2.5 rounded-lg text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs ${
            digits.join('').length === 6 && !isSuccess
              ? 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
              : isSuccess
              ? 'bg-emerald-600 cursor-default'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Verified!</span>
            </>
          ) : isVerifying ? (
            <span>Verifying code...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{actionLabel}</span>
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSuccess}
            className="w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registration</span>
          </button>
        )}
      </div>
    </div>
  );
};
