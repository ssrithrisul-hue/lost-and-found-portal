import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { Plus, User, LogIn, LogOut, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'directory' | 'lost' | 'found' | 'matches' | 'my-reports' | 'profile';
  setActiveTab: (tab: 'directory' | 'lost' | 'found' | 'matches' | 'my-reports' | 'profile') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { currentUser, users, logout, switchUser } = useAuth();
  const { setIsReportModalOpen, setReportInitialType, allMatches, claims, items } = useItems();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingClaimsCount = claims.filter(c => {
    const item = items.find(i => i.id === c.itemId);
    return item && item.reporterId === currentUser?.id && c.status === 'pending';
  }).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Text Element Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('directory')}
            className="text-left group flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              LF
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
              Lost & Found Portal
            </span>
          </button>
        </div>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('directory')}
            className={`transition-colors py-1 ${
              activeTab === 'directory'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Browse All
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`transition-colors py-1 ${
              activeTab === 'lost'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`transition-colors py-1 ${
              activeTab === 'found'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Found Items
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'matches'
                ? 'text-indigo-700 font-semibold border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Smart Matches</span>
            {allMatches.length > 0 && (
              <span className="ml-1 text-xs font-mono font-bold text-indigo-600">
                ({allMatches.length})
              </span>
            )}
          </button>
          {currentUser && (
            <>
              <button
                onClick={() => setActiveTab('my-reports')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  activeTab === 'my-reports'
                    ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>My Reports</span>
                {pendingClaimsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" title="New pending claims" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  activeTab === 'profile'
                    ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>My Profile</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Report Item Button */}
          <div className="relative inline-flex">
            <button
              onClick={() => {
                setReportInitialType('lost');
                setIsReportModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Item</span>
            </button>
          </div>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center border border-slate-300">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-xs">
                  <div className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-slate-500 capitalize leading-none">{currentUser.role || 'Member'}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-semibold text-slate-900">{currentUser.name}</div>
                    <div className="text-slate-500 truncate">{currentUser.email}</div>
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] mt-1">
                      <span>{currentUser.phone}</span>
                      {currentUser.isPhoneVerified ? (
                        <span className="text-[10px] text-emerald-700 font-sans font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>OTP Verified</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-sans font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Unverified Phone
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between"
                    >
                      <span>My Profile & Credentials</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('my-reports');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between"
                    >
                      <span>My Reported Items</span>
                      {pendingClaimsCount > 0 && (
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {pendingClaimsCount} new claim{pendingClaimsCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Switch user demo selector */}
                  <div className="px-4 pt-2 pb-1 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    Switch Active User (Demo)
                  </div>
                  <div className="py-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          u.id === currentUser.id ? 'font-semibold text-slate-900 bg-slate-50' : 'text-slate-600'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        {u.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex border-t border-slate-200 bg-slate-50/80 px-2 py-1 overflow-x-auto text-xs font-medium gap-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'directory' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setActiveTab('lost')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'lost' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Lost Items
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'found' ? 'bg-teal-100 text-teal-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Found Items
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'matches' ? 'bg-indigo-100 text-indigo-900 font-semibold' : 'text-slate-600'
          }`}
        >
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Matches ({allMatches.length})</span>
        </button>
        {currentUser && (
          <>
            <button
              onClick={() => setActiveTab('my-reports')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'my-reports' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Profile
            </button>
          </>
        )}
      </div>
    </header>
  );
};
