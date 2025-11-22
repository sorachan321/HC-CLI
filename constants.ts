


import { Theme, SpecialColor } from './types';

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
  mentionSelf: string; 
  mentionOther: string;
  // New: Color palette for special users, matched to the theme
  specialColors: Record<SpecialColor, string>;
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
    specialColors: {
      red: 'bg-red-50 border-red-200 text-red-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      gold: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
    }
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
    specialColors: {
      red: 'bg-red-900/20 border-red-700/50 text-red-200',
      orange: 'bg-orange-900/20 border-orange-700/50 text-orange-200',
      gold: 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200',
      green: 'bg-green-900/20 border-green-700/50 text-green-200',
      cyan: 'bg-cyan-900/20 border-cyan-700/50 text-cyan-200',
      purple: 'bg-purple-900/20 border-purple-700/50 text-purple-200',
    }
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
    specialColors: {
      red: 'bg-black border-red-700 text-red-500',
      orange: 'bg-black border-orange-700 text-orange-500',
      gold: 'bg-black border-yellow-700 text-yellow-500',
      green: 'bg-green-900/50 border-green-500 text-green-400', // Intensified default
      cyan: 'bg-black border-cyan-700 text-cyan-500',
      purple: 'bg-black border-purple-700 text-purple-500',
    }
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
    specialColors: {
      red: 'bg-red-900/40 border-red-500/50 text-red-200',
      orange: 'bg-orange-900/40 border-orange-500/50 text-orange-200',
      gold: 'bg-amber-900/40 border-amber-500/50 text-amber-200',
      green: 'bg-emerald-900/40 border-emerald-500/50 text-emerald-200',
      cyan: 'bg-cyan-900/40 border-cyan-500/50 text-cyan-200',
      purple: 'bg-fuchsia-900/40 border-fuchsia-500/50 text-fuchsia-200',
    }
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
    specialColors: {
      red: 'bg-[#44475a] border-[#ff5555] text-[#ff5555]',
      orange: 'bg-[#44475a] border-[#ffb86c] text-[#ffb86c]',
      gold: 'bg-[#44475a] border-[#f1fa8c] text-[#f1fa8c]',
      green: 'bg-[#44475a] border-[#50fa7b] text-[#50fa7b]',
      cyan: 'bg-[#44475a] border-[#8be9fd] text-[#8be9fd]',
      purple: 'bg-[#44475a] border-[#bd93f9] text-[#bd93f9]',
    }
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
    specialColors: {
      red: 'bg-[#3b4252] border-[#bf616a] text-[#bf616a]',
      orange: 'bg-[#3b4252] border-[#d08770] text-[#d08770]',
      gold: 'bg-[#3b4252] border-[#ebcb8b] text-[#ebcb8b]',
      green: 'bg-[#3b4252] border-[#a3be8c] text-[#a3be8c]',
      cyan: 'bg-[#3b4252] border-[#88c0d0] text-[#88c0d0]',
      purple: 'bg-[#3b4252] border-[#b48ead] text-[#b48ead]',
    }
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
    specialColors: {
      red: 'bg-[#241b31] border-[#ff5555] text-[#ff5555] shadow-[0_0_10px_rgba(255,85,85,0.3)]',
      orange: 'bg-[#241b31] border-[#ffb86c] text-[#ffb86c] shadow-[0_0_10px_rgba(255,184,108,0.3)]',
      gold: 'bg-[#241b31] border-[#fffb96] text-[#fffb96] shadow-[0_0_10px_rgba(255,251,150,0.3)]',
      green: 'bg-[#241b31] border-[#05ffa1] text-[#05ffa1] shadow-[0_0_10px_rgba(5,255,161,0.3)]',
      cyan: 'bg-[#241b31] border-[#01cdfe] text-[#01cdfe] shadow-[0_0_10px_rgba(1,205,254,0.3)]',
      purple: 'bg-[#241b31] border-[#b967ff] text-[#b967ff] shadow-[0_0_10px_rgba(185,103,255,0.3)]',
    }
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
    specialColors: {
      red: 'bg-[#4040e0] border-2 border-[#880000] text-[#ffaaaa]',
      orange: 'bg-[#4040e0] border-2 border-[#aa6600] text-[#ffccaa]',
      gold: 'bg-[#4040e0] border-2 border-[#aaaa00] text-[#ffffaa]',
      green: 'bg-[#4040e0] border-2 border-[#00aa00] text-[#aaffaa]',
      cyan: 'bg-[#4040e0] border-2 border-[#00aaaa] text-[#aaffff]',
      purple: 'bg-[#4040e0] border-2 border-[#aa00aa] text-[#ffaaff]',
    }
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
    specialColors: {
      red: 'bg-[#fdf6e3] border-2 border-[#dc322f] text-[#dc322f]',
      orange: 'bg-[#fdf6e3] border-2 border-[#cb4b16] text-[#cb4b16]',
      gold: 'bg-[#fdf6e3] border-2 border-[#b58900] text-[#b58900]',
      green: 'bg-[#fdf6e3] border-2 border-[#859900] text-[#859900]',
      cyan: 'bg-[#fdf6e3] border-2 border-[#2aa198] text-[#2aa198]',
      purple: 'bg-[#fdf6e3] border-2 border-[#d33682] text-[#d33682]',
    }
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
    specialColors: {
      red: 'bg-[#ffebee] border-[#ffcdd2] text-[#b71c1c]',
      orange: 'bg-[#fff3e0] border-[#ffe0b2] text-[#e65100]',
      gold: 'bg-[#fff8e1] border-[#ffecb3] text-[#bf360c]',
      green: 'bg-[#e8f5e9] border-[#c8e6c9] text-[#1b5e20]',
      cyan: 'bg-[#e0f7fa] border-[#b2ebf2] text-[#006064]',
      purple: 'bg-[#f3e5f5] border-[#e1bee7] text-[#4a148c]',
    }
  },
  'd$ck': {
    name: 'D$CK (INSANE)',
    bg: 'bg-black',
    fg: 'text-[#00ff00]',
    sidebarBg: 'bg-black',
    sidebarFg: 'text-[#ff00ff]',
    inputBg: 'bg-black',
    inputFg: 'text-[#00ffff]',
    accent: 'text-[#ffff00]',
    bubbleSelf: 'bg-[#000] text-[#00ff00] border-2 border-[#00ff00] shadow-[4px_4px_0px_#ff00ff]',
    bubbleOther: 'bg-[#000] text-[#00ffff] border-2 border-[#00ffff] shadow-[-4px_4px_0px_#ffff00]',
    border: 'border-[#ff0000]',
    mentionSelf: 'bg-[#ff00ff] text-black border-[#00ff00]',
    mentionOther: 'bg-[#00ffff] text-black border-[#ffff00]',
    specialColors: {
      red: 'bg-black border-2 border-[#ff0000] text-[#ff0000] shadow-[2px_2px_0px_white]',
      orange: 'bg-black border-2 border-[#ff5500] text-[#ff5500] shadow-[2px_2px_0px_white]',
      gold: 'bg-black border-2 border-[#ffff00] text-[#ffff00] shadow-[2px_2px_0px_white]',
      green: 'bg-black border-2 border-[#00ff00] text-[#00ff00] shadow-[2px_2px_0px_white]',
      cyan: 'bg-black border-2 border-[#00ffff] text-[#00ffff] shadow-[2px_2px_0px_white]',
      purple: 'bg-black border-2 border-[#ff00ff] text-[#ff00ff] shadow-[2px_2px_0px_white]',
    }
  }
};

