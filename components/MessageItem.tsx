import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { format } from 'date-fns';
import { MoreVertical, Reply, Ban, Hash, Shield, ShieldAlert, User as UserIcon, AtSign, Star } from 'lucide-react';
import { HackChatMessage, AppSettings, User } from '../types';
import { THEMES } from '../constants';

interface MessageItemProps {
  msg: HackChatMessage;
  isMe: boolean;
  settings: AppSettings;
  currentUsers: User[];
  onReply: (nick: string, text: string) => void;
  onMention: (nick: string) => void;
  onBlockNick: (nick: string) => void;
  onBlockTrip: (trip: string) => void;
}

// --- Mention Pill Component ---
interface MentionPillProps {
  nick: string;
  isMe: boolean;
  themeSettings: typeof THEMES.light;
  onClick: (e: React.MouseEvent) => void;
}

const MentionPill: React.FC<MentionPillProps> = ({ 
  nick, 
  isMe, 
  themeSettings, 
  onClick 
}) => {
  
  const baseClasses = "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer select-none align-baseline transition-all duration-200 hover:scale-105 active:scale-95 mx-0.5 shadow-sm border";
  
  // Use the theme-specific mention styles defined in constants.ts
  const colors = isMe ? themeSettings.mentionSelf : themeSettings.mentionOther;

  return (
    <span 
      onClick={onClick}
      className={`${baseClasses} ${colors}`}
      title={`Mentioned: ${nick}`}
    >
      <AtSign className="w-3 h-3 opacity-70 stroke-[3]" />
      <span className="relative top-[0.5px]">{nick}</span>
    </span>
  );
};

