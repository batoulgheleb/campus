import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bell, 
  ShoppingCart, 
  Plus, 
  ChevronRight, 
  Camera, 
  MapPin, 
  Truck, 
  Layers, 
  Sparkle,
  Search,
  ChevronDown,
  Info,
  Package,
  Heart, 
  Share2,
  ShieldCheck,
  ChevronLeft,
  PlusCircle,
  BadgeCheck,
  ChevronRight as ChevronSmall,
  ArrowLeft,
  Check,
  ChevronUp,
  HandCoins
} from 'lucide-react';

/**
 * CampusSwap - Product Detail with Integrated Discovery
 * - Refinement: Changed "Message Seller" button border to thin (1px) for a cleaner aesthetic.
 * - Restored: Small legal disclaimer text below buttons.
 * - Restored: Description and Special Bundle sections.
 * - Expansion: "View all" expands carousel to grid on same page.
 * - Navigation: Glassmorphism arrows and Back to Top button.
 */

// --- Helpers ---
const getConditionStyles = (condition) => {
  const c = condition.toLowerCase();
  if (c === 'like new') return { bg: 'bg-[#D1E9FF]', text: 'text-[#1B4B8A]' };
  if (c === 'brand new' || c === 'new') return { bg: 'bg-[#C8F0EF]', text: 'text-[#1A6B6A]' };
  if (c === 'satisfactory') return { bg: 'bg-[#FFE2C8]', text: 'text-[#8A4A1B]' };
  return { bg: 'bg-[#E5E7EB]', text: 'text-[#4B5563]' };
};

const generateSimilarData = (count, startId = 0) => {
  const conditions = ["Used", "Like New", "New", "Satisfactory"];
  return Array.from({ length: count }).map((_, i) => ({
    id: startId + i + 100,
    title: ["Retro Hoodie", "Vintage Levi's", "Work Jacket", "Canvas Tote", "Denim Shirt"][Math.floor(Math.random() * 5)],
    price: (Math.floor(Math.random() * 50) + 20).toString(),
    likes: Math.floor(Math.random() * 50) + 5,
    saved: false,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    img: `https://picsum.photos/seed/${startId + i + 50}/600/800`
  }));
};

// --- Sub-components ---
const ListingCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="relative pb-4">
      <div className="aspect-[4/5] bg-zinc-200 rounded-2xl w-full" />
    </div>
    <div className="mt-1 space-y-2 px-1">
      <div className="flex justify-between items-center gap-4">
        <div className="h-4 bg-zinc-200 rounded-md w-3/5" />
        <div className="h-4 bg-zinc-200 rounded-md w-10" />
      </div>
      <div className="h-3 bg-zinc-100 rounded-md w-2/5" />
    </div>
  </div>
);

