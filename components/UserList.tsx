
import React, { useState, useEffect, useRef } from 'react';
import { Users, Ban, Hash } from 'lucide-react';
import { User, AppSettings, Theme } from '../types';
import { THEMES } from '../constants';

interface UserListProps {
  users: User[];
  settings: AppSettings;
  onMention: (nick: string) => void;
  onBlockNick: (nick: string) => void;
  onBlockTrip: (trip: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, settings, onMention, onBlockNick, onBlockTrip }) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; user: User } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[settings.theme];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent, user: User) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      user: user
    });
  };

  return (
    <div className="flex-1 overflow-y-auto relative p-4">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold opacity-70 uppercase tracking-wider">
        <Users className="w-4 h-4" /> Online ({users.length})
      </div>
      
      <ul className="space-y-2">
        {users.map((user, idx) => (
          <li 
            key={`${user.nick}-${idx}`} 
            onClick={() => onMention(user.nick)}
            onContextMenu={(e) => handleContextMenu(e, user)}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 text-sm cursor-pointer transition-colors select-none group"
          >
            <div className={`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)] group-hover:scale-110 transition-transform`} />
            <span className="font-medium truncate flex-1 group-hover:text-blue-400 transition-colors" title={user.nick}>
              {user.nick}
            </span>
            {user.trip && (
              <span className="text-xs opacity-40 font-mono truncate max-w-[60px]">{user.trip}</span>
            )}
            
            {/* Mobile-only Block Button (visible on small screens) */}
            <button
              className="md:hidden p-1.5 text-red-500/50 hover:text-red-500 active:scale-95 transition-all"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering mention
                onBlockNick(user.nick);
              }}
              title="Block User"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Context Menu (Desktop) */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[160px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
           <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-500 dark:text-slate-400">
             {contextMenu.user.nick}
           </div>
           <button
             onClick={() => {
               onBlockNick(contextMenu.user.nick);
               setContextMenu(null);
             }}
             className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600"
           >
             <Ban className="w-4 h-4" /> Block Nick
           </button>
           {contextMenu.user.trip && (
             <button
               onClick={() => {
                 onBlockTrip(contextMenu.user.trip!);
                 setContextMenu(null);
               }}
               className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600"
             >
               <Hash className="w-4 h-4" /> Block Trip
             </button>
           )}
        </div>
      )}
    </div>
  );
};

export default UserList;