const MessageItem: React.FC<MessageItemProps> = ({ msg, isMe, settings, currentUsers, onReply, onMention, onBlockNick, onBlockTrip }) => {
  const [showActions, setShowActions] = React.useState(false);
  const theme = THEMES[settings.theme];

  // Check if sender is a "Special User"
  const specialUser = React.useMemo(() => {
    if (isMe) return null;
    return settings.specialUsers.find(u => {
      if (u.nick && u.nick === msg.nick) return true;
      if (u.trip && msg.trip && u.trip === msg.trip) return true;
      return false;
    });
  }, [settings.specialUsers, msg.nick, msg.trip, isMe]);

  const formattedTime = format(new Date(msg.time), 'HH:mm');

  const getRoleIcon = () => {
    if (specialUser) return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />;
    if (msg.admin) return <ShieldAlert className="w-4 h-4 text-red-500" />;
    if (msg.mod) return <Shield className="w-4 h-4 text-green-500" />;
    return <UserIcon className="w-4 h-4 opacity-50" />;
  };

  const remarkPlugins: any[] = [remarkGfm, remarkBreaks];
  if (settings.enableLatex) remarkPlugins.push(remarkMath);
  
  const rehypePlugins: any[] = [];
  if (settings.enableLatex) rehypePlugins.push(rehypeKatex);

  /**
   * Parses a plain string, detects @Mentions that match current users,
   * and replaces them with the MentionPill component.
   */
  const parseTextForMentions = (text: string) => {
    // If no users or empty text, return as is
    if (!text || !text.includes('@')) return text;
    
    // We scan for any word starting with @
    // Regex: @ followed by one or more non-whitespace characters, 
    // followed by a word boundary (space, punctuation, or end of string)
    // We capture the name part.
    const pattern = /@(\S+?)(?=[.,!?:;]|\s|$)/g;
    
    const parts = text.split(pattern);
    if (parts.length === 1) return text;

    const result: React.ReactNode[] = [];
    
    // split with capturing group results in: [ "Hello ", "User", " how are you" ]
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Even indices are always the text surrounding the captures
      if (i % 2 === 0) {
        if (part) result.push(part);
      } 
      // Odd indices are the captured nicknames
      else {
        // Check if this captured "nick" exists in current users (case-insensitive check usually better for UX)
        // But standard hack.chat usually implies exact case. Let's do exact match for highlighting to avoid false positives.
        const isValidUser = currentUsers.some(u => u.nick === part);

        if (isValidUser) {
          result.push(
            <MentionPill 
              key={`mention-${i}`}
              nick={part} 
              isMe={isMe} 
              themeSettings={theme}
              onClick={(e) => { e.stopPropagation(); onMention(part); }} 
            />
          );
        } else {
          // If not a valid user, just render text @User
          result.push(`@${part}`);
        }
      }
    }
    return result;
  };

  // Custom renderer to intercept text nodes in common block elements
  const components = {
    p: ({ children }: any) => (
      <p className="mb-1 last:mb-0">
        {React.Children.map(children, child => {
          if (typeof child === 'string') return parseTextForMentions(child);
          return child;
        })}
      </p>
    ),
    li: ({ children }: any) => (
      <li>
        {React.Children.map(children, child => {
          if (typeof child === 'string') return parseTextForMentions(child);
          return child;
        })}
      </li>
    ),
    strong: ({ children }: any) => (
      <strong>
        {React.Children.map(children, child => {
           if (typeof child === 'string') return parseTextForMentions(child);
           return child;
        })}
      </strong>
    ),
    em: ({ children }: any) => (
      <em>
        {React.Children.map(children, child => {
           if (typeof child === 'string') return parseTextForMentions(child);
           return child;
        })}
      </em>
    ),
    a: ({ href, children, ...props }: any) => {
      const linkClass = isMe 
        ? "text-white underline decoration-white/50 hover:decoration-white" 
        : "text-blue-500 hover:underline";
      return <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props}>{children}</a>;
    }
  };

  // Determine Bubble Style
  let bubbleClass = theme.bubbleOther;
  if (isMe) {
    bubbleClass = theme.bubbleSelf;
  } else if (specialUser) {
    // Override with special palette if it's a watched user
    bubbleClass = `${theme.specialColors[specialUser.color]} rounded-2xl rounded-tl-sm shadow-md border-2`;
  }

  return (
    <div className={`group flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        
        {/* Meta Info */}
        <div className={`flex items-center gap-2 text-xs mb-1 opacity-70 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${theme.fg}`}>
          {getRoleIcon()}
          <span className="font-bold hover:underline cursor-pointer" onClick={() => onMention(msg.nick)}>
            {msg.nick}
          </span>
          {specialUser?.label && (
             <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20 ${isMe ? '' : theme.accent}`}>
               {specialUser.label}
             </span>
          )}
          {msg.trip && <span className="font-mono opacity-50" title="Tripcode">{msg.trip}</span>}
          <span className="opacity-50">{formattedTime}</span>

          {/* MOBILE-ONLY ACTIONS: Visible on small screens, hidden on md+ */}
          {!isMe && (
            <div className="flex md:hidden items-center gap-3 ml-2 border-l pl-2 border-gray-500/30">
              <button 
                onClick={() => onReply(msg.nick, msg.text)}
                className={`${theme.accent} opacity-80 hover:opacity-100 transition-opacity`}
                title="Reply"
              >
                <Reply className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onBlockNick(msg.nick)}
                className="text-red-500 opacity-80 hover:opacity-100 transition-opacity"
                title="Block"
              >
                <Ban className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Bubble */}
        <div className={`relative p-3 transition-colors ${bubbleClass}`}>
          <div className={`markdown-body text-sm leading-relaxed break-words`}>
            <ReactMarkdown 
              remarkPlugins={remarkPlugins} 
              rehypePlugins={rehypePlugins}
              components={components}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
          
          {/* DESKTOP-ONLY Actions Trigger: Hidden on mobile (md:block), visible on hover */}
          {!isMe && (
            <button 
              onClick={() => setShowActions(!showActions)}
              className={`hidden md:block absolute -right-8 top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${theme.fg} hover:bg-white/10`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Menu (Desktop context mainly, or if triggered) */}
        {showActions && !isMe && (
          <div className={`absolute z-10 ${isMe ? 'right-full mr-2' : 'left-full ml-2'} top-0 bg-white dark:bg-slate-800 shadow-xl rounded-lg py-1 min-w-[140px] border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200`}>
            <button 
              onClick={() => { onReply(msg.nick, msg.text); setShowActions(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
            >
              <Reply className="w-4 h-4" /> Reply
            </button>
            <button 
              onClick={() => { onBlockNick(msg.nick); setShowActions(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600"
            >
              <Ban className="w-4 h-4" /> Block Nick
            </button>
            {msg.trip && (
              <button 
                onClick={() => { onBlockTrip(msg.trip!); setShowActions(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600"
              >
                <Hash className="w-4 h-4" /> Block Trip
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Overlay to close menu */}
      {showActions && (
        <div className="fixed inset-0 z-0" onClick={() => setShowActions(false)}></div>
      )}
    </div>
  );
};

export default React.memo(MessageItem);