import React, { useState } from 'react';
import { useItems } from '../context/ItemsContext';
import { CATEGORIES, CAMPUS_ZONES, CampusZone } from '../data/initialData';
import { DatePreset } from '../types';
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  Tag,
  RotateCcw,
  Calendar,
  Building2,
  Clock,
  Archive,
  ChevronDown,
} from 'lucide-react';

export const SearchAndFilter: React.FC = () => {
  const { filters, setFilters, filteredItems, items } = useItems();
  const [showAdvancedLocation, setShowAdvancedLocation] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const resolvedCount = items.filter(i => i.status === 'resolved').length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleTypeChange = (type: 'all' | 'lost' | 'found') => {
    setFilters(prev => ({ ...prev, type }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleZoneChange = (zoneName: string) => {
    setFilters(prev => ({
      ...prev,
      zone: zoneName,
      specificSpot: 'all', // Reset specific spot when zone changes
    }));
  };

  const handleSpotChange = (spotName: string) => {
    setFilters(prev => ({ ...prev, specificSpot: spotName }));
  };

  const handleDatePreset = (preset: DatePreset) => {
    const today = new Date('2026-09-30'); // Current app date
    let start = '';
    const end = today.toISOString().split('T')[0];

    if (preset === 'today') {
      start = end;
    } else if (preset === '3days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 3);
      start = d.toISOString().split('T')[0];
    } else if (preset === '7days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      start = d.toISOString().split('T')[0];
    } else if (preset === '30days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      start = d.toISOString().split('T')[0];
    }

    setFilters(prev => ({
      ...prev,
      datePreset: preset,
      startDate: preset === 'all' || preset === 'custom' ? prev.startDate : start,
      endDate: preset === 'all' || preset === 'custom' ? prev.endDate : end,
    }));
  };

  const clearAllFilters = () => {
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
    });
    setShowDateRange(false);
    setShowAdvancedLocation(false);
  };

  const selectedZoneData: CampusZone | undefined = CAMPUS_ZONES.find(
    z => z.name.toLowerCase() === filters.zone.toLowerCase()
  );

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.zone !== 'all' ||
    filters.specificSpot !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.status !== 'all' ||
    filters.includeResolved;

  const quickPicks = ['Black Wallet', 'AirPods', 'Keys', 'SRM Campus', 'Central Library'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 mb-8">
      {/* Search Input Field */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by keyword, item name, specific spot, or description (e.g. Black Wallet, Study Tables)..."
          className="w-full pl-11 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Quick Searches */}
      <div className="flex items-center gap-2 mb-4 text-xs overflow-x-auto pb-1 text-slate-500">
        <span className="shrink-0 text-slate-400 font-medium">Quick search:</span>
        {quickPicks.map(qp => (
          <button
            key={qp}
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, searchQuery: qp }))}
            className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors border ${
              filters.searchQuery.toLowerCase() === qp.toLowerCase()
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Primary Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Type Segmented Control */}
        <div>
          <label className="block text-slate-500 font-medium mb-1.5">Item Status Type</label>
          <div className="flex p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => handleTypeChange('all')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                filters.type === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('lost')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                filters.type === 'lost'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              Lost
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('found')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                filters.type === 'found'
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-teal-800'
              }`}
            >
              Found
            </button>
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-slate-500 font-medium mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            <span>Category</span>
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Zone Dropdown */}
        <div>
          <label className="block text-slate-500 font-medium mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>Campus Zone</span>
            </span>
            {filters.zone !== 'all' && (
              <button
                type="button"
                onClick={() => handleZoneChange('all')}
                className="text-[11px] text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
            )}
          </label>
          <select
            value={filters.zone}
            onChange={e => handleZoneChange(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Campus Zones</option>
            {CAMPUS_ZONES.map(z => (
              <option key={z.name} value={z.name}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Spot in Zone */}
        <div>
          <label className="block text-slate-500 font-medium mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Specific Spot / Floor</span>
            </span>
            {filters.specificSpot !== 'all' && (
              <button
                type="button"
                onClick={() => handleSpotChange('all')}
                className="text-[11px] text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
            )}
          </label>
          <select
            value={filters.specificSpot}
            onChange={e => handleSpotChange(e.target.value)}
            disabled={filters.zone === 'all' && !selectedZoneData}
            className={`w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
              filters.zone === 'all' ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="all">
              {filters.zone === 'all' ? 'Select a zone first...' : `All Spots in ${filters.zone}`}
            </option>
            {selectedZoneData?.spots.map(spot => (
              <option key={spot} value={spot}>
                {spot}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Lost/Found Range Filter Section */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date Lost/Found:</span>
            </span>
            {(['all', 'today', '3days', '7days', '30days'] as DatePreset[]).map(preset => {
              const labels: Record<string, string> = {
                all: 'All Dates',
                today: 'Today',
                '3days': 'Last 3 Days',
                '7days': 'Last 7 Days',
                '30days': 'Last 30 Days',
              };
              const isActive = filters.datePreset === preset && !filters.startDate && !filters.endDate ? preset === 'all' : filters.datePreset === preset;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleDatePreset(preset)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {labels[preset]}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowDateRange(!showDateRange)}
              className={`px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 ${
                showDateRange || (filters.startDate && filters.endDate)
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span>Custom Date Range</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {(filters.startDate || filters.endDate) && (
              <button
                type="button"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    datePreset: 'all',
                    startDate: '',
                    endDate: '',
                  }));
                }}
                className="text-[11px] text-rose-600 hover:text-rose-800 ml-1"
              >
                Clear Date
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 shrink-0">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
            >
              <option value="newest">Recently Reported</option>
              <option value="date">Incident Date (Newest)</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Item Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Expandable Custom Date Range Selector */}
        {showDateRange && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs items-center">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Start Date (From):</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    datePreset: 'custom',
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">End Date (To):</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    datePreset: 'custom',
                    endDate: e.target.value,
                  }))
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <span className="text-[11px] text-slate-500">
                {filters.startDate && filters.endDate
                  ? `Filtering between ${filters.startDate} and ${filters.endDate}`
                  : 'Select start & end dates'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results & Archived Toggle Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-900 tabular-nums">{filteredItems.length}</span> active items
          {filters.searchQuery && (
            <span>
              {' '}
              matching &ldquo;<span className="text-slate-800 font-medium">{filters.searchQuery}</span>&rdquo;
            </span>
          )}
          {filters.zone !== 'all' && (
            <span>
              {' '}
              in <span className="text-slate-800 font-medium">{filters.zone}</span>
              {filters.specificSpot !== 'all' && ` (${filters.specificSpot})`}
            </span>
          )}
          {(filters.startDate || filters.endDate) && (
            <span>
              {' '}
              · Date:{' '}
              <span className="font-medium text-slate-800">
                {filters.startDate || 'Beginning'} to {filters.endDate || 'Now'}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Include Archived / Resolved Items Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={filters.includeResolved}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  includeResolved: e.target.checked,
                }))
              }
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Archive className="w-3.5 h-3.5 text-slate-400" />
              <span>Show archived & resolved items</span>
              {resolvedCount > 0 && (
                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">
                  {resolvedCount}
                </span>
              )}
            </span>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
