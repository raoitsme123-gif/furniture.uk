import React, { useState } from 'react';
import { Download, Smartphone, X, Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed in standalone mode, don't show
  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General instructions modal if browser doesn't expose prompt
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 rounded-lg font-bold transition-all shadow-2xs active:scale-95 ${
          compact
            ? 'bg-[#C5A059] hover:bg-[#A88440] text-[#1C1917] px-2.5 py-1.5 text-[11px]'
            : 'bg-[#1C1917] hover:bg-[#2C2825] text-[#E8D7B8] border border-[#C5A059]/40 px-3 py-1.5 text-xs'
        }`}
        title="Download & Install AMD Furniture UK App"
        aria-label="Download and install application"
      >
        <Download className="w-3.5 h-3.5 text-[#C5A059]" />
        <span>Download App</span>
      </button>

      {/* iOS & Manual Installation Sheet */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#E7E2DA] space-y-4 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1C1917] flex items-center justify-center text-[#E8D7B8] font-serif font-bold text-xl border border-[#C5A059]">
                AMD
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#1C1917]">
                  Install AMD Furniture
                </h3>
                <p className="text-xs text-stone-500">Fast 120Hz browsing, offline quotes & instant orders</p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#E7E2DA] space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-stone-700">
                  Tap the <strong className="inline-flex items-center gap-1 font-semibold text-[#1C1917]"><Share className="w-3.5 h-3.5 text-[#C5A059]" /> Share</strong> icon in your mobile browser bar.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-stone-700">
                  Scroll down and tap <strong className="inline-flex items-center gap-1 font-semibold text-[#1C1917]"><PlusSquare className="w-3.5 h-3.5 text-[#C5A059]" /> Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-stone-700">
                  Tap <strong className="text-[#1C1917]">Add</strong> to launch AMD Furniture directly from your phone home screen!
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> No App Store login needed
              </span>
              <button
                onClick={() => setShowIOSModal(false)}
                className="font-bold text-[#A88440] hover:underline"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
