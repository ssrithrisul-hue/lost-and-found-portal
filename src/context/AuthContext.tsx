import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/initialData';

export interface OtpSession {
  phone: string;
  code: string;
  createdAt: number;
  expiresAt: number;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  activeOtpSession: OtpSession | null;
  login: (email: string, pass?: string) => { success: boolean; error?: string };
  register: (
    name: string,
    email: string,
    phone: string,
    password?: string,
    role?: string,
    isPhoneVerified?: boolean
  ) => { success: boolean; user?: User; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (data: Partial<User>) => { success: boolean; error?: string };
  sendOtp: (phone: string) => { success: boolean; code: string; expiresAt: number; error?: string };
  verifyOtp: (phone: string, inputCode: string) => { success: boolean; error?: string };
  verifyCurrentUserPhone: (phone: string, inputCode: string) => { success: boolean; error?: string };
  clearOtpSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'lnf_users_v1';
const CURRENT_USER_STORAGE_KEY = 'lnf_current_user_v1';

export const normalizePhone = (p: string) => p.replace(/\D/g, '');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load current user from localStorage', e);
    }
    // Default to the first initial user (Sudharsan B) for an immediately interactive experience
    return INITIAL_USERS[0] || null;
  });

  const [activeOtpSession, setActiveOtpSession] = useState<OtpSession | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const login = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmed);
    if (!found) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  const sendOtp = (phone: string) => {
    const trimmed = phone.trim();
    if (!trimmed || trimmed.replace(/\D/g, '').length < 6) {
      return {
        success: false,
        code: '',
        expiresAt: 0,
        error: 'Please enter a valid phone number (at least 6-10 digits).',
      };
    }

    // Generate deterministic yet pseudo-random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

    const session: OtpSession = {
      phone: trimmed,
      code,
      createdAt: now,
      expiresAt,
    };

    setActiveOtpSession(session);
    return { success: true, code, expiresAt };
  };

  const verifyOtp = (phone: string, inputCode: string) => {
    if (!activeOtpSession) {
      return { success: false, error: 'No active OTP verification session. Please request a new code.' };
    }

    if (Date.now() > activeOtpSession.expiresAt) {
      return { success: false, error: 'Verification code has expired. Please request a new one.' };
    }

    const normTarget = normalizePhone(phone);
    const normSession = normalizePhone(activeOtpSession.phone);

    if (normTarget && normSession && normTarget !== normSession) {
      return { success: false, error: 'Phone number mismatch with generated OTP. Please resend code.' };
    }

    if (activeOtpSession.code.trim() !== inputCode.trim()) {
      return { success: false, error: 'Invalid verification code. Please check the simulated SMS and try again.' };
    }

    return { success: true };
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    password = 'password123',
    role = 'student',
    isPhoneVerified = true
  ) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!name.trim() || !trimmedEmail || !phone.trim()) {
      return { success: false, error: 'Please provide all required fields.' };
    }

    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      isPhoneVerified: !!isPhoneVerified,
      phoneVerifiedAt: isPhoneVerified ? new Date().toISOString() : undefined,
      password: password.trim(),
      role: (role as User['role']) || 'student',
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveOtpSession(null);
    return { success: true, user: newUser };
  };

  const verifyCurrentUserPhone = (phone: string, inputCode: string) => {
    if (!currentUser) return { success: false, error: 'No user is currently signed in.' };

    const verificationResult = verifyOtp(phone, inputCode);
    if (!verificationResult.success) {
      return verificationResult;
    }

    const now = new Date().toISOString();
    const updatedUser: User = {
      ...currentUser,
      phone: phone.trim(),
      isPhoneVerified: true,
      phoneVerifiedAt: now,
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setActiveOtpSession(null);
    return { success: true };
  };

  const clearOtpSession = () => {
    setActiveOtpSession(null);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };

    // If changing email, check for conflicts with other users
    if (data.email && data.email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      const conflict = users.find(
        u => u.id !== currentUser.id && u.email.toLowerCase() === data.email!.trim().toLowerCase()
      );
      if (conflict) {
        return { success: false, error: 'This email is already in use by another account.' };
      }
    }

    const phoneChanged =
      data.phone !== undefined &&
      normalizePhone(data.phone) !== normalizePhone(currentUser.phone);

    const updated: User = {
      ...currentUser,
      ...data,
      email: data.email ? data.email.trim().toLowerCase() : currentUser.email,
      name: data.name ? data.name.trim() : currentUser.name,
      phone: data.phone ? data.phone.trim() : currentUser.phone,
      // If phone number is changed and not explicitly verified in this update, reset verification
      isPhoneVerified:
        data.isPhoneVerified !== undefined
          ? data.isPhoneVerified
          : phoneChanged
          ? false
          : currentUser.isPhoneVerified,
      phoneVerifiedAt:
        data.phoneVerifiedAt !== undefined
          ? data.phoneVerifiedAt
          : phoneChanged
          ? undefined
          : currentUser.phoneVerifiedAt,
    };

    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        activeOtpSession,
        login,
        register,
        logout,
        switchUser,
        updateProfile,
        sendOtp,
        verifyOtp,
        verifyCurrentUserPhone,
        clearOtpSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
