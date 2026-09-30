import { Item, MatchScore } from '../types';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t',
  'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d',
  'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s',
  'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re',
  'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

export function calculateMatchScore(item1: Item, item2: Item): { score: number; reasons: string[] } {
  // Items must be opposite types (one lost, one found)
  if (item1.type === item2.type) {
    return { score: 0, reasons: [] };
  }

  let score = 0;
  const reasons: string[] = [];

  // 1. Category comparison (35%)
  if (item1.category === item2.category) {
    score += 35;
    reasons.push(`Matching category: ${item1.category}`);
  }

  // 2. Keyword overlap in Title and Description (up to 40%)
  const keywords1 = extractKeywords(`${item1.title} ${item1.description} ${(item1.tags || []).join(' ')}`);
  const keywords2 = extractKeywords(`${item2.title} ${item2.description} ${(item2.tags || []).join(' ')}`);

  const sharedKeywords: string[] = [];
  keywords1.forEach(kw => {
    if (keywords2.has(kw)) {
      sharedKeywords.push(kw);
    }
  });

  if (sharedKeywords.length > 0) {
    const keywordScore = Math.min(40, sharedKeywords.length * 10);
    score += keywordScore;
    reasons.push(`Shared keywords: ${sharedKeywords.slice(0, 4).join(', ')}`);
  }

  // 3. Location proximity (up to 15%)
  const locKeywords1 = extractKeywords(item1.location);
  const locKeywords2 = extractKeywords(item2.location);
  const sharedLoc: string[] = [];
  locKeywords1.forEach(loc => {
    if (locKeywords2.has(loc)) {
      sharedLoc.push(loc);
    }
  });

  if (sharedLoc.length > 0) {
    score += 15;
    reasons.push(`Common location: ${sharedLoc.join(', ')}`);
  }

  // 4. Date proximity (up to 10%)
  if (item1.date && item2.date) {
    const d1 = new Date(item1.date).getTime();
    const d2 = new Date(item2.date).getTime();
    const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

    if (diffDays <= 1) {
      score += 10;
      reasons.push(`Reported on or within 1 day of each other`);
    } else if (diffDays <= 4) {
      score += 7;
      reasons.push(`Dates are within ${Math.ceil(diffDays)} days of each other`);
    } else if (diffDays <= 7) {
      score += 4;
      reasons.push(`Reported in the same week`);
    }
  }

  return {
    score: Math.min(100, score),
    reasons,
  };
}

export function findMatchesForItem(targetItem: Item, allItems: Item[], minScore = 30): MatchScore[] {
  const matches: MatchScore[] = [];

  for (const item of allItems) {
    if (item.id === targetItem.id) continue;
    if (item.type === targetItem.type) continue; // Compare lost with found only

    const result = calculateMatchScore(targetItem, item);
    if (result.score >= minScore) {
      matches.push({
        item: targetItem,
        candidate: item,
        score: result.score,
        reasons: result.reasons,
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

export function findAllMatchPairs(items: Item[], minScore = 40): MatchScore[] {
  const lostItems = items.filter(i => i.type === 'lost' && i.status !== 'reunited');
  const foundItems = items.filter(i => i.type === 'found' && i.status !== 'reunited');

  const pairs: MatchScore[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const result = calculateMatchScore(lost, found);
      if (result.score >= minScore) {
        pairs.push({
          item: lost,
          candidate: found,
          score: result.score,
          reasons: result.reasons,
        });
      }
    }
  }

  return pairs.sort((a, b) => b.score - a.score);
}
