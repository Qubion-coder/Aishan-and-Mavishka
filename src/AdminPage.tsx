import React, { useState } from 'react';

export default function AdminPage() {
  const [prefix, setPrefix] = useState('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleGenerate = () => {
    if (!guestName.trim()) {
      alert("Please enter a guest name.");
      return;
    }
    
    // Get the base URL without any path or query string, and remove /admin if present
    const baseUrl = window.location.origin + window.location.pathname.replace('/admin', '');
    
    // Construct the link with query parameters
    const params = new URLSearchParams();
    if (prefix) params.append('prefix', prefix);
    params.append('guest', guestName.trim());
    
    const link = `${baseUrl}?${params.toString()}`;
    setGeneratedLink(link);
    setCopiedLink(false);
    setCopiedMessage(false);
  };

  const getMessageTemplate = () => {
    return `Dear ${prefix} ${guestName} ❤️\n\nWith joyful hearts, we warmly invite you and your family to celebrate one of the most special days of our lives as we begin our journey together.\n\nPlease view our wedding invitation and all the event details through the link below 🌐:\n\n${generatedLink}\n\nYour presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.\n\nWith love,\n❤️ Aishan & Mavishka`;
  };

  const copyToClipboard = async (text: string, type: 'link' | 'message') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      }
    } catch (err) {
      alert("Failed to copy text. Please copy manually.");
    }
  };

  return (
    <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden smooth-mobile-scroll bg-stone-50 flex flex-col items-center py-12 px-4 font-montserrat">
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-stone-200">
        <h1 className="text-3xl font-playball text-stone-800 text-center mb-8">Invitation Link Generator</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Prefix</label>
            <select 
              value={prefix} 
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-stone-800 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all appearance-none cursor-pointer"
            >
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Mr. & Mrs.">Mr. & Mrs.</option>
              <option value="Family">Family</option>
              <option value="Dear">Dear</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Guest Name</label>
            <input 
              type="text" 
              value={guestName} 
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Sanjaya"
              className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all"
            />
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-900 hover:shadow-lg transition-all"
          >
            Generate Link
          </button>
        </div>

        {generatedLink && (
          <div className="mt-10 pt-8 border-t border-stone-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Generated Link</label>
              <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <input 
                  type="text" 
                  readOnly 
                  value={generatedLink} 
                  className="flex-1 bg-transparent text-sm text-stone-600 outline-none truncate"
                />
                <button 
                  onClick={() => copyToClipboard(generatedLink, 'link')}
                  className="shrink-0 bg-stone-200 text-stone-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-300 transition-colors"
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Message Template</label>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                {getMessageTemplate()}
              </div>
              <button 
                onClick={() => copyToClipboard(getMessageTemplate(), 'message')}
                className="w-full bg-stone-200 text-stone-700 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-300 transition-colors"
              >
                {copiedMessage ? 'Copied Full Message!' : 'Copy Full Message'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