const App = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  // Discovery State
  const [isExpanded, setIsExpanded] = useState(false);
  const [items, setItems] = useState(generateSimilarData(8));
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // FAB State
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const observerTarget = useRef(null);

  const listing = {
    title: "Vintage Carhartt Jacket",
    price: "65.00",
    baseLikes: 24,
    description: "Authentic vintage Detroit jacket in the rare moss green colorway. Beautiful natural fading but no rips or major stains. Quilt-lined for winter warmth. Fits slightly oversized as per vintage specs.",
    bundleInfo: "Part of a 'Winter Essentials' bundle. Buy together with Carhartt beanie to save 15%.",
    seller: {
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 4.9,
      reviews: 12,
      university: "University of Warwick"
    },
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1467043237213-65f2da53396f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31d85?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Clothing & Shoes"
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleViewAll = () => {
    if (isExpanded) return;
    setIsExpanded(true);
    setIsInitialLoading(true);
    setTimeout(() => {
      setItems(generateSimilarData(12));
      setIsInitialLoading(false);
    }, 1000);
  };

  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || items.length >= 40 || !isExpanded) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const nextBatch = generateSimilarData(8, items.length);
      setItems(prev => [...prev, ...nextBatch]);
      setIsLoadingMore(false);
      if (items.length + 8 >= 40) setHasMore(false);
    }, 800);
  }, [isLoadingMore, items.length, isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && hasMore) loadMoreItems(); },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isExpanded, loadMoreItems, hasMore]);

  const toggleItemLike = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextSaved = !item.saved;
        return { ...item, saved: nextSaved, likes: nextSaved ? item.likes + 1 : item.likes - 1 };
      }
      return item;
    }));
  };

  const appleFontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-100 selection:text-blue-700 font-inter">
      
      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-10 right-10 w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center z-40 transition-all duration-500 hover:scale-110 active:scale-90 ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        <ChevronUp size={24} className="text-zinc-900" />
      </button>

      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-200/30">
        <div className="flex items-center justify-between px-6 py-3 w-full max-w-[1440px] mx-auto relative z-50">
          <div className="flex items-center gap-8 font-inter font-inter">
            <a className="text-xl font-black tracking-tighter text-zinc-900 cursor-pointer font-inter" href="#">CS</a>
            <nav className="hidden md:flex items-center gap-6">
              <a className="font-semibold text-sm tracking-tight cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors font-inter">Browse</a>
              <a className="text-zinc-400 font-medium hover:text-zinc-800 transition-colors text-sm tracking-tight cursor-pointer font-inter">Bundles</a>
            </nav>
          </div>
          
          <div className="flex-1 max-w-2xl px-8 hidden sm:block relative font-inter">
            <div className="relative group font-inter">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                className="w-full h-11 pl-12 pr-4 bg-zinc-100/80 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-zinc-400 font-inter" 
                placeholder="Search campus..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-zinc-500 font-inter font-inter">
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all font-inter font-inter font-inter font-inter"><Bell size={22} strokeWidth={1.5} /></button>
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all font-inter font-inter font-inter font-inter font-inter"><ShoppingCart size={22} strokeWidth={1.5} /></button>
            </div>
            <button className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white border border-zinc-200 text-zinc-900 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all hover:bg-zinc-50 font-inter font-inter font-inter font-inter">
              Sell <Plus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 ml-2 cursor-pointer font-inter font-inter font-inter">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 font-inter font-inter font-inter">
        <div className="max-w-[1440px] mx-auto px-6 font-inter font-inter">
          
          {/* Utility Bar */}
          <div className="flex items-center justify-between py-5 border-b border-zinc-200/50 mb-8 font-inter font-inter font-inter font-inter">
             <div className="flex items-center gap-4 text-[13px] font-medium text-zinc-400 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <button className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
                   <ChevronLeft size={16} /> Back to Browse
                </button>
                <span className="text-zinc-200 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">|</span>
                <span className="font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Listed in {listing.category}</span>
             </div>
             <div className="flex items-center gap-6 font-inter font-inter">
                <button onClick={() => setIsSaved(!isSaved)} className="flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors font-inter font-inter font-inter font-inter">
                   <Heart size={16} className={isSaved ? "fill-rose-500 text-rose-500 font-inter font-inter font-inter" : "font-inter font-inter font-inter font-inter"} /> {isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors font-inter font-inter font-inter font-inter font-inter font-inter">
                   <Share2 size={16} /> Share
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative font-inter font-inter font-inter">
            
            {/* Left Column: Image Gallery (Sticky) */}
            <div className="lg:col-span-8 space-y-6 lg:sticky lg:top-24 h-fit font-inter font-inter font-inter font-inter font-inter">
              <div className="aspect-[16/10] bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200/50 relative group font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                 <img src={listing.images[activeImage]} alt="Main product" className="w-full h-full object-cover animate-in fade-in duration-700 font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
                 
                 {/* Navigation Arrows */}
                 <button 
                   onClick={prevImage}
                   className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center transition-all hover:bg-white active:scale-95 z-20 group-hover:opacity-100 opacity-0 hidden md:flex font-inter font-inter font-inter font-inter font-inter font-inter"
                 >
                    <ChevronLeft size={20} className="text-zinc-900" />
                 </button>
                 <button 
                   onClick={nextImage}
                   className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center transition-all hover:bg-white active:scale-95 z-20 group-hover:opacity-100 opacity-0 hidden md:flex font-inter font-inter font-inter font-inter font-inter font-inter"
                 >
                    <ChevronRight size={20} className="text-zinc-900 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
                 </button>

                 <div className="absolute bottom-4 right-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSaved(!isSaved);
                      }}
                      className="bg-white/90 backdrop-blur-sm px-3.5 py-2.5 rounded-full shadow-md flex items-center gap-2.5 hover:bg-white transition-all active:scale-95 border border-zinc-200/50 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter"
                    >
                       <span className="text-[13px] font-bold text-zinc-900 leading-none tracking-tight font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                          {isSaved ? listing.baseLikes + 1 : listing.baseLikes}
                       </span>
                       <Heart 
                         size={18} 
                         className={`transition-colors duration-300 ${isSaved ? "fill-rose-500 text-rose-500 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" : "text-zinc-900 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter"}`} 
                       />
                    </button>
                 </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 font-inter font-inter font-inter font-inter font-inter font-inter">
                 {listing.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? 'border-[#0071e3]' : 'border-transparent hover:border-zinc-200'}`}
                    >
                       <img src={img} className="w-full h-full object-cover font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" alt="Thumb" />
                    </button>
                 ))}
              </div>

              {/* Badges Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                   <ShieldCheck className="text-[#0071e3] mb-2.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" size={22} />
                   <p className="font-bold text-[14px] font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Student Purchase Protection</p>
                   <p className="text-[12.5px] text-zinc-500 mt-1.5 leading-relaxed font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                     Verified swaps only. Your payment is held securely. <button className="text-[#0071e3] underline font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">See more in our refund policy</button>
                   </p>
                </div>
                <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                   <Layers className="text-[#0071e3] mb-2.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" size={22} />
                   <p className="font-bold text-[14px] font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Sustainability Credits</p>
                   <p className="text-[12.5px] text-zinc-500 mt-1.5 leading-relaxed font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Trading on campus reduces courier carbon by 100%. Earn credits for local pickups.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Buying Interface */}
            <div className="lg:col-span-4 space-y-10 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
              
              <div className="flex flex-col justify-start items-start gap-2.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                 <h1 style={{ fontFamily: appleFontStack }} className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{listing.title}</h1>
                 <p style={{ fontFamily: appleFontStack }} className="text-[19px] font-medium text-zinc-900 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">£{listing.price}</p>
                 <div className="flex items-center gap-2 pt-0.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    <Sparkle className="text-zinc-400 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" size={14} />
                    <span className="text-[11.5px] font-medium text-zinc-500 italic font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Campus Intelligence — <button className="text-blue-600 hover:underline not-italic font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Learn more ⊕</button></span>
                 </div>
              </div>

              {/* Seller Information */}
              <div className="space-y-3 font-inter font-inter font-inter font-inter font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Seller info</h2>
                <div className="flex items-start justify-between cursor-pointer group px-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                   <div className="flex items-center gap-4 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-200 shadow-sm font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                         <img src={listing.seller.avatar} alt="Seller" className="w-full h-full object-cover font-inter font-inter font-inter font-inter font-inter" />
                      </div>
                      <div className="space-y-0.5 font-inter font-inter font-inter font-inter">
                         <p className="text-[15px] font-bold group-hover:text-[#0071e3] transition-colors font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{listing.seller.name}</p>
                         <div className="flex flex-col font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                            <p className="text-[12px] text-zinc-500 font-medium font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">★ {listing.seller.rating} • {listing.seller.reviews} reviews</p>
                            <div className="flex items-center gap-1 mt-0.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                               <BadgeCheck size={13} className="text-blue-500 font-inter font-inter font-inter font-inter font-inter font-inter" />
                               <p className="text-[12px] text-zinc-500 font-medium font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                                 <span className="text-blue-600 font-bold font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Verified</span> — {listing.seller.university}
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-zinc-300 mt-3 group-hover:text-zinc-500 transition-colors font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
                </div>
              </div>

              {/* Specifications */}
              <section className="font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 mb-1.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Specifications</h2>
                <hr className="border-t border-zinc-200 mb-6 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
                <ul className="space-y-4 px-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                   {[
                     { label: "Condition", value: "Like New" },
                     { label: "Size", value: "Large (L)" },
                     { label: "Material", value: "Cotton Canvas" },
                     { label: "Brand", value: "Carhartt" }
                   ].map((spec, i) => (
                      <li key={i} className="flex items-center gap-3 text-[13.5px] font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                         <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
                         <div className="flex items-center gap-2 flex-wrap font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                            <span className="text-zinc-900 font-bold font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{spec.label}:</span>
                            {spec.label === "Condition" ? (
                              <span className="inline-block px-3 py-1 rounded-full border border-[#d1e0d9] bg-[#e8f3ee] text-[#3a5d4d] text-[11px] font-semibold tracking-tight font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                                {spec.value}
                              </span>
                            ) : (
                              <span className="text-zinc-600 font-medium font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{spec.value}</span>
                            )}
                         </div>
                      </li>
                   ))}
                </ul>
              </section>

              {/* Description */}
              <section className="font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 mb-1.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Description</h2>
                <hr className="border-t border-zinc-200 mb-5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
                <p className="text-[14.5px] leading-relaxed text-zinc-700 font-medium font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    {listing.description}
                </p>
              </section>

              {/* Bundles */}
              <section className="font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 mb-5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Bundles</h2>
                <div className="py-4 px-5 rounded-2xl border border-[#0071e3] bg-blue-50/5 text-left transition-colors hover:bg-blue-50/10 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                   <div className="flex items-center gap-2.5 mb-1.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                      <Layers size={17} className="text-[#0071e3] font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
                      <span className="text-[15px] font-bold text-[#0071e3] font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Special Bundle Available</span>
                   </div>
                   <p className="text-[12.5px] text-zinc-600 leading-snug font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{listing.bundleInfo}</p>
                </div>
              </section>

              {/* Delivery Options */}
              <section className="space-y-5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Delivery options</h2>
                <div className="space-y-7 px-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                  <div className="flex gap-4 items-start text-left font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    <Truck size={22} className="text-zinc-900 mt-0.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" strokeWidth={1.5} />
                    <div className="flex-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                       <p className="text-[14px] font-bold text-zinc-900 leading-none font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Delivery:</p>
                       <p className="text-[14px] text-zinc-900 mt-1.5 leading-snug font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Tracked Courier (Next Day)</p>
                       <button className="text-[12.5px] text-[#0071e3] hover:underline mt-1 block font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                          Check delivery estimates ⊕
                       </button>
                    </div>
                  </div>
                  <div className="flex gap-5 items-start text-left font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    <Package size={22} className="text-zinc-900 mt-0.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" strokeWidth={1.5} />
                    <div className="flex-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                       <p className="text-[14px] font-bold text-zinc-900 leading-none font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Pickup:</p>
                       <p className="text-[14px] text-zinc-900 mt-1.5 leading-snug font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Coventry Library Lobby</p>
                       <button className="text-[12.5px] text-[#0071e3] hover:underline mt-1 block font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                          Check swapper availability ⊕
                       </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Purchase Actions & Legal Text */}
              <div className="pt-4 space-y-3.5 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <button className="w-full py-4 rounded-2xl text-[16px] font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all transform active:scale-95 shadow-lg shadow-blue-500/10 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Buy now</button>
                
                <div className="flex gap-3">
                  {/* Make Offer button */}
                  <button className="px-5 py-4 rounded-2xl text-[#0071e3] bg-transparent border border-[#0071e3] hover:bg-blue-50 transition-all flex items-center justify-center font-inter active:scale-95" title="Make an offer">
                    <HandCoins size={20} strokeWidth={2.5} />
                  </button>
                  {/* Message Seller button with thin border */}
                  <button className="flex-1 py-4 rounded-2xl text-[16px] font-semibold text-[#0071e3] bg-transparent border border-[#0071e3] hover:bg-blue-50 transition-all font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Message Seller</button>
                </div>
                
                <div className="text-left mt-8 space-y-3.5 px-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    Consumer protection laws do not apply to your purchases from other consumers. More specifically, the right to cancel (section 29(1) of the Consumer Contracts Regulations 2013) and the right to reject (section 20 of the Consumer Rights Act) does not apply.
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    Buyer’s rights are significantly reduced when a sale is carried out between two individuals. Goods from private sellers do not have to be fault-free; if defects were mentioned or visible in photographs, you do not have a case. However, if goods do not match the description, you have the right to ask for a refund.
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-bold font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    Every purchase you make using the ‘Buy now’ button is covered by our Buyer Protection service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb section */}
          <div className="mt-24 pb-8 border-b border-zinc-200/60 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
            <div className="flex items-center gap-3 text-[13px] text-zinc-400 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
              <span className="text-zinc-900 font-bold cursor-pointer font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">CS</span>
              <ChevronSmall size={14} className="text-zinc-300 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
              <span className="text-zinc-900 font-medium cursor-pointer font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Clothing & Shoes</span>
              <ChevronSmall size={14} className="text-zinc-300 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" />
              <span className="text-zinc-900 font-medium font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{listing.title}</span>
            </div>
          </div>

          {/* Similar Items Section */}
          <section className="pt-12 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
            <div className="flex items-end justify-between mb-10 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
               <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Similar Items.</h2>
               {!isExpanded && (
                 <button onClick={handleViewAll} className="text-[14px] text-blue-600 font-medium hover:underline flex items-center gap-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                    View all <ChevronSmall size={16} className="mt-0 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" strokeWidth={2.5} />
                 </button>
               )}
            </div>
            
            {isInitialLoading ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                  {Array.from({ length: 10 }).map((_, i) => <ListingCardSkeleton key={i} />)}
               </div>
            ) : (
               <div className={`${isExpanded ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14' : 'flex gap-6 overflow-x-auto pb-12 snap-x no-scrollbar'} transition-all duration-500 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter`}>
                  {items.map((item, idx) => {
                     const cStyle = getConditionStyles(item.condition);
                     return (
                        <div key={item.id} className={`${isExpanded ? 'animate-in fade-in duration-500' : 'min-w-[240px] md:min-w-[280px] snap-start'} group cursor-pointer font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter`}>
                           <div className="relative pb-4 overflow-visible font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                              <div className="relative overflow-hidden aspect-[4/5] rounded-2xl border border-gray-100 transition-all group-hover:shadow-2xl font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                                 <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" alt={item.title} />
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); toggleItemLike(item.id); }}
                                    className="absolute top-4 right-4 px-3 h-9 rounded-full flex items-center gap-2 z-10 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter"
                                 >
                                    <span className={`text-[12px] font-bold ${item.saved ? 'text-[#FF5A5F]' : 'text-zinc-700'} font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter`}>{item.likes}</span>
                                    <Heart size={17} strokeWidth={2.5} className={item.saved ? 'fill-[#FF5A5F] text-[#FF5A5F] font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter' : 'text-[#FF5A5F] font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter'} />
                                 </button>
                                 <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight shadow-sm ${cStyle.bg} ${cStyle.text} font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter`}>{item.condition}</span>
                                 </div>
                              </div>
                              <div className="absolute bottom-0 left-5 w-14 h-14 rounded-full border-[3px] border-white overflow-hidden bg-gray-100 z-20 shadow-lg group-hover:-translate-y-1 transition-transform font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                                 <img src={`https://i.pravatar.cc/150?u=${item.id}`} className="w-full h-full object-cover font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" alt="Seller" />
                              </div>
                           </div>
                           <div className="mt-1 px-1 flex justify-between items-center font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter"><p className="text-[15px] font-bold leading-[1.2] flex-1 line-clamp-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{item.title}</p><span className="text-[15px] font-bold font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">£{item.price}</span></div>
                           <p className="text-[13px] font-semibold text-gray-400 mt-0 px-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Student Seller</p>
                        </div>
                     );
                  })}
                  {isLoadingMore && Array.from({ length: 5 }).map((_, i) => <ListingCardSkeleton key={`more-${i}`} />)}
               </div>
            )}

            {isExpanded && (
              <div ref={observerTarget} className="py-24 flex flex-col items-center gap-4 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                 {hasMore && !isInitialLoading && (
                    <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-[0.2em] animate-pulse font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">Loading more for you...</p>
                 )}
                 {!hasMore && !isInitialLoading && (
                    <div className="flex flex-col items-center gap-3 animate-in fade-in duration-1000 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                       <Check className="text-zinc-300 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter" size={24} />
                       <p className="text-[13px] text-zinc-400 font-medium font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">You've reached the end</p>
                    </div>
                 )}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-[#f5f5f7] border-t border-zinc-200/50 mt-32 font-inter font-inter font-inter font-inter font-inter">
        <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-24 text-[12px] text-zinc-500 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
            {[
              { title: "Shop", links: ["Textbooks", "Electronics", "Clothing", "Sports Gear"] },
              { title: "Account", links: ["Manage Profile", "Saved Items", "Swap History"] },
              { title: "Marketplace", links: ["List an Item", "Bundles", "Verified Swappers"] },
              { title: "Help", links: ["FAQ", "Contact Us", "Campus Rules"] },
              { title: "Swap Values", links: ["Sustainability", "Community First", "Safety"] }
            ].map((group) => (
              <div key={group.title} className="space-y-2 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                <h4 className="text-zinc-900 font-bold font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{group.title}</h4>
                <ul className="space-y-1 font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">
                  {group.links.map(l => <li key={l} className="hover:underline hover:text-zinc-900 cursor-pointer transition-colors font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter font-inter">{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Source+Code+Pro:wght@400;500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { -webkit-font-smoothing: antialiased; background-color: #f5f5f7; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}} />
    </div>
  );
};

export default App;