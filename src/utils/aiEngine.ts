import { Category, Priority } from '@/types';

// --- Auto Category Detection ---
const IT_KEYWORDS = ['wifi', 'laptop', 'computer', 'internet', 'network', 'software', 'hardware',
  'printer', 'email', 'password', 'login', 'system', 'server', 'vpn', 'monitor',
  'keyboard', 'mouse', 'usb', 'data', 'app', 'application', 'website', 'browser',
  'slow', 'crash', 'error', 'bug', 'update', 'install', 'uninstall', 'virus', 'malware', 'phone'];

const ADMIN_KEYWORDS = ['leave', 'hr', 'payroll', 'salary', 'attendance', 'id card', 'badge',
  'document', 'certificate', 'policy', 'onboarding', 'offboarding', 'training',
  'transfer', 'promotion', 'appointment', 'meeting', 'registration', 'form',
  'compliance', 'audit', 'report', 'access', 'permission'];

const FACILITIES_KEYWORDS = ['ac', 'air conditioning', 'light', 'lights', 'fan', 'power', 'elevator',
  'lift', 'water', 'toilet', 'restroom', 'parking', 'cleaning', 'desk', 'chair',
  'furniture', 'room', 'office', 'building', 'maintenance', 'repair', 'broken',
  'pipe', 'floor', 'ceiling', 'window', 'door', 'lock', 'key', 'pantry', 'canteen'];

export function detectCategory(text: string): Category {
  const lower = text.toLowerCase();
  const score = (keywords: string[]) =>
    keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);

  const itScore = score(IT_KEYWORDS);
  const adminScore = score(ADMIN_KEYWORDS);
  const facScore = score(FACILITIES_KEYWORDS);

  if (itScore === 0 && adminScore === 0 && facScore === 0) return 'IT'; // default
  if (itScore >= adminScore && itScore >= facScore) return 'IT';
  if (adminScore >= itScore && adminScore >= facScore) return 'Admin';
  return 'Facilities';
}

// --- Auto Priority Detection ---
const HIGH_KEYWORDS = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'not working',
  'down', 'broken', 'failed', 'failure', 'cannot', "can't", 'unable', 'blocked',
  'stop', 'stopped', 'severe', 'serious', 'important', 'high priority', 'crash'];

const LOW_KEYWORDS = ['when possible', 'whenever', 'no rush', 'minor', 'small', 'suggest',
  'nice to have', 'improvement', 'eventually', 'low priority', 'optional'];

export function detectPriority(text: string): Priority {
  const lower = text.toLowerCase();
  const hasHigh = HIGH_KEYWORDS.some(kw => lower.includes(kw));
  const hasLow = LOW_KEYWORDS.some(kw => lower.includes(kw));

  if (hasHigh) return 'High';
  if (hasLow) return 'Low';
  return 'Medium';
}

// --- Smart Suggestions ---
const SUGGESTIONS: { keywords: string[]; suggestion: string }[] = [
  { keywords: ['wifi', 'internet', 'network', 'connection'], suggestion: 'Try restarting your router and reconnecting. If persistent, check if others are affected.' },
  { keywords: ['laptop', 'computer', 'slow', 'freeze'], suggestion: 'Restart your device and close unused applications. Check Task Manager for high resource usage.' },
  { keywords: ['password', 'login', 'access'], suggestion: 'Use the "Forgot Password" option. If you don\'t have access, contact IT to reset your credentials.' },
  { keywords: ['printer'], suggestion: 'Check printer connections and ensure it\'s powered on. Try removing and re-adding the printer from settings.' },
  { keywords: ['email'], suggestion: 'Check your spam folder. Try restarting your email client or logging out and back in.' },
  { keywords: ['ac', 'air conditioning', 'temperature', 'hot', 'cold'], suggestion: 'Check if the AC settings have been adjusted. Report to Facilities with your room/floor number.' },
  { keywords: ['light', 'lights', 'bulb'], suggestion: 'Note the specific location (floor, room number) and raise with Facilities team for quick resolution.' },
  { keywords: ['leave', 'attendance'], suggestion: 'Check the HR portal for leave balance and submission guidelines before raising a ticket.' },
  { keywords: ['payroll', 'salary'], suggestion: 'Verify your attendance records. Raise ticket with specific month/details for faster resolution.' },
  { keywords: ['software', 'install', 'application'], suggestion: 'Check if the software is on the approved IT list. Admin rights may be required — include your OS version.' },
  { keywords: ['virus', 'malware'], suggestion: 'Disconnect from network immediately. Do not open any files. Contact IT urgently.' },
  { keywords: ['water', 'leak', 'pipe'], suggestion: 'Report immediately to Facilities with the exact location to prevent damage.' },
];

export function getSuggestion(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const { keywords, suggestion } of SUGGESTIONS) {
    if (keywords.some(kw => lower.includes(kw))) return suggestion;
  }
  return undefined;
}

export function generateId(): string {
  return `REQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}
