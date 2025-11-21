
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, Settings, Send, Image as ImageIcon, X, Smile, DoorOpen, Loader2, AtSign } from 'lucide-react';
import useSound from 'use-sound'; 

import Login from './components/Login';
import MessageItem from './components/MessageItem';
import SettingsModal from './components/SettingsModal';
import UserList from './components/UserList';
import ParticleBackground from './components/ParticleBackground';
import StickerPicker from './components/StickerPicker';
import { THEMES, DEFAULT_WS_URL } from './constants';
import { AppSettings, ChatState, HackChatMessage, User } from './types';
import { uploadToImgBB } from './services/imgbbService';

// Sound effect (generic pop) 
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU';

function App() {
  // -- State --
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaults: AppSettings = {
      theme: 'dark',
      imgbbApiKey: '',
      tenorApiKey: '',
      blockedNicks: [],
      blockedTrips: [],
      soundEnabled: true,
      enableEffects: true,
      enableLatex: true,
    };

    try {
      const saved = localStorage.getItem('hackchat_settings');
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) }; // Merge to ensure new keys exist
      }
      return defaults;
    } catch {
       return defaults;
    }
  });

  const [chatState, setChatState] = useState<ChatState>({
    connected: false,
    joined: false,
    channel: '',
    nick: '',
    users: [],
    messages: [],
    error: null,
  });

  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Channel Switch Modal State
  const [isChannelModalOpen, setChannelModalOpen] = useState(false);
  const [newChannelInput, setNewChannelInput] = useState('');
  const [newNickInput, setNewNickInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Mention Auto-complete State
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickerButtonRef = useRef<HTMLButtonElement>(null);
  const channelInputRef = useRef<HTMLInputElement>(null);
  const mentionListRef = useRef<HTMLUListElement>(null);

  const theme = THEMES[settings.theme];

  // -- Effects --

  useEffect(() => {
    try {
      localStorage.setItem('hackchat_settings', JSON.stringify(settings));
    } catch (e) {
      // Ignore storage errors
    }
  }, [settings]);

  useEffect(() => {
    if (chatState.joined) {
      scrollToBottom();
    }
  }, [chatState.messages, chatState.joined]);

  // Focus channel input when modal opens
  useEffect(() => {
    if (isChannelModalOpen && channelInputRef.current) {
      channelInputRef.current.focus();
    }
  }, [isChannelModalOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px'; // Limit max height to ~128px
    }
  }, [inputText]);

  // Close sticker picker on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showStickerPicker &&
        stickerButtonRef.current &&
        !stickerButtonRef.current.contains(event.target as Node) &&
        // Check if click is inside the picker
        !(event.target as Element).closest('.sticker-picker-container')
      ) {
        setShowStickerPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStickerPicker]);

  // Detect Mention Typing
  useEffect(() => {
    if (!textareaRef.current) return;

    const checkMention = () => {
       const text = inputText;
       // Get text before cursor
       const beforeCursor = text.slice(0, cursorPos);
       
       // Find the last @ in the text before cursor
       const lastAt = beforeCursor.lastIndexOf('@');
       
       if (lastAt !== -1) {
         // Check if there are any spaces between @ and cursor.
         const query = beforeCursor.slice(lastAt + 1);
         
         // Valid mention triggers:
         // 1. @ is at the very start of string
         // 2. @ is preceded by whitespace (e.g. "hello @wor")
         const precedingChar = lastAt > 0 ? beforeCursor[lastAt - 1] : ' ';
         
         if (!/\s/.test(query) && (/\s/.test(precedingChar) || lastAt === 0)) {
           setMentionQuery(query);
           return;
         }
       }
       setMentionQuery(null);
       setMentionIndex(0);
    };

    checkMention();
  }, [inputText, cursorPos]);

  // Auto-scroll mention list with improved behavior
  useEffect(() => {
    if (mentionListRef.current && mentionQuery !== null) {
      const listNode = mentionListRef.current;
      const activeItem = listNode.children[mentionIndex] as HTMLElement;
      
      if (activeItem) {
        // block: 'nearest' works best for ensuring it just comes into view without jumping excessively
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [mentionIndex]); 

  // Reset scroll when query changes
  useEffect(() => {
    if (mentionQuery !== null) {
      setMentionIndex(0);
      if (mentionListRef.current) mentionListRef.current.scrollTop = 0;
    }
  }, [mentionQuery]);

  // -- Logic --

  const filteredMentionUsers = useMemo(() => {
    if (mentionQuery === null) return [];
    const lowerQuery = mentionQuery.toLowerCase();
    // Sort users: fuzzy match start, then others.
    return chatState.users
      .filter(u => u.nick.toLowerCase().includes(lowerQuery) && u.nick !== chatState.nick)
      .sort((a, b) => {
        // Priority 1: Starts with query
        const aStarts = a.nick.toLowerCase().startsWith(lowerQuery);
        const bStarts = b.nick.toLowerCase().startsWith(lowerQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        // Priority 2: Alphabetical
        return a.nick.localeCompare(b.nick);
      });
  }, [chatState.users, chatState.nick, mentionQuery]);

  const insertMention = (nick: string) => {
    if (mentionQuery === null) return;
    
    const beforeCursor = inputText.slice(0, cursorPos);
    const afterCursor = inputText.slice(cursorPos);
    const lastAt = beforeCursor.lastIndexOf('@');
    
    // Insert @Nick + Space (Plain Text, no Markdown)
    const newText = beforeCursor.slice(0, lastAt) + `@${nick} ` + afterCursor;
    setInputText(newText);
    setMentionQuery(null);
    
    // We need to defer the focus slightly to ensure React renders the new state
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 10);
  };

  // -- WebSocket Logic --

  const connect = (nick: string, channel: string, password?: string) => {
    setIsConnecting(true);

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    setChatState(prev => ({ 
      ...prev, 
      error: null,
      joined: false, 
      users: [],
      messages: [],
      connected: false
    }));

    const ws = new WebSocket(DEFAULT_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WS');
      ws.send(JSON.stringify({ cmd: 'join', channel, nick, password: password || undefined }));
      setChatState(prev => ({ ...prev, connected: true }));

      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ cmd: 'ping' }));
        }
      }, 60000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleMessage(data, nick, channel);
    };

    ws.onclose = () => {
      console.log('Disconnected');
      clearInterval(pingIntervalRef.current);
      setIsConnecting(false);
      setChatState(prev => ({ ...prev, connected: false, joined: false, users: [] }));
    };

    ws.onerror = (err) => {
      console.error('WS Error', err);
      setIsConnecting(false);
      setChatState(prev => ({ ...prev, error: 'Connection failed. Please check your internet or try again later.' }));
    };
  };

  const handleMessage = (data: any, myNick: string, myChannel: string) => {
    if (data.cmd === 'chat') {
      const newMsg: HackChatMessage = {
        time: data.time,
        nick: data.nick,
        text: data.text,
        trip: data.trip,
        mod: data.mod,
        admin: data.admin,
        cmd: 'chat'
      };
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, newMsg]
      }));
    } else if (data.cmd === 'onlineSet') {
      setIsConnecting(false);
      setChatState(prev => ({
        ...prev,
        joined: true,
        nick: myNick,
        channel: myChannel,
        users: data.nicks.map((n: string) => ({ nick: n })),
        error: null
      }));
    } else if (data.cmd === 'onlineAdd') {
      setChatState(prev => ({
        ...prev,
        users: [...prev.users, { nick: data.nick, trip: data.trip }]
      }));
      addSystemMessage(`${data.nick} joined the channel.`);
    } else if (data.cmd === 'onlineRemove') {
      setChatState(prev => ({
        ...prev,
        users: prev.users.filter(u => u.nick !== data.nick)
      }));
       addSystemMessage(`${data.nick} left.`);
    } else if (data.cmd === 'info') {
       addSystemMessage(`System: ${data.text}`);
    } else if (data.cmd === 'warn') {
       if (!chatState.joined) {
         setIsConnecting(false); 
         setChatState(prev => ({ ...prev, error: data.text }));
       } else {
         addSystemMessage(`Warning: ${data.text}`);
       }
    }
  };

  const addSystemMessage = (text: string) => {
    const sysMsg: HackChatMessage = {
      time: Date.now(),
      nick: 'System',
      text: `*${text}*`,
      cmd: 'info'
    };
    setChatState(prev => ({ ...prev, messages: [...prev.messages, sysMsg] }));
  };

  const sendMessage = () => {
    if (!inputText.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ cmd: 'chat', text: inputText }));
    setInputText('');
    setMentionQuery(null);
    textareaRef.current?.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // -- Actions --

  const handleOpenJoinChannel = () => {
    setNewNickInput(chatState.nick || localStorage.getItem('hc_saved_nick') || '');
    setNewPasswordInput(localStorage.getItem('hc_saved_password') || '');
    setNewChannelInput('');
    setChannelModalOpen(true);
  };

  const handleSwitchChannel = (e: React.FormEvent) => {
    e.preventDefault();
    const targetChannel = newChannelInput.trim();
    const targetNick = newNickInput.trim();
    const targetPass = newPasswordInput;

    if (!targetChannel || !targetNick) return;

    try {
      localStorage.setItem('hc_saved_nick', targetNick);
      localStorage.setItem('hc_saved_channel', targetChannel);
      localStorage.setItem('hc_saved_password', targetPass);
    } catch (e) {}

    connect(targetNick, targetChannel, targetPass);
    
    setChannelModalOpen(false);
    setNewChannelInput('');
    setSidebarOpen(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!settings.imgbbApiKey) {
      setUploadError("Please set your ImgBB API Key in Settings first.");
      setSettingsOpen(true);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const url = await uploadToImgBB(file, settings.imgbbApiKey);
      setInputText(prev => `${prev} ![](${url}) `);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleStickerSelect = (content: string) => {
    setInputText(prev => `${prev}${content} `);
    setShowStickerPicker(false);
    textareaRef.current?.focus();
  };

  const handleMention = (nick: string) => {
    setInputText(prev => {
      const space = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
      return `${prev}${space}@${nick} `;
    });
    textareaRef.current?.focus();
  };

  const handleReply = (nick: string, text: string) => {
    const formattedQuote = `>${nick}\n>${text}\n\n@${nick} `;
    setInputText(prev => {
      const prefix = prev ? prev + '\n' : '';
      return `${prefix}${formattedQuote}`;
    });
    textareaRef.current?.focus();
  };

  const handleBlockNick = (nick: string) => {
    if (confirm(`Block messages from ${nick}?`)) {
      setSettings(prev => ({
        ...prev,
        blockedNicks: [...prev.blockedNicks, nick]
      }));
    }
  };

  const handleBlockTrip = (trip: string) => {
    if (confirm(`Block messages from tripcode ${trip}?`)) {
      setSettings(prev => ({
        ...prev,
        blockedTrips: [...prev.blockedTrips, trip]
      }));
    }
  };
  
  // -- Input Handlers --

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery !== null && filteredMentionUsers.length > 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(prev => (prev > 0 ? prev - 1 : filteredMentionUsers.length - 1));
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(prev => (prev < filteredMentionUsers.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredMentionUsers[mentionIndex].nick);
        return;
      }
      if (e.key === 'Escape') {
        setMentionQuery(null);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setCursorPos(e.target.selectionStart);
  };
  
  const handleInputSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPos(e.currentTarget.selectionStart);
  };

  // -- Filtering --

  const filteredMessages = useMemo(() => {
    return chatState.messages.filter(msg => {
      if (settings.blockedNicks.includes(msg.nick)) return false;
      if (msg.trip && settings.blockedTrips.includes(msg.trip)) return false;
      return true;
    });
  }, [chatState.messages, settings.blockedNicks, settings.blockedTrips]);

  // Ensure mentionIndex is valid when list changes
  useEffect(() => {
    if (filteredMentionUsers.length > 0 && mentionIndex >= filteredMentionUsers.length) {
      setMentionIndex(0);
    }
  }, [filteredMentionUsers.length]);

  // -- Render --

  if (isConnecting) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.fg} relative overflow-hidden`}>
        {settings.enableEffects && <ParticleBackground themeName={settings.theme} />}
        <div className={`flex flex-col items-center gap-6 z-10 p-8 rounded-2xl bg-black/20 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300`}>
          <div className="relative">
             <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-blue-500 animate-pulse" />
             </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
            <p className="opacity-60">Entering the matrix</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chatState.joined) {
    return <Login onJoin={connect} settings={settings} error={chatState.error} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden relative ${theme.bg} ${theme.fg}`}>
      
      {settings.enableEffects && <ParticleBackground themeName={settings.theme} />}

      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 w-full z-20 h-14 border-b ${theme.border} ${theme.sidebarBg} flex items-center justify-between px-4`}>
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">?{chatState.channel}</span>
        </div>
        <button onClick={() => setSettingsOpen(true)}>
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 h-full w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${theme.sidebarBg} ${theme.sidebarFg} border-r ${theme.border} flex flex-col shadow-xl md:shadow-none
      `}>
        <div className="p-4 border-b ${theme.border} flex items-center justify-between">
          <div>
             <h1 className={`font-bold text-xl ${theme.accent}`}>Hack.Chat</h1>
             <p className="text-xs opacity-60">?{chatState.channel}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <UserList 
          users={chatState.users} 
          settings={settings}
          onMention={handleMention}
          onBlockNick={handleBlockNick}
          onBlockTrip={handleBlockTrip}
        />

        <div className="p-4 border-t ${theme.border} flex flex-col gap-2">
          <button 
            onClick={() => setSettingsOpen(true)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm font-medium`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button 
            onClick={handleOpenJoinChannel}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm font-medium text-blue-500`}
          >
            <DoorOpen className="w-4 h-4" /> Join Channel
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative pt-14 md:pt-0 min-w-0 z-10 bg-transparent">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          {filteredMessages.map((msg, idx) => (
            <MessageItem 
              key={`${msg.time}-${idx}`} 
              msg={msg} 
              isMe={msg.nick === chatState.nick} 
              settings={settings}
              currentUsers={chatState.users}
              onReply={handleReply}
              onMention={handleMention}
              onBlockNick={handleBlockNick}
              onBlockTrip={handleBlockTrip}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${theme.border} ${theme.sidebarBg} relative`}>
          
          {/* Mention Popover */}
          {mentionQuery !== null && filteredMentionUsers.length > 0 && (
             <div className={`
               absolute bottom-full left-4 mb-2 w-64 
               rounded-lg shadow-2xl border 
               ${settings.theme === 'light' || settings.theme === 'floral' || settings.theme === 'solalight' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}
               overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200
             `}>
                <div className={`px-3 py-2 text-xs font-bold uppercase tracking-wider opacity-70 border-b ${settings.theme.includes('light') ? 'border-gray-100' : 'border-white/10'}`}>
                  Users matching "@{mentionQuery}"
                </div>
                <ul className="max-h-48 overflow-y-auto py-1" ref={mentionListRef}>
                   {filteredMentionUsers.map((user, idx) => (
                     <li 
                       key={user.nick}
                       onClick={() => insertMention(user.nick)}
                       className={`
                         px-3 py-2 cursor-pointer flex items-center gap-3 text-sm transition-all
                         ${idx === mentionIndex 
                           ? 'bg-blue-600 text-white' 
                           : `hover:bg-black/5 dark:hover:bg-white/5 ${theme.fg}`}
                       `}
                     >
                        <div className={`
                          w-2 h-2 rounded-full shrink-0
                          ${idx === mentionIndex ? 'bg-white' : 'bg-green-500'}
                        `} />
                        <span className="font-medium truncate">{user.nick}</span>
                        {user.trip && (
                          <span className={`
                            text-xs opacity-50 ml-auto font-mono 
                            ${idx === mentionIndex ? 'text-blue-200' : ''}
                          `}>
                            {user.trip}
                          </span>
                        )}
                     </li>
                   ))}
                </ul>
             </div>
          )}

          {uploadError && (
             <div className="text-red-500 text-xs mb-2 animate-pulse">{uploadError}</div>
          )}
          <div className={`flex items-end gap-2 rounded-xl border ${theme.border} ${theme.inputBg} p-2 transition-all focus-within:ring-1 focus-within:ring-blue-500/50 relative`}>
            
            {/* Sticker/Emoji Button */}
            <div className="relative sticker-picker-container">
               {showStickerPicker && (
                 <StickerPicker 
                    settings={settings}
                    onSelect={handleStickerSelect}
                    onClose={() => setShowStickerPicker(false)}
                 />
               )}
               <button 
                 ref={stickerButtonRef}
                 onClick={() => setShowStickerPicker(!showStickerPicker)}
                 className={`p-2 rounded-lg transition-colors ${theme.inputFg} hover:bg-white/10 h-10 w-10 flex items-center justify-center`}
                 title="Emojis & GIFs"
               >
                  <Smile className={`w-5 h-5 ${showStickerPicker ? 'text-blue-500' : ''}`} />
               </button>
            </div>

            {/* Image Upload Button */}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`p-2 rounded-lg transition-colors ${theme.inputFg} hover:bg-white/10 disabled:opacity-50 h-10 w-10 flex items-center justify-center`}
              title="Upload Image (ImgBB)"
            >
               <ImageIcon className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
            </button>

            <textarea
              ref={textareaRef}
              id="chat-input"
              value={inputText}
              onChange={handleInputChange}
              onSelect={handleInputSelect}
              onKeyDown={handleKeyDown}
              placeholder={`Message ?${chatState.channel}...`}
              className={`flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-2 ${theme.inputFg} placeholder-opacity-50 max-h-32 overflow-y-auto`}
              rows={1}
            />

            <button 
              onClick={sendMessage}
              className={`p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors h-10 w-10 flex items-center justify-center shadow-lg`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs opacity-40 mt-2 text-center">
            Markdown supported. Shift+Enter for new line. @ to mention.
          </div>
        </div>

      </div>

      {/* Switch Channel Modal */}
      {isChannelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-sm p-6 rounded-xl shadow-2xl ${theme.sidebarBg} ${theme.fg} border ${theme.border} scale-100 animate-in zoom-in-95 duration-200`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <DoorOpen className="w-5 h-5" /> Join Channel
              </h3>
              <button onClick={() => setChannelModalOpen(false)} className="opacity-50 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSwitchChannel} className="space-y-4">
              {/* Nickname Input */}
              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Nickname</label>
                <input
                  type="text"
                  required
                  value={newNickInput}
                  onChange={(e) => setNewNickInput(e.target.value)}
                  placeholder="User"
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.inputBg} ${theme.inputFg} border ${theme.border}`}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Password (Optional)</label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="For registered nicks"
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.inputBg} ${theme.inputFg} border ${theme.border}`}
                />
              </div>

              {/* Channel Input */}
              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Channel Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 opacity-50 font-mono">?</span>
                  <input
                    ref={channelInputRef}
                    type="text"
                    required
                    value={newChannelInput}
                    onChange={(e) => setNewChannelInput(e.target.value)}
                    placeholder="programming"
                    className={`w-full pl-7 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.inputBg} ${theme.inputFg} border ${theme.border}`}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                 <button 
                   type="button"
                   onClick={() => setChannelModalOpen(false)}
                   className="px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors opacity-80"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
                 >
                   Join
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        settings={settings}
        onUpdateSettings={setSettings}
      />

    </div>
  );
}

export default App;
