

import React, { useState } from 'react';
import { X, Trash2, Image as ImageIcon, Palette, Shield, Volume2, Sparkles, Smile, Calculator, Star, Plus, RefreshCw, Check } from 'lucide-react';
import { AppSettings, Theme, SpecialColor, SpecialUser } from '../types';
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
  const [activeTab, setActiveTab] = useState<'general' | 'special'>('general');
  
  // New Special User State
  const [newSpecialNick, setNewSpecialNick] = useState('');
  const [newSpecialTrip, setNewSpecialTrip] = useState('');
  const [newSpecialLabel, setNewSpecialLabel] = useState('');
  const [newSpecialColor, setNewSpecialColor] = useState<SpecialColor>('gold');

  const updateField = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const removeBlockedNick = (nick: string) => {
    updateField('blockedNicks', settings.blockedNicks.filter(n => n !== nick));
  };

  const removeBlockedTrip = (trip: string) => {
    updateField('blockedTrips', settings.blockedTrips.filter(t => t !== trip));
  };

  const addSpecialUser = () => {
    if (!newSpecialNick && !newSpecialTrip) return;

    const newUser: SpecialUser = {
      id: Date.now().toString(),
      nick: newSpecialNick || undefined,
      trip: newSpecialTrip || undefined,
      label: newSpecialLabel || undefined,
      color: newSpecialColor
    };

    onUpdateSettings({
      ...settings,
      specialUsers: [...settings.specialUsers, newUser]
    });

    setNewSpecialNick('');
    setNewSpecialTrip('');
    setNewSpecialLabel('');
  };

  const removeSpecialUser = (id: string) => {
    onUpdateSettings({
      ...settings,
      specialUsers: settings.specialUsers.filter(u => u.id !== id)
    });
  };

  const COLORS: SpecialColor[] = ['red', 'orange', 'gold', 'green', 'cyan', 'purple'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl shadow-2xl ${activeTheme.sidebarBg} ${activeTheme.fg} border ${activeTheme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${activeTheme.border} shrink-0`}>
          <div className="flex gap-4">
             <button 
               onClick={() => setActiveTab('general')}
               className={`text-xl font-bold transition-opacity ${activeTab === 'general' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
             >
               Settings
             </button>
             <button 
               onClick={() => setActiveTab('special')}
               className={`text-xl font-bold transition-opacity flex items-center gap-2 ${activeTab === 'special' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
             >
               <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Attention
             </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {activeTab === 'general' && (
            <>
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

                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={settings.autoReconnect ?? false}
                      onChange={(e) => updateField('autoReconnect', e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Auto Reconnect</span>
                      <span className="text-xs opacity-60">Automatically try to rejoin if disconnected. Adds 'A' to nick if taken.</span>
                    </div>
                </label>
                </div>
              </section>

              {/* Services / APIs */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 opacity-90">
                  <ImageIcon className="w-5 h-5" /> External APIs
                </h3>
                
                {/* Image Host Selection */}
                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium opacity-80">Default Image Host</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => updateField('imageHost', 'imgbb')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${settings.imageHost === 'imgbb' ? 'bg-blue-600/20 border-blue-500' : `border-transparent hover:bg-white/5`}`}
                    >
                      {settings.imageHost === 'imgbb' && <Check className="w-4 h-4 text-blue-500" />} ImgBB
                    </button>
                    <button 
                      onClick={() => updateField('imageHost', 'gyazo')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${settings.imageHost === 'gyazo' ? 'bg-blue-600/20 border-blue-500' : `border-transparent hover:bg-white/5`}`}
                    >
                      {settings.imageHost === 'gyazo' && <Check className="w-4 h-4 text-blue-500" />} Gyazo
                    </button>
                  </div>
                </div>

                {/* ImgBB API Key - Only show if selected */}
                {settings.imageHost === 'imgbb' && (
                  <div className="space-y-2 mb-4 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium opacity-80">ImgBB API Key</label>
                    <p className="text-xs opacity-60 mb-1">Get key from <a href="https://api.imgbb.com/" target="_blank" rel="noreferrer" className="text-blue-500 underline">api.imgbb.com</a></p>
                    <input
                      type="text"
                      value={settings.imgbbApiKey}
                      onChange={(e) => updateField('imgbbApiKey', e.target.value)}
                      placeholder="e.g. 4a8b..."
                      className={`w-full px-4 py-2 rounded-lg ${activeTheme.inputBg} ${activeTheme.inputFg} border ${activeTheme.border} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    />
                  </div>
                )}

                {/* Gyazo API Key - Only show if selected */}
                {settings.imageHost === 'gyazo' && (
                  <div className="space-y-2 mb-4 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium opacity-80">Gyazo Access Token</label>
                    <p className="text-xs opacity-60 mb-1">Get token from <a href="https://gyazo.com/api" target="_blank" rel="noreferrer" className="text-blue-500 underline">gyazo.com/api</a></p>
                    <input
                      type="text"
                      value={settings.gyazoAccessToken || ''}
                      onChange={(e) => updateField('gyazoAccessToken', e.target.value)}
                      placeholder="e.g. Your access token"
                      className={`w-full px-4 py-2 rounded-lg ${activeTheme.inputBg} ${activeTheme.inputFg} border ${activeTheme.border} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    />
                  </div>
                )}

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
            </>
          )}

          {/* Special Users Tab */}
          {activeTab === 'special' && (
            <section>
              <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm">
                <p className="flex items-center gap-2 font-bold mb-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Special Attention
                </p>
                <p className="opacity-80">
                  Add users or tripcodes to your watch list. They will have a unique notification sound and colored message bubbles.
                </p>
              </div>

              {/* Add Form */}
              <div className={`p-5 rounded-xl border ${activeTheme.border} bg-white/5 mb-6`}>
                <h4 className="font-medium mb-4 opacity-90">Add New Watch Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider opacity-60 mb-1 block">Nickname</label>
                    <input
                      type="text"
                      value={newSpecialNick}
                      onChange={(e) => setNewSpecialNick(e.target.value)}
                      placeholder="e.g. Alice"
                      className={`w-full px-3 py-2 rounded border ${activeTheme.border} ${activeTheme.inputBg} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider opacity-60 mb-1 block">Tripcode (Optional)</label>
                    <input
                      type="text"
                      value={newSpecialTrip}
                      onChange={(e) => setNewSpecialTrip(e.target.value)}
                      placeholder="e.g. XyZ123"
                      className={`w-full px-3 py-2 rounded border ${activeTheme.border} ${activeTheme.inputBg} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider opacity-60 mb-1 block">Suffix Label (Optional)</label>
                    <input
                      type="text"
                      value={newSpecialLabel}
                      onChange={(e) => setNewSpecialLabel(e.target.value)}
                      placeholder="e.g. [Admin]"
                      className={`w-full px-3 py-2 rounded border ${activeTheme.border} ${activeTheme.inputBg} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider opacity-60 mb-1 block">Color</label>
                    <div className="flex gap-3 pt-2">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewSpecialColor(color)}
                          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${newSpecialColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={addSpecialUser}
                  disabled={!newSpecialNick && !newSpecialTrip}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add to Watchlist
                </button>
              </div>

              {/* List */}
              <h4 className="font-medium mb-3 opacity-80">Watchlist ({settings.specialUsers.length})</h4>
              {settings.specialUsers.length === 0 ? (
                <p className="text-sm opacity-50 italic p-4 text-center border border-dashed border-gray-500 rounded-lg">No special users added yet.</p>
              ) : (
                <div className="grid gap-3">
                  {settings.specialUsers.map(user => (
                    <div key={user.id} className={`flex items-center justify-between p-3 rounded-lg border ${activeTheme.border} bg-white/5`}>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: user.color }} />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">
                            {user.nick || <span className="italic opacity-50">Any Nick</span>}
                            {user.label && <span className="ml-2 opacity-60 text-xs font-normal bg-white/10 px-1.5 rounded">{user.label}</span>}
                          </span>
                          {user.trip && <span className="text-xs font-mono opacity-50">{user.trip}</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeSpecialUser(user.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${activeTheme.border} flex justify-end shrink-0`}>
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