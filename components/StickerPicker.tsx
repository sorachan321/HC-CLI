
import React, { useState } from 'react';
import { Search, Smile, Box, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AppSettings } from '../types';
import { THEMES } from '../constants';

interface StickerPickerProps {
  settings: AppSettings;
  onSelect: (content: string) => void;
  onClose: () => void;
}

// Popular Emojis grouped by vague sentiment
const EMOJI_GROUPS = [
  ['😀','😂','😉','🥰','😎','🤔','😐','😭','😡','🤯','😴','🤡'],
  ['👍','👎','👋','🙏','💪','🤝','👀','❤️','🔥','✨','🎉','💩'],
  ['🐱','🐶','🐸','🐵','🚀','💻','📱','💡','⚡','🛑','✅','❌']
];

// Classic Hacker/Internet Kaomojis
const KAOMOJIS = [
  '(╯°□°）╯︵ ┻━┻', '┬─┬ノ( º _ ºノ)', '¯\\_(ツ)_/¯', 'UwU', 'OwO', 
  '( ͡° ͜ʖ ͡°)', 'ಠ_ಠ', '(>_<)', '^_^', '(=^･ω･^=)',
  'ʕ•ᴥ•ʔ', '(⌐■_■)', '(ToT)', '(* ^ ω ^)', '( ˙꒳​˙ )'
];

const StickerPicker: React.FC<StickerPickerProps> = ({ settings, onSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'kaomoji' | 'gif'>('emoji');
  const [gifSearch, setGifSearch] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const theme = THEMES[settings.theme];

  const searchTenor = async (query: string) => {
    if (!settings.tenorApiKey) return;
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${settings.tenorApiKey}&limit=12&media_filter=tinygif,gif`);
      const data = await response.json();
      if (data.results) {
        setGifs(data.results);
      }
    } catch (error) {
      console.error("Tenor fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGifSelect = (url: string) => {
    onSelect(`![](${url})`);
  };

  return (
    <div className={`absolute bottom-full mb-2 left-0 w-72 h-80 flex flex-col rounded-xl shadow-2xl border ${theme.border} ${theme.sidebarBg} ${theme.fg} overflow-hidden animate-in fade-in zoom-in-95 z-50`}>
      
      {/* Tabs */}
      <div className={`flex border-b ${theme.border}`}>
        <button 
          onClick={() => setActiveTab('emoji')}
          className={`flex-1 py-2 text-xs font-medium hover:bg-white/5 ${activeTab === 'emoji' ? 'text-blue-500 border-b-2 border-blue-500' : 'opacity-60'}`}
        >
          Emoji
        </button>
        <button 
          onClick={() => setActiveTab('kaomoji')}
          className={`flex-1 py-2 text-xs font-medium hover:bg-white/5 ${activeTab === 'kaomoji' ? 'text-blue-500 border-b-2 border-blue-500' : 'opacity-60'}`}
        >
          Kaomoji
        </button>
        <button 
          onClick={() => setActiveTab('gif')}
          className={`flex-1 py-2 text-xs font-medium hover:bg-white/5 ${activeTab === 'gif' ? 'text-blue-500 border-b-2 border-blue-500' : 'opacity-60'}`}
        >
          GIFs
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        
        {/* Emoji Tab */}
        {activeTab === 'emoji' && (
          <div className="space-y-2">
            {EMOJI_GROUPS.map((group, i) => (
              <div key={i} className="grid grid-cols-6 gap-1">
                {group.map(char => (
                  <button 
                    key={char} 
                    onClick={() => onSelect(char)}
                    className="text-xl p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Kaomoji Tab */}
        {activeTab === 'kaomoji' && (
          <div className="grid grid-cols-2 gap-2">
            {KAOMOJIS.map(k => (
              <button 
                key={k} 
                onClick={() => onSelect(k)}
                className={`text-xs p-2 rounded border border-transparent hover:border-white/10 hover:bg-white/5 truncate ${theme.inputBg}`}
              >
                {k}
              </button>
            ))}
          </div>
        )}

        {/* GIF Tab */}
        {activeTab === 'gif' && (
          <div className="h-full flex flex-col">
            {!settings.tenorApiKey ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 p-4">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">Tenor API Key required.</p>
                <p className="text-[10px] mt-1">Set it in Settings to search GIFs.</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text"
                    value={gifSearch}
                    onChange={(e) => setGifSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchTenor(gifSearch)}
                    placeholder="Search Tenor..."
                    className={`flex-1 px-2 py-1 text-sm rounded border ${theme.border} ${theme.inputBg} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  <button 
                    onClick={() => searchTenor(gifSearch)}
                    className="p-1 bg-blue-600 rounded text-white"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin opacity-50" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {gifs.map((gif) => (
                      <button 
                        key={gif.id} 
                        onClick={() => handleGifSelect(gif.media_formats.tinygif.url)}
                        className="relative aspect-video overflow-hidden rounded bg-black/20 hover:ring-2 ring-blue-500 transition-all"
                      >
                        <img 
                          src={gif.media_formats.tinygif.url} 
                          alt={gif.content_description}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickerPicker;
