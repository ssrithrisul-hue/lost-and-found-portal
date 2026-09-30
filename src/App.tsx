import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ItemsProvider, useItems } from './context/ItemsContext';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ItemCard } from './components/ItemCard';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ReportItemModal } from './components/ReportItemModal';
import { ClaimModal } from './components/ClaimModal';
import { SmartMatchesView } from './components/SmartMatchesView';
import { MyReportsView } from './components/MyReportsView';
import { UserProfileView } from './components/UserProfileView';
import { AuthModal } from './components/AuthModal';
import { Item } from './types';
import { Plus, RotateCcw, Sparkles, Inbox, Search } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    filteredItems,
    filters,
    setFilters,
    selectedItemForDetail,
    setSelectedItemForDetail,
    selectedItemForClaim,
    setSelectedItemForClaim,
    isReportModalOpen,
    setIsReportModalOpen,
    reportInitialType,
    setReportInitialType,
    resetData,
  } = useItems();

  const [activeTab, setActiveTab] = useState<'directory' | 'lost' | 'found' | 'matches' | 'my-reports' | 'profile'>('directory');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync tab clicks with filter types
  const handleTabChange = (tab: 'directory' | 'lost' | 'found' | 'matches' | 'my-reports' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'directory') {
      setFilters(prev => ({ ...prev, type: 'all' }));
    } else if (tab === 'lost') {
      setFilters(prev => ({ ...prev, type: 'lost' }));
    } else if (tab === 'found') {
      setFilters(prev => ({ ...prev, type: 'found' }));
    }
  };

  const handleOpenReportModal = (type: 'lost' | 'found') => {
    setReportInitialType(type);
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-200">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render Specific Subviews */}
        {activeTab === 'matches' ? (
          <SmartMatchesView
            onSelectItem={item => setSelectedItemForDetail(item)}
            onOpenClaim={item => setSelectedItemForClaim(item)}
          />
        ) : activeTab === 'profile' ? (
          <UserProfileView
            onSelectItem={item => setSelectedItemForDetail(item)}
            onOpenReportModal={handleOpenReportModal}
          />
        ) : activeTab === 'my-reports' ? (
          <MyReportsView
            onSelectItem={item => setSelectedItemForDetail(item)}
            onOpenReportModal={handleOpenReportModal}
          />
        ) : (
          /* Directory / Lost / Found Views */
          <div>
            <StatsBanner
              onReportLost={() => handleOpenReportModal('lost')}
              onReportFound={() => handleOpenReportModal('found')}
              onViewMatches={() => setActiveTab('matches')}
            />

            {/* Live Search & Filter Bar */}
            <SearchAndFilter />

            {/* Items Grid View */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No items match your search</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Try clearing some filters, searching with broader keywords, or report this item if it hasn&apos;t been listed yet.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        type: 'all',
                        category: 'all',
                        location: 'all',
                        zone: 'all',
                        specificSpot: 'all',
                        datePreset: 'all',
                        startDate: '',
                        endDate: '',
                        status: 'all',
                        includeResolved: false,
                        sortBy: 'newest',
                      })
                    }
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => handleOpenReportModal('lost')}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Report Item</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onSelect={selected => setSelectedItemForDetail(selected)}
                    onClaim={target => setSelectedItemForClaim(target)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Lost & Found Portal</span>
            <span>·</span>
            <span>SRM Campus Community Directory</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetData}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
              title="Reset items and claims to initial demo state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
            <span>·</span>
            <span>Campus Security Helpdesk: Ext. 2104</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialType={reportInitialType}
      />

      <ItemDetailsModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onOpenClaim={item => setSelectedItemForClaim(item)}
        onSelectCandidateItem={candidate => setSelectedItemForDetail(candidate)}
      />

      <ClaimModal
        item={selectedItemForClaim}
        isOpen={!!selectedItemForClaim}
        onClose={() => setSelectedItemForClaim(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <MainAppContent />
      </ItemsProvider>
    </AuthProvider>
  );
}
