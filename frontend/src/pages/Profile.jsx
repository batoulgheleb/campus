import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  ShoppingCart, 
  Plus, 
  Search,
  Heart,
  BadgeCheck,
  ChevronRight,
  PlusCircle,
  ChevronUp,
  Share2,
  Settings,
  Star,
  MapPin,
  Calendar,
  Layers,
  Check,
  MoreHorizontal,
  Clock,
  Users,
  Mail,
  ShieldCheck,
  Phone,
  MessageCircle
} from 'lucide-react';

/**
 * CampusSwap - User Profile Page
 * - Identity: Username with '@' prefix; Name and Subject displayed underneath.
 * - Verification: Refined badge with a soft grey background and thin blue tick for an Apple aesthetic.
 * - Typography: Title Case headers for "About:" and "Verified Info:".
 * - Actions: Follow toggle and "Message Seller" button in signature Apple Blue.
 * - Listings: Gallery-style cards without redundant avatars or labels.
 */

// --- Helpers ---
const getConditionStyles = (condition) => {
  const c = condition.toLowerCase();
  if (c === 'like new') return { bg: 'bg-[#D1E9FF]', text: 'text-[#1B4B8A]' };
  if (c === 'brand new' || c === 'new') return { bg: 'bg-[#C8F0EF]', text: 'text-[#1A6B6A]' };
  if (c === 'satisfactory') return { bg: 'bg-[#FFE2C8]', text: 'text-[#8A4A1B]' };
  return { bg: 'bg-[#E5E7EB]', text: 'text-[#4B5563]' };
};

