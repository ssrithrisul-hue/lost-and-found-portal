import { Item, ItemCategory, User, Claim } from '../types';

import walletImg from '../assets/images/lost_black_wallet_1790791346780.jpg';
import airpodsImg from '../assets/images/lost_airpods_case_1790791362460.jpg';
import keysImg from '../assets/images/lost_campus_keys_1790791376458.jpg';
import bottleImg from '../assets/images/found_water_bottle_1790791387767.jpg';

export const CATEGORIES: ItemCategory[] = [
  'Personal Item',
  'Electronics',
  'ID & Cards',
  'Keys & Accessories',
  'Clothing & Bags',
  'Books & Stationery',
  'Jewelry & Watches',
  'Sports Equipment',
  'Other',
];

export interface CampusZone {
  name: string;
  spots: string[];
}

export const CAMPUS_ZONES: CampusZone[] = [
  {
    name: 'Tech Park',
    spots: ['Lobby & Reception', '1st Floor Labs', '2nd Floor Lecture Halls', '3rd Floor Bio Labs', 'Tech Park Courtyard / Lawns']
  },
  {
    name: 'Central Library',
    spots: ['Ground Floor Circulation Desk', '1st Floor Periodicals Rack', '2nd Floor Quiet Study Tables', 'Reference Section Racks', 'Cyber Cafe']
  },
  {
    name: 'Food Court & Cafeteria',
    spots: ['Main Food Court Seating', 'Juice & Coffee Stall', 'Fast Food Counter', 'Outdoor Dining Patio']
  },
  {
    name: 'Sports Complex',
    spots: ['Gymnasium / Fitness Center', 'Badminton Courts', 'Indoor Table Tennis', 'Running Track & Turf']
  },
  {
    name: 'Campus Gates & Security',
    spots: ['Main Gate 1 Security Post', 'Gate 2 Security Office', 'Clock Tower Circle']
  },
  {
    name: 'Hostel Blocks',
    spots: ['Hostel Block A Lounge', 'Hostel Block B Common Room', 'Hostel Block C Dining Hall']
  }
];