// Dynamic CSS for Chaos Mode (Injected only when needed)
export const CHAOS_CSS = `
@keyframes chaos-glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(-20deg); }
  40% { transform: skew(20deg); }
  60% { transform: skew(-5deg); }
  80% { transform: skew(5deg); }
  100% { transform: skew(0deg); }
}

@keyframes chaos-flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes chaos-shake {
  0% { transform: translate(2px, 2px) rotate(0deg); }
  10% { transform: translate(-2px, -4px) rotate(-2deg); }
  20% { transform: translate(-6px, 0px) rotate(2deg); }
  30% { transform: translate(6px, 4px) rotate(0deg); }
  40% { transform: translate(2px, -2px) rotate(2deg); }
  50% { transform: translate(-2px, 4px) rotate(-2deg); }
  60% { transform: translate(-6px, 2px) rotate(0deg); }
  70% { transform: translate(6px, 2px) rotate(-2deg); }
  80% { transform: translate(-2px, -2px) rotate(2deg); }
  90% { transform: translate(2px, 4px) rotate(0deg); }
  100% { transform: translate(2px, -4px) rotate(-2deg); }
}

@keyframes chaos-rgb-split {
  0% { text-shadow: -4px 0 red, 4px 0 blue; }
  25% { text-shadow: -4px -4px red, 4px 4px blue; }
  50% { text-shadow: -4px 4px red, 4px -4px blue; }
  75% { text-shadow: 4px 4px red, -4px -4px blue; }
  100% { text-shadow: -4px 0 red, 4px 0 blue; }
}

@keyframes chaos-dvd-bounce {
  0% { transform: translate(0, 0); }
  25% { transform: translate(40px, -40px); }
  50% { transform: translate(-40px, 20px); }
  75% { transform: translate(20px, 40px); }
  100% { transform: translate(0, 0); }
}

@keyframes chaos-rotate {
   0% { transform: rotate(0deg); }
   50% { transform: rotate(15deg); }
   100% { transform: rotate(-15deg); }
}

@keyframes chaos-rainbow {
  0% { color: #ff0000; }
  14% { color: #ff7f00; }
  28% { color: #ffff00; }
  42% { color: #00ff00; }
  57% { color: #0000ff; }
  71% { color: #4b0082; }
  85% { color: #9400d3; }
  100% { color: #ff0000; }
}

@keyframes chaos-button-flash {
  0% { background-color: transparent; border-color: transparent; }
  25% { background-color: #ff0000; border-color: #ffff00; }
  50% { background-color: #00ff00; border-color: #ff00ff; }
  75% { background-color: #0000ff; border-color: #00ffff; }
  100% { background-color: transparent; border-color: transparent; }
}

.chaos-text {
  animation: chaos-rgb-split 0.2s infinite steps(2);
}

.chaos-flash {
  animation: chaos-flash 0.1s infinite;
}

.chaos-shake {
  animation: chaos-shake 0.2s infinite;
}

.chaos-dvd {
  animation: chaos-dvd-bounce 1s infinite alternate ease-in-out;
}

.chaos-rotate {
  animation: chaos-rotate 0.3s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

.chaos-rainbow-text {
  animation: chaos-rainbow 0.2s infinite linear;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 0px #000;
}

.chaos-hover-flash:hover {
  animation: chaos-button-flash 0.1s infinite;
}
`;