const App = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const user = {
    username: "mayapatel",
    fullName: "Maya Patel",
    subject: "Economics",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    university: "University of Warwick",
    joined: "September 2023",
    location: "Coventry, United Kingdom",
    campus: "Sherbourne Residences",
    lastSeen: "2 minutes ago",
    rating: 4.9,
    reviewCount: 58,
    followers: 217,
    following: 0,
    bio: "Maya Patel was born out of the love for giving vintage clothing a second life. Final year student. Open to bundles and local campus pickups at the Library or SU. Follow me for weekly drops of Carhartt and North Face."
  };

  const [listings, setListings] = useState([
    { id: 1, title: "Vintage Carhartt Jacket", price: "65", likes: 24, saved: false, condition: "Like New", size: "L", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800" },
    { id: 2, title: "North Face Puffer", price: "120", likes: 82, saved: true, condition: "Good", size: "M", img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800" },
    { id: 3, title: "Levi's 501 Jeans", price: "35", likes: 12, saved: false, condition: "Used", size: "W32 L30", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800" },
    { id: 4, title: "Graphic Tee", price: "15", likes: 45, saved: false, condition: "New", size: "XL", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800" },
    { id: 5, title: "Wool Cardigan", price: "28", likes: 19, saved: false, condition: "Used", size: "S", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800" },
    { id: 6, title: "Varsity Jacket", price: "55", likes: 67, saved: false, condition: "Like New", size: "M", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800" },
    { id: 7, title: "Checkered Shirt", price: "22", likes: 8, saved: false, condition: "Used", size: "L", img: "https://images.unsplash.com/photo-1598411037848-9cda955883a2?q=80&w=800" },
    { id: 8, title: "Beanie Hat", price: "12", likes: 54, saved: false, condition: "New", size: "OS", img: "https://images.unsplash.com/photo-1576871333021-d6426aa558ee?q=80&w=800" }
  ]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLike = (id) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        const nextSaved = !item.saved;
        return { ...item, saved: nextSaved, likes: nextSaved ? item.likes + 1 : item.likes - 1 };
      }
      return item;
    }));
  };

  const appleFontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-100 selection:text-blue-700">
      
      {/* Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-10 right-10 w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center z-40 transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        <ChevronUp size={24} className="text-zinc-900" />
      </button>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-200/30">
        <div className="flex items-center justify-between px-6 py-3 w-full max-w-[1440px] mx-auto relative z-50 font-inter">
          <div className="flex items-center gap-8 font-inter">
            <a className="text-xl font-black tracking-tighter text-zinc-900 cursor-pointer" href="#">CS</a>
            <nav className="hidden md:flex items-center gap-6">
              <a className="font-semibold text-sm tracking-tight cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors">Browse</a>
              <a className="text-zinc-400 font-medium hover:text-zinc-800 transition-colors text-sm tracking-tight cursor-pointer">Bundles</a>
            </nav>
          </div>
          
          <div className="flex-1 max-w-2xl px-8 hidden sm:block relative font-inter">
            <div className="relative group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                className="w-full h-11 pl-12 pr-4 bg-zinc-100/80 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-zinc-400 font-inter font-inter" 
                placeholder="Search campus..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 font-inter font-inter">
            <div className="flex items-center gap-4 text-zinc-500 font-inter">
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all font-inter font-inter"><Bell size={22} strokeWidth={1.5} /></button>
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all font-inter font-inter"><ShoppingCart size={22} strokeWidth={1.5} /></button>
            </div>
            <button className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#0071e3] text-white shadow-sm transition-all hover:bg-[#0077ed] font-inter font-inter font-inter">
              Sell <Plus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 ml-2 cursor-pointer font-inter font-inter">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover font-inter" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 font-inter">
        <div className="max-w-[1100px] mx-auto px-6 font-inter font-inter">
          
          {/* Main Profile Header Section */}
          <section className="pt-12 pb-10 border-b border-zinc-100 font-inter font-inter font-inter">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              
              {/* Avatar Column with Verification Badge */}
              <div className="flex-shrink-0 relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border border-zinc-100 shadow-sm relative font-inter">
                  <img src={user.avatar} className="w-full h-full object-cover font-inter" alt={user.fullName} />
                </div>
                {/* Refined Verification Badge (Grey bg, Thin blue tick) */}
                <div className="absolute bottom-1.5 right-1.5 w-9 h-9 bg-zinc-100 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center">
                   <Check size={18} className="text-[#0071e3]" strokeWidth={2.5} />
                </div>
              </div>

              {/* Information Column */}
              <div className="flex-1 space-y-5 font-inter">
                <div className="flex flex-wrap items-start justify-between gap-4 font-inter font-inter">
                  <div className="space-y-1 font-inter">
                    <h1 style={{ fontFamily: appleFontStack }} className="text-2xl font-bold tracking-tight text-zinc-900 font-inter">
                      @{user.username}
                    </h1>
                    <div className="flex items-center gap-2 font-inter font-inter">
                       <p className="text-[14px] text-zinc-500 font-medium font-inter">
                         {user.fullName} • {user.subject}
                       </p>
                       <div className="flex items-center gap-1 ml-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} className="fill-orange-400 text-orange-400" />)}
                          </div>
                          <span className="text-[12px] text-zinc-400 font-medium">({user.reviewCount})</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-inter font-inter font-inter">
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-8 py-1.5 lg:px-6 lg:py-1 rounded-lg lg:rounded-md text-sm font-bold transition-all border ${
                        isFollowing 
                          ? 'bg-[#0071e3] text-white border-[#0071e3]' 
                          : 'bg-transparent text-[#0071e3] border-[#0071e3]'
                      }`}
                    >
                      {isFollowing ? 'Followed' : 'Follow'}
                    </button>
                    <button className="px-6 py-1.5 lg:px-4 lg:py-1 bg-transparent text-[#0071e3] border border-[#0071e3] rounded-lg lg:rounded-md text-sm font-bold transition-all">
                      Message Seller
                    </button>
                  </div>
                </div>

                {/* Status Badge Area */}
                <div className="flex items-center gap-3 font-inter">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center font-inter font-inter">
                    <Layers size={18} className="text-[#0071e3]" />
                  </div>
                  <div className="font-inter">
                    <p className="text-[13.5px] font-bold text-zinc-900 leading-none">Top Swapper</p>
                    <p className="text-[12px] text-zinc-500 font-medium mt-1">Regularly lists 5 or more items per term.</p>
                  </div>
                </div>

                {/* Information Grid: About vs Verified Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 pt-2 font-inter">
                  <div className="space-y-3 font-inter">
                    <p className="text-[12px] font-medium text-zinc-400 font-inter">About:</p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium font-inter">
                        <MapPin size={14} className="text-zinc-400" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium font-inter">
                        <Clock size={14} className="text-zinc-400" />
                        Last seen {user.lastSeen}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium font-inter">
                        <Users size={14} className="text-zinc-400 font-inter" />
                        <span className="text-[#0071e3] font-bold cursor-pointer hover:underline">{user.followers} followers</span>, {user.following} following
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 font-inter">
                    <p className="text-[12px] font-medium text-zinc-400 font-inter">Verified Info:</p>
                    <div className="space-y-2.5 font-inter">
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium font-inter font-inter">
                        <BadgeCheck size={14} className="text-zinc-400 font-inter" />
                        <span className="text-blue-600 font-bold font-inter">University ID</span> — {user.university}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium font-inter">
                        <Check size={14} className="text-zinc-400 font-inter" />
                        Email Address
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <div className="pt-4 font-inter font-inter">
                  <p className="text-[13.5px] text-zinc-600 leading-relaxed font-medium">
                    {user.bio} <button className="text-[#0071e3] font-normal underline hover:text-blue-700 ml-0.5">see more</button>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Discovery Tabs Area */}
          <div className="flex items-center mt-6 mb-2">
            <div className="bg-zinc-200/60 p-1 lg:p-0.5 rounded-xl lg:rounded-lg inline-flex relative w-full sm:w-auto">
               {['listings', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative z-10 py-1.5 px-8 lg:py-1 lg:px-6 text-[14px] font-semibold capitalize rounded-lg lg:rounded-md transition-all duration-300 flex-1 sm:flex-none ${
                      activeTab === tab 
                        ? 'bg-white text-zinc-900 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
          </div>

          {/* Listing Grid / Reviews Content */}
          <section className="pt-12 min-h-[500px] font-inter">
            {activeTab === 'listings' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 font-inter font-inter font-inter">
                {listings.map((item) => {
                  const cStyle = getConditionStyles(item.condition);
                  return (
                    <div key={item.id} className="group cursor-pointer transition-all duration-300">
                      <div className="relative pb-2 overflow-visible">
                        <div className="relative overflow-hidden aspect-[4/5] rounded-2xl border border-gray-100 transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-black/5">
                          <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" alt={item.title} />
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                            className="absolute top-4 right-4 px-3 h-9 rounded-full flex items-center gap-2 z-10 transition-all duration-300 hover:scale-105 active:scale-95 border bg-white/70 backdrop-blur-md border-white/40 shadow-sm"
                          >
                            <span className={`text-[12px] font-bold transition-colors duration-300 ${item.saved ? 'text-[#FF5A5F]' : 'text-zinc-700'}`}>{item.likes}</span>
                            <Heart size={17} strokeWidth={2.5} className={`transition-all duration-300 ${item.saved ? 'fill-[#FF5A5F] text-[#FF5A5F]' : 'text-[#FF5A5F]'}`} />
                          </button>

                          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                            {item.size && (
                              <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-zinc-800 text-[11px] font-bold tracking-tight shadow-sm uppercase">
                                {item.size}
                              </span>
                            )}
                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight shadow-sm ${cStyle.bg} ${cStyle.text}`}>
                              {item.condition}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 px-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[15px] font-bold leading-[1.2] flex-1 line-clamp-1 pt-0.5">{item.title}</p>
                          <span className="text-[15px] font-bold">£{item.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl">
                {/* Rating Overview */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-8 pb-8 border-b border-zinc-200/60">
                  {/* Big Score */}
                  <div className="flex items-center gap-5 min-w-[200px]">
                    <span style={{ fontFamily: appleFontStack }} className="text-6xl font-semibold text-zinc-900 tracking-tight">4.9</span>
                    <div className="flex flex-col items-start">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="fill-orange-400 text-orange-400" />)}
                      </div>
                      <span className="text-[13px] text-zinc-500 font-medium">126 reviews</span>
                    </div>
                  </div>

                  {/* Breakdown Bars */}
                  <div className="flex-1 w-full space-y-2.5 md:pt-1">
                    {[
                      { s: 5, p: 85 },
                      { s: 4, p: 12 },
                      { s: 3, p: 3 },
                      { s: 2, p: 0 },
                      { s: 1, p: 0 }
                    ].map(bar => (
                      <div key={bar.s} className="flex items-center gap-3">
                        <span className="text-[13px] font-bold text-zinc-900 w-2 text-right">{bar.s}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-zinc-200 overflow-hidden">
                          <div className="h-full bg-[#0071e3] rounded-full" style={{ width: `${bar.p}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filters & Keyword Pills */}
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {[
                    { label: "All Reviews", active: true },
                    { label: "Verified Only", count: 46 },
                    { label: "With Photos", count: 25 },
                    { label: "Great Seller", count: 78 },
                    { label: "Speedy Delivery", count: 21 },
                    { label: "Item as Described", count: 9 }
                  ].map((pill, i) => (
                    <button key={i} className={`px-4 py-1.5 rounded-full border text-[13px] font-semibold transition-colors ${pill.active ? 'border-[#0071e3] text-[#0071e3] bg-blue-50/50' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}>
                      {pill.label} {pill.count && <span className="text-zinc-400 ml-1 font-medium">{pill.count}</span>}
                    </button>
                  ))}
                </div>

                {/* Review List */}
                <div className="space-y-0">
                  {[
                    { 
                      id: 1, 
                      name: "William S.", 
                      date: "12 days ago", 
                      verified: true, 
                      text: "Looks are awesome. Traction is unbelievable. I normally wear 11.5 but purchased 12.0. Fits perfectly, support under arch is just as I like. My only quibble is the tightness across the forefoot. If I were in my playing years, I would definitely have 2 or 3 pairs in rotation.", 
                      rating: 4.8 
                    },
                    { 
                      id: 2, 
                      name: "James K.", 
                      date: "1 month ago", 
                      verified: true, 
                      text: "These felt stiff and narrow when I went true to size. The insole feels undersized. When stepping with them it’s like the inner ankle is stepping over it if that makes sense, almost rubbing uncomfortably.", 
                      rating: 3.5 
                    },
                    { 
                      id: 3, 
                      name: "Elena R.", 
                      date: "2 months ago", 
                      verified: true, 
                      text: "Maya was great to swap with! The Carhartt jacket was exactly as described and practically brand new. She was super friendly and responsive to messages. Met up at the library lobby, zero hassle.", 
                      rating: 5.0 
                    }
                  ].map((rev) => (
                    <div key={rev.id} className="py-8 border-b border-zinc-200/60 last:border-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-zinc-100 overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?u=rev${rev.id}`} className="w-full h-full object-cover" alt={rev.name} />
                          </div>
                          <div>
                            <p className="text-[15px] font-bold text-zinc-900">{rev.name}</p>
                            <p className="text-[13px] text-zinc-500 font-medium mt-0.5">{rev.date}</p>
                          </div>
                        </div>
                        {rev.verified && (
                          <span className="px-2.5 py-0.5 rounded-full border border-emerald-500 text-emerald-600 text-[11px] font-bold tracking-wide">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[15px] text-zinc-800 leading-relaxed font-medium mb-4">
                        {rev.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star 
                              key={s} 
                              size={15} 
                              className={s <= Math.floor(rev.rating) ? "fill-orange-400 text-orange-400" : "fill-zinc-200 text-zinc-200"} 
                            />
                          ))}
                        </div>
                        <span className="text-[13px] font-bold text-zinc-700">{rev.rating.toFixed(1)} stars</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Bottom Breadcrumbs */}
          <div className="mt-32 pb-8 border-b border-zinc-200/60 font-inter">
            <div className="flex items-center gap-3 text-[13px] text-zinc-400 font-inter">
              <span className="text-zinc-900 font-bold cursor-pointer hover:text-[#0071e3] transition-colors font-inter">CS</span>
              <ChevronRight size={14} className="text-zinc-300" />
              <span className="text-zinc-900 font-medium cursor-pointer hover:text-[#0071e3] transition-colors font-inter font-inter">Profiles</span>
              <ChevronRight size={14} className="text-zinc-300" />
              <span className="text-zinc-900 font-medium font-inter">{user.fullName}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#f5f5f7] border-t border-zinc-200/50 mt-32 font-inter font-inter">
        <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-24 text-[12px] text-zinc-500 font-inter">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 font-inter font-inter font-inter">
            {[
              { title: "Shop", links: ["Textbooks", "Electronics", "Clothing", "Sports Gear"] },
              { title: "Account", links: ["Manage Profile", "Saved Items", "Swap History"] },
              { title: "Marketplace", links: ["List an Item", "Bundles", "Verified Swappers"] },
              { title: "Help", links: ["FAQ", "Contact Us", "Campus Rules"] },
              { title: "Swap Values", links: ["Sustainability", "Community First", "Safety"] }
            ].map((group) => (
              <div key={group.title} className="space-y-2 font-inter font-inter font-inter font-inter">
                <h4 className="text-zinc-900 font-bold font-inter">{group.title}</h4>
                <ul className="space-y-1 font-inter">
                  {group.links.map(l => <li key={l} className="hover:underline hover:text-zinc-900 cursor-pointer transition-colors font-inter font-inter">{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased; 
          background-color: #f5f5f7; 
        }
        input:focus { outline: none; box-shadow: none; }
      `}} />
    </div>
  );
};

export default App;