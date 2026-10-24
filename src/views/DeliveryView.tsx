import React, { useState, useMemo } from 'react';
import {
  Truck,
  Clock,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  PhoneCall,
  ArrowLeft,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { LOCAL_7DAY_DELIVERY_ROUTES, LocalRouteItem } from '../data/constants';

interface Props {
  onGoBack?: () => void;
}

export const DeliveryView: React.FC<Props> = ({ onGoBack }) => {
  const [postcode, setPostcode] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Directory filter state
  const [dirSearch, setDirSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = useMemo(() => {
    const list = Array.from(new Set(LOCAL_7DAY_DELIVERY_ROUTES.map(r => r.region)));
    return ['All', ...list];
  }, []);

  const filteredRoutes = useMemo(() => {
    return LOCAL_7DAY_DELIVERY_ROUTES.filter(item => {
      const matchRegion = selectedRegion === 'All' || item.region === selectedRegion;
      const q = dirSearch.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.city.toLowerCase().includes(q) ||
        item.prefix.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q);
      return matchRegion && matchQuery;
    });
  }, [dirSearch, selectedRegion]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) {
      setError('Please enter a UK postcode or city');
      return;
    }
    setError('');
    setLoading(true);

    // Check if input matches city directly in local routes
    const cleanInput = postcode.trim().toLowerCase();
    const cityMatch = LOCAL_7DAY_DELIVERY_ROUTES.find(
      r => r.city.toLowerCase() === cleanInput || cleanInput.includes(r.city.toLowerCase())
    );

    const queryPostcode = cityMatch ? cityMatch.prefix : postcode.trim();

    try {
      const data = await api.checkPostcode(queryPostcode);
      if (cityMatch && (!data.city || data.city === '')) {
        data.city = cityMatch.city;
      }
      setResult(data);
    } catch {
      setError('Unable to check delivery route right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRouteFromDirectory = (route: LocalRouteItem) => {
    setPostcode(route.prefix);
    window.scrollTo({ top: 120, behavior: 'smooth' });
    api.checkPostcode(route.prefix).then(data => {
      data.city = route.city;
      setResult(data);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-10 space-y-8 sm:space-y-12 pb-20 sm:pb-12">
      {/* Universal Step Back Navigation */}
      {onGoBack && (
        <div>
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3.5 py-2 rounded-xl hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
            title="Go Back One Step"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>← Back to Previous Screen</span>
          </button>
        </div>
      )}

      {/* 1. HERO BANNER: OUR LOCAL SIDES & 7 DAYS EVERYDAY DELIVERY */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#2A2420] to-[#1C1917] text-white p-6 sm:p-12 border border-[#3E3832] shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#DFC186] border border-[#C5A059]/40 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#DFC186]" />
            <span>Our Local Sides • 7 Days Delivery Routes</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            EVERYDAY 7-Day Delivery Routes Across Our Local Sides
          </h1>

          <div className="bg-[#C5A059]/20 border border-[#C5A059]/60 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
              <Clock className="w-4 h-4 text-[#DFC186]" />
              <span>Next Day Deliveries — Orders Till 7:00 PM</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              You can send orders for next-day delivery till <strong>7:00 PM</strong> everyday. We operate dedicated 7-day vans covering Wakefield, Sheffield, Manchester, Birmingham, Leeds, Bradford, Newcastle, Liverpool, and surrounding local sides.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-400">
            Also delivering nationwide across England, Scotland (including Glasgow metro), and Wales.
          </p>
        </div>
      </div>

      {/* 2. INTERACTIVE POSTCODE & CITY CHECKER */}
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-lg space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917]">
            Check Your Postcode or City
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Type your UK postcode (e.g. <span className="font-mono font-bold text-[#1C1917]">WF1</span>, <span className="font-mono font-bold text-[#1C1917]">S1</span>, <span className="font-mono font-bold text-[#1C1917]">M1</span>, <span className="font-mono font-bold text-[#1C1917]">B1</span>, <span className="font-mono font-bold text-[#1C1917]">LU1</span>, <span className="font-mono font-bold text-[#1C1917]">MK9</span>) or city name (e.g. Wakefield, Manchester, Sheffield).
          </p>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={postcode}
              onChange={e => {
                setPostcode(e.target.value);
                setError('');
              }}
              placeholder="e.g. WF, S, DN, DE, M, B, LU, MK, G1, CF..."
              className="w-full bg-[#FAF8F5] border border-[#DCD7CD] focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50 active:scale-95 shrink-0"
          >
            {loading ? 'Checking Route...' : 'Check Delivery Route'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="p-5 bg-[#FAF8F5] border-2 border-[#C5A059]/40 rounded-2xl space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7E2DA]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm sm:text-base text-stone-900 bg-white border border-[#DCD7CD] px-3 py-1 rounded-lg">
                  {result.postcode}
                </span>
                {result.city && (
                  <span className="font-serif font-bold text-sm text-[#1C1917]">
                    {result.city}
                  </span>
                )}
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{result.status}</span>
              </span>
            </div>

            {/* Local 7-Day Route Badge */}
            {result.isLocal7Day && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>⭐ OUR LOCAL SIDES — 7 DAYS DELIVERY ROUTE (EVERYDAY)</span>
                </div>
                <p className="text-emerald-800/90 font-medium">
                  Next day deliveries till <strong>7:00 PM</strong>: You can send orders for next-day delivery everyday on this route!
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#E7E2DA]">
                <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Region / Route</span>
                <span className="font-semibold text-stone-800 text-xs sm:text-sm">{result.region}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E7E2DA]">
                <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Estimated Transit</span>
                <span className="font-bold text-[#A88440] text-xs sm:text-sm">{result.estimatedDays}</span>
              </div>
            </div>

            {result.notes && (
              <p className="text-xs text-stone-600 italic bg-white p-3 rounded-xl border border-[#E7E2DA]">
                {result.notes}
              </p>
            )}

            {/* Direct WhatsApp Inquiry for this route */}
            <div className="pt-2">
              <a
                href={`https://wa.me/447576531552?text=Hello%20AMD%20Furniture,%20I%20am%20checking%20delivery%20for%20postcode%20${result.postcode}%20(${result.city || result.region}).%20Please%20confirm%20my%20delivery%20schedule.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Delivery on WhatsApp (+44 7576 531552)</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 3. COMPLETE DIRECTORY OF OUR LOCAL SIDES (49 LOCATIONS) */}
      <section className="space-y-4">
        <div className="bg-[#FAF8F5] border border-[#E7E2DA] p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88440] uppercase tracking-wider mb-1">
                <Truck className="w-3.5 h-3.5" />
                <span>7 Days Delivery Routes (EVERYDAY)</span>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#1C1917]">
                Our Local Sides Delivery Directory
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Orders sent till <strong>7:00 PM</strong> qualify for next-day arrival across all 49 destinations below.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-700 bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-xl self-start sm:self-auto">
              {filteredRoutes.length} Locations
            </span>
          </div>

          {/* Search & Region Filters */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={dirSearch}
                onChange={e => setDirSearch(e.target.value)}
                placeholder="Search city or prefix (e.g. Wakefield, WF, Manchester, Luton, MK)..."
                className="w-full bg-white border border-[#DCD7CD] focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium outline-hidden"
              />
            </div>

            {/* Region pills scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`text-[11px] font-bold px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                    selectedRegion === r
                      ? 'bg-[#1C1917] text-white shadow-2xs'
                      : 'bg-white text-stone-700 border border-[#DCD7CD] hover:border-[#C5A059]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards Grid (2-cols on mobile, 3-cols on tablet, 4-cols on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-2">
            {filteredRoutes.map((item, idx) => (
              <div
                key={`${item.city}-${item.prefix}-${idx}`}
                onClick={() => handleSelectRouteFromDirectory(item)}
                className="bg-white hover:bg-stone-50 border border-[#E7E2DA] hover:border-[#C5A059] p-3 sm:p-4 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] group-hover:text-[#A88440] transition-colors leading-tight">
                    {item.city}
                  </h4>
                  <span className="bg-[#1C1917] text-white font-mono font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-2xs shrink-0">
                    {item.prefix}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 font-medium truncate mb-2">
                  {item.region}
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-[#F0EBE3]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    7 Days Everyday
                  </span>
                  <span className="text-stone-400 group-hover:text-[#A88440] font-semibold text-[10px]">
                    Check →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredRoutes.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl text-stone-500 text-xs">
              No routes found matching "{dirSearch}". Try searching for another city or postcode prefix.
            </div>
          )}
        </div>
      </section>

      {/* 4. THREE PILLARS OF AMD FURNITURE DELIVERY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#C5A059]">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#1C1917]">
            7-Day Everyday Van Routes
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our local sides receive daily 7-day scheduled logistics. Send your order details by <strong>7:00 PM</strong> for next-day dispatch.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#C5A059]">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#1C1917]">
            Driver Calls 1 Hour Before
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            On your scheduled day, the driver calls approximately 60 minutes prior to arrival so you have ample notice to prepare hallway access.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#C5A059]">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#1C1917]">
            Nationwide Reach (UK-Wide)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            In addition to our local 7-day sides, we service Glasgow metro, Edinburgh, Wales, and England with regular weekly runs.
          </p>
        </div>
      </div>

      {/* 5. ADVANCE DELIVERY BOOKING CALLOUT */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E7E2DA] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <Calendar className="w-4 h-4" />
            <span>Need Delivery on a Specific Date?</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
            Advance Delivery Booking Available
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Moving home or renovating? You can book your delivery for a convenient future date directly with our logistics coordinator on WhatsApp.
          </p>
        </div>

        <a
          href="https://wa.me/447576531552?text=Hello%20AMD%20Furniture,%20I%20would%20like%20to%20arrange%20an%20advance%20delivery%20booking%20for%20a%20future%20date."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Book Delivery Date on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
