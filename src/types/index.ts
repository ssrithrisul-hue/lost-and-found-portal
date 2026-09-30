export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'Personal Item'
  | 'Electronics'
  | 'ID & Cards'
  | 'Keys & Accessories'
  | 'Clothing & Bags'
  | 'Books & Stationery'
  | 'Jewelry & Watches'
  | 'Sports Equipment'
  | 'Other';

export type ItemStatus = 'open' | 'claimed' | 'reunited' | 'resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPhoneVerified?: boolean;
  phoneVerifiedAt?: string;
  password?: string;
  role?: 'student' | 'staff' | 'security' | 'member';
  avatarUrl?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  location: string;
  zone?: string; // Specific campus zone e.g. 'Central Library', 'Tech Park'
  specificSpot?: string; // Specific location spot e.g. '2nd Floor Quiet Study Tables'
  date: string; // YYYY-MM-DD
  imageUrl: string;
  reporterId: string;
  reporterName: string;
  reporterPhone: string;
  reporterPhoneVerified?: boolean;
  reporterEmail: string;
  preferredContact: 'phone' | 'email' | 'whatsapp' | 'in-app' | 'any';
  storageLocation?: string; // where found item is kept (e.g. Campus Security Office)
  reward?: string; // optional reward for lost item
  status: ItemStatus;
  createdAt: string;
  resolvedAt?: string;
  tags?: string[];
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantPhoneVerified?: boolean;
  message: string;
  identifyingProof: string; // e.g., unique scratch, wallpaper, name on card
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface MatchScore {
  item: Item;
  candidate: Item;
  score: number; // 0 to 100
  reasons: string[];
}

export type DatePreset = 'all' | 'today' | '3days' | '7days' | '30days' | 'custom';

export interface FilterOptions {
  searchQuery: string;
  type: 'all' | 'lost' | 'found';
  category: string;
  location: string;
  zone: string;
  specificSpot: string;
  datePreset: DatePreset;
  startDate: string;
  endDate: string;
  status: 'all' | 'open' | 'reunited' | 'resolved';
  includeResolved: boolean;
  sortBy: 'newest' | 'oldest' | 'title' | 'date';
}

