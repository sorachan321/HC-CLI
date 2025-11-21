
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

export interface AppSettings {
  theme: Theme;
  imgbbApiKey: string;
  tenorApiKey: string; // New for GIF search
  blockedNicks: string[];
  blockedTrips: string[];
  soundEnabled: boolean;
  enableEffects: boolean;
  enableLatex: boolean;
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