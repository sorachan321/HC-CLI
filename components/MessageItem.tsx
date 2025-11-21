import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { MoreVertical, Reply, Ban, Hash, Shield, ShieldAlert, User as UserIcon } from 'lucide-react';
import { HackChatMessage, AppSettings } from '../types';
import { THEMES } from '../constants';

interface MessageItemProps {
  msg: HackChatMessage;
  isMe: boolean;
  settings: AppSettings;
  onReply: (nick: string, text: string) => void;
  onMention: (nick: string) => void;
  onBlockNick: (nick: string) => void;
  onBlockTrip: (trip: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, isMe, settings, onReply, onMention, onBlockNick, onBlockTrip }) => {
  const [showActions, setShowActions] = useState(false);
  const theme = THEMES[settings.theme];

  const formattedTime = format(new Date(msg.time), 'HH:mm');

  const getRoleIcon = () => {
    if (msg.admin) return <ShieldAlert className="w-4 h-4 text-red-500" />;
    if (msg.mod) return <Shield className="w-4 h-4 text-green-500" />;
    return <UserIcon className="w-4 h-4 opacity-50" />;
  };

  return (
    <div className={`group flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        
        {/* Meta Info */}
        <div className={`flex items-center gap-2 text-xs mb-1 opacity-70 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${theme.fg}`}>
          {getRoleIcon()}
          <span className="font-bold hover:underline cursor-pointer" onClick={() => onMention(msg.nick)}>
            {msg.nick}
          </span>
          {msg.trip && <span className="font-mono opacity-50" title="Tripcode">{msg.trip}</span>}
          <span className="opacity-50">{formattedTime}</span>
        </div>

        {/* Bubble */}
        <div
          className={`relative p-3 ${isMe ? theme.bubbleSelf : theme.bubbleOther}`}
        >
          <div className={`markdown-body text-sm leading-relaxed break-words`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" />
            }}>
              {msg.text}
            </ReactMarkdown>
          </div>
          
          {/* Actions Trigger (Hidden by default, visible on hover) */}
          {!isMe && (
            <button 
              onClick={() => setShowActions(!showActions)}
              className={`absolute -right-8 top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${theme.fg} hover:bg-white/10`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Menu */}
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

export default MessageItem;