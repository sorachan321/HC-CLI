import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { THEMES } from '../constants';
import { AppSettings } from '../types';

interface LoginProps {
  onJoin: (nick: string, channel: string, password?: string) => void;
  settings: AppSettings;
}

const Login: React.FC<LoginProps> = ({ onJoin, settings }) => {
  const [nick, setNick] = useState('');
  const [channel, setChannel] = useState('programming');
  const [password, setPassword] = useState('');

  const theme = THEMES[settings.theme];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nick && channel) {
      onJoin(nick, channel, password);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.fg} transition-colors duration-300`}>
      <div className={`max-w-md w-full p-8 rounded-xl shadow-2xl border ${theme.border} ${theme.sidebarBg}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${theme.accent}`}>Hack.Chat Redux</h1>
          <p className="opacity-70">Enter the matrix</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Nickname</label>
            <input
              type="text"
              required
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="User"
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.inputBg} ${theme.inputFg} border ${theme.border}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Channel</label>
            <div className="relative">
              <span className={`absolute left-4 top-3.5 opacity-50 font-mono`}>?</span>
              <input
                type="text"
                required
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="programming"
                className={`w-full pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.inputBg} ${theme.inputFg} border ${theme.border}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Password (Optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="For registered nicks"
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.inputBg} ${theme.inputFg} border ${theme.border}`}
            />
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform active:scale-95`}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Connect
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;