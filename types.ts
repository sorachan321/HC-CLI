

export interface HackChatMessage {
  time: number;
  nick: string;
  text: string;
  trip?: string;
  mod?: boolean;
  admin?: boolean;
  cmd?: string;
  uType?: 'user' | 'mod' | 'admin'; // Derived
}

export interface User {
  nick: string;
  trip?: string;
  uType?: 'user' | 'mod' | 'admin';
}

export type Theme = 'light' | 'dark' | 'hacker' | 'nebula' | 'dracula' | 'nord' | 'synthwave' | 'c64' | 'solalight' | 'floral';

export type SpecialColor = 'red' | 'orange' | 'gold' | 'green' | 'cyan' | 'purple';

export interface SpecialUser {
  id: string;
  nick?: string; // Match by nick
  trip?: string; // Match by trip
  label?: string; // Custom suffix e.g. " [My Friend]"
  color: SpecialColor;
}

export interface AppSettings {
  theme: Theme;
  imgbbApiKey: string;
  tenorApiKey: string; // New for GIF search
  blockedNicks: string[];
  blockedTrips: string[];
  specialUsers: SpecialUser[]; // New: Watched users
  soundEnabled: boolean;
  enableEffects: boolean;
  enableLatex: boolean;
  autoReconnect: boolean; // New: Auto Reconnect logic
}

export interface ChatState {
  connected: boolean;
  joined: boolean;
  channel: string;
  nick: string;
  users: User[];
  messages: HackChatMessage[];
  error: string | null;
}