import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Item, Claim, FilterOptions, MatchScore } from '../types';
import { INITIAL_ITEMS, INITIAL_CLAIMS } from '../data/initialData';
import { findMatchesForItem, findAllMatchPairs } from '../utils/matchingEngine';

interface ItemsContextType {
  items: Item[];
  claims: Claim[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  filteredItems: Item[];
  allMatches: MatchScore[];
  reportItem: (item: Omit<Item, 'id' | 'createdAt' | 'status'>) => Item;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  markStatus: (id: string, status: Item['status']) => void;
  markAsResolved: (id: string) => void;
  reopenItem: (id: string) => void;
  submitClaim: (claim: Omit<Claim, 'id' | 'createdAt' | 'status'>) => Claim;
  updateClaimStatus: (claimId: string, status: Claim['status']) => void;
  getItemMatches: (item: Item) => MatchScore[];
  resetData: () => void;
  selectedItemForDetail: Item | null;
  setSelectedItemForDetail: (item: Item | null) => void;
  selectedItemForClaim: Item | null;
  setSelectedItemForClaim: (item: Item | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportInitialType: 'lost' | 'found';
  setReportInitialType: (type: 'lost' | 'found') => void;
}

const ITEMS_STORAGE_KEY = 'lnf_items_v3';
const CLAIMS_STORAGE_KEY = 'lnf_claims_v3';

const defaultFilters: FilterOptions = {
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
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(ITEMS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load items', e);
    }
    return INITIAL_ITEMS;
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const saved = localStorage.getItem(CLAIMS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load claims', e);
    }
    return INITIAL_CLAIMS;
  });

  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Item | null>(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<Item | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportInitialType, setReportInitialType] = useState<'lost' | 'found'>('lost');

  useEffect(() => {
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error(e);
    }
  }, [claims]);

  const reportItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'status'>): Item => {
    const newItem: Item = {
      ...itemData,
      id: `item_${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail(null);
    }
  };

  const markStatus = (id: string, status: Item['status']) => {
    updateItem(id, {
      status,
      resolvedAt: status === 'resolved' || status === 'reunited' ? new Date().toISOString() : undefined,
    });
  };

  const markAsResolved = (id: string) => {
    updateItem(id, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    });
  };

  const reopenItem = (id: string) => {
    updateItem(id, {
      status: 'open',
      resolvedAt: undefined,
    });
  };

  const submitClaim = (claimData: Omit<Claim, 'id' | 'createdAt' | 'status'>): Claim => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setClaims(prev => [newClaim, ...prev]);
    return newClaim;
  };

  const updateClaimStatus = (claimId: string, status: Claim['status']) => {
    setClaims(prev => prev.map(c => (c.id === claimId ? { ...c, status } : c)));
  };

  const resetData = () => {
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(INITIAL_CLAIMS));
    } catch (e) {
      console.error(e);
    }
  };

  const getItemMatches = (item: Item): MatchScore[] => {
    return findMatchesForItem(item, items, 30);
  };

  const allMatches = useMemo(() => {
    return findAllMatchPairs(items, 40);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Hide resolved / archived items unless explicitly requested
      if (!filters.includeResolved && filters.status !== 'resolved') {
        if (item.status === 'resolved') {
          return false;
        }
      }

      // 2. Type filter (lost, found, all)
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }

      // 3. Status filter
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }

      // 4. Category filter
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // 5. General Location filter
      if (filters.location !== 'all' && !item.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // 6. Specific Campus Zone filter
      if (filters.zone !== 'all') {
        const matchesZone = item.zone && item.zone.toLowerCase() === filters.zone.toLowerCase();
        const matchesInLocation = item.location.toLowerCase().includes(filters.zone.toLowerCase());
        if (!matchesZone && !matchesInLocation) {
          return false;
        }
      }

      // 7. Specific Spot / Sub-location filter
      if (filters.specificSpot !== 'all') {
        const matchesSpot = item.specificSpot && item.specificSpot.toLowerCase() === filters.specificSpot.toLowerCase();
        const matchesInDescOrLoc =
          item.location.toLowerCase().includes(filters.specificSpot.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.specificSpot.toLowerCase());
        if (!matchesSpot && !matchesInDescOrLoc) {
          return false;
        }
      }

      // 8. Date Range filter (startDate & endDate)
      if (filters.startDate) {
        if (item.date < filters.startDate) {
          return false;
        }
      }
      if (filters.endDate) {
        if (item.date > filters.endDate) {
          return false;
        }
      }

      // 9. Search Query filter (matches title, description, location, category, tags)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inLoc = item.location.toLowerCase().includes(query);
        const inZone = item.zone ? item.zone.toLowerCase().includes(query) : false;
        const inSpot = item.specificSpot ? item.specificSpot.toLowerCase().includes(query) : false;
        const inCategory = item.category.toLowerCase().includes(query);
        const inTags = item.tags?.some(t => t.toLowerCase().includes(query));

        if (!inTitle && !inDesc && !inLoc && !inZone && !inSpot && !inCategory && !inTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filters.sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [items, filters]);

  return (
    <ItemsContext.Provider
      value={{
        items,
        claims,
        filters,
        setFilters,
        filteredItems,
        allMatches,
        reportItem,
        updateItem,
        deleteItem,
        markStatus,
        markAsResolved,
        reopenItem,
        submitClaim,
        updateClaimStatus,
        getItemMatches,
        resetData,
        selectedItemForDetail,
        setSelectedItemForDetail,
        selectedItemForClaim,
        setSelectedItemForClaim,
        isReportModalOpen,
        setIsReportModalOpen,
        reportInitialType,
        setReportInitialType,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};
