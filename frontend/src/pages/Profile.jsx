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
 * - Verification: Added a blue verification badge overlapping the main profile picture.
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
    { id: 1, title: "Vintage Carhartt Jacket", price: "65", likes: 24, saved: false, condition: "Like New", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800" },
    { id: 2, title: "North Face Puffer", price: "120", likes: 82, saved: true, condition: "Good", img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800" },
    { id: 3, title: "Levi's 501 Jeans", price: "35", likes: 12, saved: false, condition: "Used", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800" },
    { id: 4, title: "Graphic Tee", price: "15", likes: 45, saved: false, condition: "New", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800" },
    { id: 5, title: "Wool Cardigan", price: "28", likes: 19, saved: false, condition: "Used", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800" },
    { id: 6, title: "Varsity Jacket", price: "55", likes: 67, saved: false, condition: "Like New", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800" },
    { id: 7, title: "Checkered Shirt", price: "22", likes: 8, saved: false, condition: "Used", img: "https://images.unsplash.com/photo-1598411037848-9cda955883a2?q=80&w=800" },
    { id: 8, title: "Beanie Hat", price: "12", likes: 54, saved: false, condition: "New", img: "https://images.unsplash.com/photo-1576871333021-d6426aa558ee?q=80&w=800" }
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
    <div className="min-h-screen bg-white text-[#1d1d1f] selection:bg-blue-100 selection:text-blue-700 font-inter">
      
      {/* Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-10 right-10 w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center z-40 transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        <ChevronUp size={24} className="text-zinc-900" />
      </button>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-200/30">
        <div className="flex items-center justify-between px-6 py-3 w-full max-w-[1440px] mx-auto relative z-50">
          <div className="flex items-center gap-8">
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
                className="w-full h-11 pl-12 pr-4 bg-zinc-100/80 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-zinc-400 font-inter" 
                placeholder="Search campus..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-zinc-500 font-inter">
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all"><Bell size={22} strokeWidth={1.5} /></button>
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all"><ShoppingCart size={22} strokeWidth={1.5} /></button>
            </div>
            <button className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#0071e3] text-white shadow-sm transition-all hover:bg-[#0077ed]">
              Sell <Plus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 ml-2 cursor-pointer font-inter">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-6 font-inter">
          
          {/* Main Profile Header Section */}
          <section className="pt-12 pb-10 border-b border-zinc-100">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              
              {/* Avatar Column with Verification Badge */}
              <div className="flex-shrink-0 relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border border-zinc-100 shadow-sm font-inter">
                  <img src={user.avatar} className="w-full h-full object-cover" alt={user.fullName} />
                </div>
                {/* Verification Tick Overlapping */}
                <div className="absolute bottom-1.5 right-1.5 w-9 h-9 bg-[#0071e3] rounded-full border-[4px] border-white shadow-md flex items-center justify-center">
                   <Check size={18} className="text-white" strokeWidth={3.5} />
                </div>
              </div>

              {/* Information Column */}
              <div className="flex-1 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4 font-inter">
                  <div className="space-y-1">
                    <h1 style={{ fontFamily: appleFontStack }} className="text-2xl font-bold tracking-tight text-zinc-900">
                      @{user.username}
                    </h1>
                    <div className="flex items-center gap-2">
                       <p className="text-[14px] text-zinc-500 font-medium">
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

                  <div className="flex items-center gap-3 font-inter">
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-8 py-1.5 rounded-lg text-sm font-bold transition-all border ${
                        isFollowing 
                          ? 'bg-[#0071e3] text-white border-[#0071e3]' 
                          : 'bg-transparent text-[#0071e3] border-[#0071e3]'
                      }`}
                    >
                      {isFollowing ? 'Followed' : 'Follow'}
                    </button>
                    <button className="px-6 py-1.5 bg-transparent text-[#0071e3] border border-[#0071e3] rounded-lg text-sm font-bold transition-all">
                      Message Seller
                    </button>
                  </div>
                </div>

                {/* Status Badge Area */}
                <div className="flex items-center gap-3 font-inter">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center font-inter">
                    <Layers size={18} className="text-[#0071e3]" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-zinc-900 leading-none">Top Swapper</p>
                    <p className="text-[12px] text-zinc-500 font-medium mt-1">Regularly lists 5 or more items per term.</p>
                  </div>
                </div>

                {/* Information Grid: About vs Verified Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 pt-2 font-inter">
                  <div className="space-y-3 font-inter">
                    <p className="text-[12px] font-medium text-zinc-400">About:</p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                        <MapPin size={14} className="text-zinc-400" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                        <Clock size={14} className="text-zinc-400" />
                        Last seen {user.lastSeen}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                        <Users size={14} className="text-zinc-400 font-inter" />
                        <span className="text-[#0071e3] font-bold cursor-pointer hover:underline">{user.followers} followers</span>, {user.following} following
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 font-inter">
                    <p className="text-[12px] font-medium text-zinc-400">Verified Info:</p>
                    <div className="space-y-2.5 font-inter">
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                        <BadgeCheck size={14} className="text-zinc-400" />
                        <span className="text-blue-600 font-bold">University ID</span> — {user.university}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                        <Check size={14} className="text-zinc-400 font-inter" />
                        Email Address
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <div className="pt-4 font-inter">
                  <p className="text-[13.5px] text-zinc-600 leading-relaxed font-medium">
                    {user.bio} <button className="text-[#0071e3] font-normal underline hover:text-blue-700 ml-0.5">see more</button>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Discovery Tabs Area */}
          <div className="flex items-center gap-10 mt-2 font-inter">
             {['listings', 'reviews'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-[14px] font-bold capitalize relative ${activeTab === tab ? 'text-[#0071e3]' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                   {tab}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071e3] rounded-full font-inter" />}
                </button>
             ))}
          </div>

          {/* Listing Grid / Reviews Content */}
          <section className="pt-12 min-h-[500px] font-inter">
            {activeTab === 'listings' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 font-inter font-inter">
                {listings.map((item) => {
                  const cStyle = getConditionStyles(item.condition);
                  return (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative pb-2 overflow-visible font-inter">
                        <div className="relative overflow-hidden aspect-[4/5] rounded-2xl border border-zinc-100 transition-all font-inter">
                          <img src={item.img} className="w-full h-full object-cover transition-transform duration-700" alt={item.title} />
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                            className="absolute top-4 right-4 px-3 h-9 rounded-full flex items-center gap-2 z-10 bg-white/70 backdrop-blur-md border-white/40 shadow-sm transition-all"
                          >
                            <span className={`text-[12px] font-bold ${item.saved ? 'text-[#FF5A5F]' : 'text-zinc-700'}`}>{item.likes}</span>
                            <Heart size={17} strokeWidth={2.5} className={item.saved ? 'fill-[#FF5A5F] text-[#FF5A5F]' : 'text-[#FF5A5F] font-inter'} />
                          </button>

                          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10 font-inter">
                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight shadow-sm ${cStyle.bg} ${cStyle.text} font-inter`}>
                              {item.condition}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 px-1 font-inter">
                        <div className="flex justify-between items-start gap-2 mb-0.5 font-inter">
                          <h3 className="text-[15px] font-bold leading-[1.2] flex-1 line-clamp-1 font-inter">{item.title}</h3>
                          <span style={{ fontFamily: appleFontStack }} className="text-[15px] font-bold font-inter">£{item.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl space-y-8 font-inter">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-4 shadow-sm font-inter">
                     <div className="flex items-center justify-between font-inter">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden font-inter font-inter">
                              <img src={`https://i.pravatar.cc/150?u=rev${i}`} className="w-full h-full object-cover" alt="Reviewer" />
                           </div>
                           <div className="font-inter">
                              <p className="text-[14px] font-bold font-inter">Alex Thompson</p>
                              <p className="text-[12px] text-zinc-400 font-medium font-inter">Purchased Vintage Carhartt Beanie</p>
                           </div>
                        </div>
                        <div className="flex gap-0.5 font-inter">
                           {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-orange-400 text-orange-400" />)}
                        </div>
                     </div>
                     <p className="text-[15px] text-zinc-700 leading-relaxed font-medium">
                        "Great swapper! Met Maya at the Library Lobby for a pickup. The beanie was exactly as described and practically brand new. Super friendly and responsive."
                     </p>
                     <div className="flex items-center gap-2 pt-2 border-t border-zinc-50 font-inter font-inter font-inter">
                        <ShieldCheck size={14} className="text-green-600 font-inter" />
                        <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest font-inter">Verified Transaction</span>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bottom Breadcrumbs */}
          <div className="mt-32 pb-8 border-b border-zinc-200/60 font-inter font-inter">
            <div className="flex items-center gap-3 text-[13px] text-zinc-400 font-inter">
              <span className="text-zinc-900 font-bold cursor-pointer hover:text-[#0071e3] transition-colors font-inter">CS</span>
              <ChevronRight size={14} className="text-zinc-300 font-inter" />
              <span className="text-zinc-900 font-medium cursor-pointer hover:text-[#0071e3] transition-colors font-inter">Profiles</span>
              <ChevronRight size={14} className="text-zinc-300 font-inter" />
              <span className="text-zinc-900 font-medium font-inter">{user.fullName}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#f5f5f7] border-t border-zinc-200/50 mt-32 font-inter font-inter font-inter">
        <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-24 text-[12px] text-zinc-500 font-inter">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 font-inter">
            {[
              { title: "Shop", links: ["Textbooks", "Electronics", "Clothing", "Sports Gear"] },
              { title: "Account", links: ["Manage Profile", "Saved Items", "Swap History"] },
              { title: "Marketplace", links: ["List an Item", "Bundles", "Verified Swappers"] },
              { title: "Help", links: ["FAQ", "Contact Us", "Campus Rules"] },
              { title: "Swap Values", links: ["Sustainability", "Community First", "Safety"] }
            ].map((group) => (
              <div key={group.title} className="space-y-2">
                <h4 className="text-zinc-900 font-bold font-inter">{group.title}</h4>
                <ul className="space-y-1 font-inter font-inter font-inter">
                  {group.links.map(l => <li key={l} className="hover:underline hover:text-zinc-900 cursor-pointer transition-colors font-inter">{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Source+Code+Pro:wght@400;500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        body { -webkit-font-smoothing: antialiased; background-color: #ffffff; }
        input:focus { outline: none; box-shadow: none; }
      `}} />
    </div>
  );
};

export default App;