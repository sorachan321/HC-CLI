
import { Theme } from './types';

export const DEFAULT_CHANNEL = 'programming';
export const DEFAULT_WS_URL = 'wss://hack.chat/chat-ws';

export const THEMES: Record<Theme, {
  name: string;
  bg: string;
  fg: string;
  sidebarBg: string;
  sidebarFg: string;
  inputBg: string;
  inputFg: string;
  accent: string;
  bubbleSelf: string;
  bubbleOther: string;
  border: string;
  // New fields for specific mention styling
  mentionSelf: string;  // Styling for mentions inside MY message (usually needs high contrast against colored bubble)
  mentionOther: string; // Styling for mentions inside OTHER'S message (usually needs accent color)
}> = {
  light: {
    name: 'Light',
    bg: 'bg-gray-50',
    fg: 'text-gray-900',
    sidebarBg: 'bg-white',
    sidebarFg: 'text-gray-700',
    inputBg: 'bg-white',
    inputFg: 'text-gray-900',
    accent: 'text-blue-600',
    bubbleSelf: 'bg-blue-500 text-white rounded-2xl rounded-tr-sm shadow-sm',
    bubbleOther: 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm',
    border: 'border-gray-200',
    mentionSelf: 'bg-white text-blue-600 border-white/50 hover:bg-blue-50',
    mentionOther: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  },
  dark: {
    name: 'Dark',
    bg: 'bg-slate-900',
    fg: 'text-slate-100',
    sidebarBg: 'bg-slate-950',
    sidebarFg: 'text-slate-400',
    inputBg: 'bg-slate-800',
    inputFg: 'text-slate-100',
    accent: 'text-blue-400',
    bubbleSelf: 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm',
    bubbleOther: 'bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl rounded-tl-sm shadow-sm',
    border: 'border-slate-800',
    mentionSelf: 'bg-white/90 text-blue-700 border-transparent hover:bg-white',
    mentionOther: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30',
  },
  hacker: {
    name: 'Hacker',
    bg: 'bg-black',
    fg: 'text-green-500',
    sidebarBg: 'bg-black',
    sidebarFg: 'text-green-700',
    inputBg: 'bg-zinc-900',
    inputFg: 'text-green-500',
    accent: 'text-green-400',
    bubbleSelf: 'bg-green-900 text-green-100 border border-green-700 rounded-sm',
    bubbleOther: 'bg-black border border-green-800 text-green-500 rounded-sm',
    border: 'border-green-900',
    mentionSelf: 'bg-black text-green-500 border-green-500/50 hover:text-green-400',
    mentionOther: 'bg-green-900/40 text-green-400 border-green-800 hover:bg-green-900/60',
  },
  nebula: {
    name: 'Nebula',
    bg: 'bg-indigo-950',
    fg: 'text-fuchsia-100',
    sidebarBg: 'bg-indigo-950',
    sidebarFg: 'text-indigo-300',
    inputBg: 'bg-indigo-900/50',
    inputFg: 'text-fuchsia-50',
    accent: 'text-fuchsia-400',
    bubbleSelf: 'bg-fuchsia-700 text-white rounded-3xl rounded-br-none shadow-md',
    bubbleOther: 'bg-indigo-900/80 border border-indigo-700/50 text-indigo-100 rounded-3xl rounded-bl-none shadow-md',
    border: 'border-indigo-800',
    mentionSelf: 'bg-white text-fuchsia-700 border-fuchsia-300 hover:bg-fuchsia-50',
    mentionOther: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30',
  },
  dracula: {
    name: 'Dracula',
    bg: 'bg-[#282a36]',
    fg: 'text-[#f8f8f2]',
    sidebarBg: 'bg-[#21222c]',
    sidebarFg: 'text-[#bd93f9]',
    inputBg: 'bg-[#44475a]',
    inputFg: 'text-[#f8f8f2]',
    accent: 'text-[#ff79c6]',
    bubbleSelf: 'bg-[#ff79c6] text-[#282a36] rounded-xl rounded-tr-none shadow-sm',
    bubbleOther: 'bg-[#44475a] text-[#f8f8f2] rounded-xl rounded-tl-none shadow-sm',
    border: 'border-[#6272a4]',
    mentionSelf: 'bg-[#282a36] text-[#ff79c6] border-[#bd93f9]/30 hover:bg-[#44475a]',
    mentionOther: 'bg-[#ff79c6]/20 text-[#ff79c6] border-[#ff79c6]/30 hover:bg-[#ff79c6]/30',
  },
  nord: {
    name: 'Nord',
    bg: 'bg-[#2e3440]',
    fg: 'text-[#d8dee9]',
    sidebarBg: 'bg-[#242933]',
    sidebarFg: 'text-[#88c0d0]',
    inputBg: 'bg-[#3b4252]',
    inputFg: 'text-[#eceff4]',
    accent: 'text-[#88c0d0]',
    bubbleSelf: 'bg-[#5e81ac] text-[#eceff4] rounded-lg shadow-sm',
    bubbleOther: 'bg-[#3b4252] text-[#eceff4] border border-[#4c566a] rounded-lg shadow-sm',
    border: 'border-[#4c566a]',
    mentionSelf: 'bg-[#eceff4] text-[#5e81ac] border-transparent hover:bg-white',
    mentionOther: 'bg-[#88c0d0]/20 text-[#88c0d0] border-[#88c0d0]/30 hover:bg-[#88c0d0]/30',
  },
  synthwave: {
    name: 'Synthwave',
    bg: 'bg-[#2b213a]',
    fg: 'text-[#ff71ce]',
    sidebarBg: 'bg-[#241b31]',
    sidebarFg: 'text-[#01cdfe]',
    inputBg: 'bg-[#241b31]',
    inputFg: 'text-[#fffb96]',
    accent: 'text-[#05ffa1]',
    bubbleSelf: 'bg-gradient-to-r from-[#b967ff] to-[#01cdfe] text-white rounded-tl-xl rounded-br-xl border-none shadow-md',
    bubbleOther: 'bg-[#241b31] border border-[#01cdfe] text-[#01cdfe] rounded-tr-xl rounded-bl-xl shadow-[0_0_10px_rgba(1,205,254,0.2)]',
    border: 'border-[#b967ff]',
    mentionSelf: 'bg-[#241b31] text-[#01cdfe] border-[#05ffa1] hover:text-[#05ffa1]',
    mentionOther: 'bg-[#ff71ce]/20 text-[#ff71ce] border-[#ff71ce]/50 hover:bg-[#ff71ce]/30',
  },
  c64: {
    name: 'C64',
    bg: 'bg-[#4040e0]',
    fg: 'text-[#a0a0ff]',
    sidebarBg: 'bg-[#3535c0]',
    sidebarFg: 'text-[#a0a0ff]',
    inputBg: 'bg-[#3535c0]',
    inputFg: 'text-[#a0a0ff]',
    accent: 'text-white',
    bubbleSelf: 'bg-[#a0a0ff] text-[#4040e0] font-mono uppercase rounded-none border-b-4 border-r-4 border-[#3030b0]',
    bubbleOther: 'bg-[#4040e0] text-[#a0a0ff] font-mono uppercase border-2 border-[#a0a0ff] rounded-none',
    border: 'border-[#a0a0ff]',
    mentionSelf: 'bg-[#4040e0] text-white border-white',
    mentionOther: 'bg-[#a0a0ff] text-[#4040e0] border-[#3030b0]',
  },
  solalight: {
    name: 'Solarized',
    bg: 'bg-[#fdf6e3]',
    fg: 'text-[#657b83]',
    sidebarBg: 'bg-[#eee8d5]',
    sidebarFg: 'text-[#586e75]',
    inputBg: 'bg-[#fdf6e3]',
    inputFg: 'text-[#657b83]',
    accent: 'text-[#cb4b16]',
    bubbleSelf: 'bg-[#268bd2] text-white rounded-lg shadow-sm',
    bubbleOther: 'bg-[#eee8d5] text-[#657b83] rounded-lg shadow-inner',
    border: 'border-[#93a1a1]',
    mentionSelf: 'bg-[#fdf6e3] text-[#268bd2] border-[#268bd2]',
    mentionOther: 'bg-[#93a1a1]/20 text-[#586e75] border-[#93a1a1]/40',
  },
  floral: {
    name: 'Floral',
    bg: 'bg-[#fdfcf0]', 
    fg: 'text-[#5c5c4f]',
    sidebarBg: 'bg-[#f4f9f0]',
    sidebarFg: 'text-[#6b8c6b]',
    inputBg: 'bg-[#ffffff]',
    inputFg: 'text-[#5c5c4f]',
    accent: 'text-[#e68a8a]',
    bubbleSelf: 'bg-[#dcedc8] text-[#33691e] rounded-2xl rounded-tr-sm shadow-sm',
    bubbleOther: 'bg-white border border-[#f0f4c3] text-[#5c5c4f] rounded-2xl rounded-tl-sm shadow-sm',
    border: 'border-[#e0e7d1]',
    mentionSelf: 'bg-[#f1f8e9] text-[#558b2f] border-[#c5e1a5]',
    mentionOther: 'bg-[#f9fbe7] text-[#6b8c6b] border-[#dcedc8] hover:bg-[#f0f4c3]',
  }
};