export const COMMON_LOCATIONS = [
  'SRM Campus - Main Tech Park',
  'SRM Campus - Central Library',
  'SRM Campus - University Food Court',
  'SRM Campus - Sports Complex',
  'SRM Campus - Main Gate Security Post',
  'SRM Campus - Science & Bio Block',
  'SRM Campus - Hostel Block C',
  'Campus Auditorium',
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Sudharsan B',
    email: 'bsudharsan232@gmail.com',
    phone: '+91 98401 23456',
    isPhoneVerified: true,
    phoneVerifiedAt: '2026-09-20T09:00:00Z',
    password: 'password123',
    role: 'student',
    createdAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 'user_2',
    name: 'Campus Security Desk (Officer Raman)',
    email: 'security.desk@srmcampus.edu',
    phone: '+91 98402 34567',
    isPhoneVerified: true,
    phoneVerifiedAt: '2026-09-15T08:30:00Z',
    password: 'password123',
    role: 'security',
    createdAt: '2026-09-15T08:30:00Z',
  },
  {
    id: 'user_3',
    name: 'Ananya Sharma',
    email: 'ananya.s@student.edu',
    phone: '+91 98403 45678',
    isPhoneVerified: true,
    phoneVerifiedAt: '2026-09-22T10:15:00Z',
    password: 'password123',
    role: 'student',
    createdAt: '2026-09-22T10:15:00Z',
  },
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item_1',
    type: 'lost',
    title: 'Black Wallet',
    category: 'Personal Item',
    description: 'Black leather wallet containing college ID card, metro smart pass, and emergency cash. Lost around Tech Park area.',
    location: 'SRM Campus - Main Tech Park',
    zone: 'Tech Park',
    specificSpot: 'Tech Park Courtyard / Lawns',
    date: '2026-09-28',
    imageUrl: walletImg,
    reporterId: 'user_1',
    reporterName: 'Sudharsan B',
    reporterPhone: '+91 98401 23456',
    reporterPhoneVerified: true,
    reporterEmail: 'bsudharsan232@gmail.com',
    preferredContact: 'phone',
    reward: 'Gratitude & Coffee treat',
    status: 'open',
    createdAt: '2026-09-28T14:30:00Z',
    tags: ['leather', 'wallet', 'college id', 'black', 'srm campus'],
  },
  {
    id: 'item_2',
    type: 'found',
    title: 'Black Leather Bifold Wallet',
    category: 'Personal Item',
    description: 'Found a men\'s black leather bifold wallet on a stone bench outside Tech Park lobby. Inside there is a student ID card and transport card. Handed over to Main Security Desk.',
    location: 'SRM Campus - Main Tech Park',
    zone: 'Tech Park',
    specificSpot: 'Lobby & Reception',
    date: '2026-09-28',
    imageUrl: walletImg,
    reporterId: 'user_2',
    reporterName: 'Campus Security Desk (Officer Raman)',
    reporterPhone: '+91 98402 34567',
    reporterPhoneVerified: true,
    reporterEmail: 'security.desk@srmcampus.edu',
    preferredContact: 'phone',
    storageLocation: 'Main Gate Security Office, Locker 4B',
    status: 'open',
    createdAt: '2026-09-28T16:00:00Z',
    tags: ['black', 'wallet', 'leather', 'student id', 'tech park'],
  },
  {
    id: 'item_3',
    type: 'lost',
    title: 'Apple AirPods Pro Charging Case',
    category: 'Electronics',
    description: 'White Apple AirPods Pro 2 charging case (without buds). Left on one of the wooden study tables in the quiet reading section on the 2nd floor.',
    location: 'SRM Campus - Central Library',
    zone: 'Central Library',
    specificSpot: '2nd Floor Quiet Study Tables',
    date: '2026-09-29',
    imageUrl: airpodsImg,
    reporterId: 'user_3',
    reporterName: 'Ananya Sharma',
    reporterPhone: '+91 98403 45678',
    reporterPhoneVerified: true,
    reporterEmail: 'ananya.s@student.edu',
    preferredContact: 'whatsapp',
    status: 'open',
    createdAt: '2026-09-29T11:20:00Z',
    tags: ['airpods', 'apple', 'case', 'library', 'white', 'earbuds'],
  },
  {
    id: 'item_4',
    type: 'found',
    title: 'White Wireless Earbuds Case',
    category: 'Electronics',
    description: 'White glossy earbud charging case found on table 14 near the reference racks. Brought to the librarian circulation counter.',
    location: 'SRM Campus - Central Library',
    zone: 'Central Library',
    specificSpot: 'Reference Section Racks',
    date: '2026-09-29',
    imageUrl: airpodsImg,
    reporterId: 'user_2',
    reporterName: 'Campus Security Desk (Officer Raman)',
    reporterPhone: '+91 98402 34567',
    reporterPhoneVerified: true,
    reporterEmail: 'security.desk@srmcampus.edu',
    preferredContact: 'email',
    storageLocation: 'Central Library Circulation Desk - Lost Property Drawer',
    status: 'open',
    createdAt: '2026-09-29T15:45:00Z',
    tags: ['white', 'earbuds', 'case', 'library'],
  },
  {
    id: 'item_5',
    type: 'lost',
    title: 'Set of 3 Keys with SRM Blue Lanyard',
    category: 'Keys & Accessories',
    description: 'Bunch of 3 keys (2 brass door keys, 1 small padlock key) attached to a blue woven SRM University lanyard with a mini metal carabiner.',
    location: 'SRM Campus - University Food Court',
    zone: 'Food Court & Cafeteria',
    specificSpot: 'Main Food Court Seating',
    date: '2026-09-27',
    imageUrl: keysImg,
    reporterId: 'user_1',
    reporterName: 'Sudharsan B',
    reporterPhone: '+91 98401 23456',
    reporterPhoneVerified: true,
    reporterEmail: 'bsudharsan232@gmail.com',
    preferredContact: 'phone',
    status: 'open',
    createdAt: '2026-09-27T18:10:00Z',
    tags: ['keys', 'lanyard', 'blue', 'food court'],
  },
  {
    id: 'item_6',
    type: 'found',
    title: 'Navy Blue Insulated Stainless Steel Bottle',
    category: 'Personal Item',
    description: 'Found a 750ml navy blue matte hydro thermos bottle with carrying ring lid on the treadmill bench. Clean condition.',
    location: 'SRM Campus - Sports Complex',
    zone: 'Sports Complex',
    specificSpot: 'Gymnasium / Fitness Center',
    date: '2026-09-30',
    imageUrl: bottleImg,
    reporterId: 'user_3',
    reporterName: 'Ananya Sharma',
    reporterPhone: '+91 98403 45678',
    reporterPhoneVerified: true,
    reporterEmail: 'ananya.s@student.edu',
    preferredContact: 'in-app',
    storageLocation: 'Gym Front Reception Desk',
    status: 'open',
    createdAt: '2026-09-30T09:15:00Z',
    tags: ['bottle', 'navy blue', 'sports complex', 'gym'],
  },
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'claim_1',
    itemId: 'item_2',
    itemTitle: 'Black Leather Bifold Wallet',
    claimantId: 'user_1',
    claimantName: 'Sudharsan B',
    claimantEmail: 'bsudharsan232@gmail.com',
    claimantPhone: '+91 98401 23456',
    claimantPhoneVerified: true,
    message: 'Hello Officer Raman, I believe this is the wallet I lost earlier today. My student ID card inside has my registration number ending in 10142.',
    identifyingProof: 'Contains college ID with name Sudharsan and a blue metro smart card inside the inner pocket.',
    status: 'pending',
    createdAt: '2026-09-28T17:00:00Z',
  },
];
