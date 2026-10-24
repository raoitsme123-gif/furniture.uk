import React from 'react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings | null;
}

export const AnnouncementBar: React.FC<Props> = ({ settings }) => {
  if (settings && !settings.announcementEnabled) {
    return null;
  }

  const text =
    settings?.announcementText ||
    'AMD Furniture UK | 7 Days Delivery Routes (EVERYDAY) | Next day deliveries till 7:00 PM you can send orders for next day | Covering Wakefield, Sheffield, Manchester, Birmingham, Leeds, Newcastle & UK-wide';

  return (
    <div className="bg-[#1C1917] border-b border-[#C5A059]/40 text-[#FAF8F5] text-[11px] sm:text-xs py-1.5 px-3 overflow-hidden relative z-50">
      <div className="flex items-center">
        {/* Continuous marquee track */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative">
          <div className="animate-marquee flex items-center space-x-12 select-none">
            <span className="inline-flex items-center text-[#E8D7B8] font-medium tracking-wide">
              {text}
            </span>
            <span className="text-[#C5A059] font-serif text-sm">✦</span>
            <span className="inline-flex items-center text-[#FAF8F5] font-medium tracking-wide">
              {text}
            </span>
            <span className="text-[#C5A059] font-serif text-sm">✦</span>
            <span className="inline-flex items-center text-[#E8D7B8] font-medium tracking-wide">
              {text}
            </span>
            <span className="text-[#C5A059] font-serif text-sm">✦</span>
          </div>
        </div>
      </div>
    </div>
  );
};
