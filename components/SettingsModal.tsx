
import React from 'react';
import { X, Trash2, Image as ImageIcon, Palette, Shield, Volume2, Sparkles, Smile, Calculator } from 'lucide-react';
import { AppSettings, Theme } from '../types';
import { THEMES } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const activeTheme = THEMES[settings.theme];

  const updateField = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const removeBlockedNick = (nick: string) => {
    updateField('blockedNicks', settings.blockedNicks.filter(n => n !== nick));
  };

  const removeBlockedTrip = (trip: string) => {
    updateField('blockedTrips', settings.blockedTrips.filter(t => t !== trip));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${activeTheme.sidebarBg} ${activeTheme.fg} border ${activeTheme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${activeTheme.border}`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          
          {/* Appearance */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 opacity-90">
              <Palette className="w-5 h-5" /> Appearance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(Object.keys(THEMES) as Theme[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => updateField('theme', themeKey)}
                  className={`p-4 rounded-lg border-2 transition-all ${settings.theme === themeKey ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent hover:border-gray-500'} ${THEMES[themeKey].bg}`}
                >
                  <div className={`text-center font-medium ${THEMES[themeKey].fg}`}>{THEMES[themeKey].name}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 opacity-90">
              <Sparkles className="w-5 h-5" /> Experience
            </h3>
            <div className="space-y-3">
             <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.soundEnabled}
                  onChange={(e) => updateField('soundEnabled', e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-2"><Volume2 className="w-4 h-4" /> Enable notification sounds</span>
                  <span className="text-xs opacity-60">Play a sound when messages arrive</span>
                </div>
             </label>
             
             <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.enableEffects}
                  onChange={(e) => updateField('enableEffects', e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-2"><Sparkles className="w-4 h-4" /> Enable visual effects</span>
                  <span className="text-xs opacity-60">Show background particles and animations</span>
                </div>
             </label>

             <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.enableLatex}
                  onChange={(e) => updateField('enableLatex', e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-2"><Calculator className="w-4 h-4" /> Enable Math (LaTeX)</span>
                  <span className="text-xs opacity-60">Render equations between $ symbols (e.g. $E=mc^2$)</span>
                </div>
             </label>
            </div>
          </section>

          {/* Services / APIs */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 opacity-90">
              <ImageIcon className="w-5 h-5" /> External APIs
            </h3>
            
            {/* ImgBB */}
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium opacity-80">ImgBB API Key (Image Upload)</label>
              <p className="text-xs opacity-60 mb-1">Get key from <a href="https://api.imgbb.com/" target="_blank" rel="noreferrer" className="text-blue-500 underline">api.imgbb.com</a></p>
              <input
                type="text"
                value={settings.imgbbApiKey}
                onChange={(e) => updateField('imgbbApiKey', e.target.value)}
                placeholder="e.g. 4a8b..."
                className={`w-full px-4 py-2 rounded-lg ${activeTheme.inputBg} ${activeTheme.inputFg} border ${activeTheme.border} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
            </div>

            {/* Tenor */}
            <div className="space-y-2">
              <label className="block text-sm font-medium opacity-80 flex items-center gap-2">
                <Smile className="w-4 h-4" /> Tenor API Key (GIF Search)
              </label>
              <p className="text-xs opacity-60 mb-1">Get key from <a href="https://developers.google.com/tenor/guides/quickstart" target="_blank" rel="noreferrer" className="text-blue-500 underline">Tenor Developer Console</a></p>
              <input
                type="text"
                value={settings.tenorApiKey || ''}
                onChange={(e) => updateField('tenorApiKey', e.target.value)}
                placeholder="e.g. LIVD..."
                className={`w-full px-4 py-2 rounded-lg ${activeTheme.inputBg} ${activeTheme.inputFg} border ${activeTheme.border} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
            </div>
          </section>

          {/* Blocked Users */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 opacity-90">
              <Shield className="w-5 h-5" /> Moderation
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Blocked Nicks */}
              <div className={`p-4 rounded-lg border ${activeTheme.border} bg-white/5`}>
                <h4 className="font-medium mb-3 opacity-80">Blocked Nicks</h4>
                {settings.blockedNicks.length === 0 ? (
                  <p className="text-sm opacity-50 italic">No blocked users.</p>
                ) : (
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {settings.blockedNicks.map(nick => (
                      <li key={nick} className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/5">
                        <span>{nick}</span>
                        <button onClick={() => removeBlockedNick(nick)} className="text-red-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Blocked Trips */}
              <div className={`p-4 rounded-lg border ${activeTheme.border} bg-white/5`}>
                <h4 className="font-medium mb-3 opacity-80">Blocked Tripcodes</h4>
                {settings.blockedTrips.length === 0 ? (
                  <p className="text-sm opacity-50 italic">No blocked trips.</p>
                ) : (
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {settings.blockedTrips.map(trip => (
                      <li key={trip} className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/5">
                        <span className="font-mono">{trip}</span>
                        <button onClick={() => removeBlockedTrip(trip)} className="text-red-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${activeTheme.border} flex justify-end`}>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;