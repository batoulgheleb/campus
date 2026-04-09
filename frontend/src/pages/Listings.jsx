import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Heart, 
  Clock, 
  Search, 
  ShoppingCart, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  Laptop, 
  Table, 
  Shirt, 
  Bike, 
  Home,
  ChevronDown, 
  Plus,
  Utensils,
  Trophy, 
  Gamepad2,
  Watch,
  ChevronRight as ChevronRightIcon,
  Check, 
  Sparkles,
  Package,
  AlertCircle,
  X,
  History,
  Tag,
  SlidersHorizontal,
  ChevronUp
} from 'lucide-react';
import { listings as listingsApi } from '../api';

/**
 * CampusSwap - Editorial Marketplace
 * - Added: Floating "Back to Top" button (FAB) with translucent glass styling.
 * - Logic: FAB appears only after scrolling 400px down.
 * - Fixed: Moved static data outside App to prevent reference and rendering errors.
 * - Logic: Category-aware infinite scroll and shared loading states.
 */

// --- STATIC DATA CONFIGURATION ---

const categories = [
  { icon: <Watch size={16}/>, label: 'Accessories' }, { icon: <Book size={16}/>, label: 'Books' },
  { icon: <Laptop size={16}/>, label: 'Digital Electronics' }, { icon: <Bike size={16}/>, label: 'Bikes' },
  { icon: <Table size={16}/>, label: 'Furniture & Decor' }, { icon: <Utensils size={16}/>, label: 'Kitchen' },
  { icon: <Gamepad2 size={16}/>, label: 'Gaming' }, { icon: <Shirt size={16}/>, label: 'Clothing & Shoes' },
  { icon: <Trophy size={16}/>, label: 'Sports' }, { icon: <Home size={16}/>, label: 'Housing' }
];

const seasonalSlides = [
  { tag: "FRESHERS ESSENTIAL", title: "Mini Fridge & Chill", desc: "Keep your snacks cold and room social.", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800", color: "text-blue-600", bgColor: "bg-blue-50" },
  { tag: "EXAM SURVIVAL", title: "The All-Nighter Kit", desc: "Desk lamps, textbooks, and focus gear.", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800", color: "text-indigo-600", bgColor: "bg-indigo-50" },
  { tag: "MOVING OUT SALE", title: "Bulk Discounts", desc: "Everything must go before summer break.", image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800", color: "text-rose-600", bgColor: "bg-rose-50" }
];

// --- HELPER COMPONENTS ---

const LazyImage = ({ src, alt, className, wrapperClassName = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.unobserve(entry.target); }
    }, { rootMargin: '200px' });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-zinc-100 ${wrapperClassName}`}>
      {isInView && (
        <img src={src} alt={alt} onLoad={() => setIsLoaded(true)}
          className={`${className} transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {!isLoaded && <div className="absolute inset-0 bg-zinc-200 animate-pulse-subtle" />}
    </div>
  );
};

const TypingSubtitle = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i)); i++;
      if (i > text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}</span>;
};

const FilterPanel = ({ isOpen, sortBy, setSortBy, priceLimit, setPriceLimit, selectedConditions, setSelectedConditions, selectedSize, setSelectedSize, onApply }) => {
  const handleConditionToggle = (c) => {
    if (c === 'any') { setSelectedConditions(['any']); return; }
    setSelectedConditions(prev => {
      const filtered = prev.filter(item => item !== 'any');
      if (filtered.includes(c)) {
        const next = filtered.filter(item => item !== c);
        return next.length === 0 ? ['any'] : next;
      }
      return [...filtered, c];
    });
  };

  return (
    <div className={`transition-all duration-700 ease-in-out overflow-hidden border-b border-zinc-200/60 ${isOpen ? 'max-h-[800px] opacity-100 pb-12' : 'max-h-0 opacity-0'}`}>
      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_0.8fr_1fr_1.5fr] gap-x-12 pt-6">
        <div className="space-y-4">
          <h4 className="text-sm font-normal text-black font-inter">University / campus</h4>
          <div className="flex flex-col gap-3 text-zinc-400">
            <label className="flex items-center gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer transition-colors font-inter">
              <input defaultChecked type="checkbox" className="rounded-md border-zinc-300 text-black focus:ring-0 w-4 h-4" /> Warwick
            </label>
            <div className="text-sm font-medium select-none text-zinc-300 font-inter">Coventry (coming soon)</div>
            <div className="text-sm font-medium select-none text-zinc-300 font-inter">Birmingham (coming soon)</div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-normal text-black font-inter">Sort by</h4>
          <div className="flex flex-col gap-2.5">
            {['Newest', 'Price: Low-High', 'Price: High-Low'].map((option) => (
              <button key={option} onClick={() => setSortBy(option)} className={`text-left text-sm font-medium transition-colors font-inter ${sortBy === option ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>{option}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-normal text-black font-inter">Price range</h4>
          <div className="space-y-2 font-inter">
            <div className="text-lg font-bold text-zinc-900 tracking-tight">£{priceLimit}</div>
            <div className="relative">
              <input type="range" className="w-full accent-black cursor-pointer" min="0" max="600" step="5" value={priceLimit} onChange={(e) => setPriceLimit(e.target.value)} />
              <div className="flex justify-between mt-1"><span className="text-[10px] text-zinc-400 font-bold font-mono font-mono">£0</span><span className="text-[10px] text-zinc-400 font-bold font-mono font-mono">£600</span></div>
            </div>
          </div>
        </div>
        <div className="space-y-8 pl-4">
          <div>
            <h4 className="text-sm font-normal text-black mb-4 font-inter">Condition</h4>
            <div className="flex flex-wrap gap-2">
              {['any', 'new', 'like new', 'good', 'satisfactory', 'used'].map(c => (
                <button key={c} onClick={() => handleConditionToggle(c)} className={`px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all duration-300 ${selectedConditions.includes(c) ? 'bg-black border-black text-white shadow-none' : 'bg-transparent border-zinc-200 text-zinc-400 hover:text-zinc-900'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-normal text-black mb-4 font-inter">Size</h4>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'OS'].map(s => (
                <button key={s} onClick={() => setSelectedSize(selectedSize === s ? null : s)} className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${selectedSize === s ? 'bg-black border-black text-white shadow-none' : 'bg-transparent border-zinc-200 text-zinc-400 hover:text-zinc-900'}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button onClick={onApply} className="text-blue-600 font-normal text-sm flex items-center gap-0.5 hover:underline transition-all active:scale-95 font-inter">
          Apply filters <span className="ml-1 text-xs"> {'>'} </span>
        </button>
      </div>
    </div>
  );
};

export function ListingCardSkeleton() {
  return (
    <div className="w-full animate-pulse-subtle">
      <div className="relative pb-4">
        <div className="aspect-[4/5] bg-zinc-200 rounded-2xl w-full" />
        <div className="absolute bottom-0 left-5 w-14 h-14 rounded-full border-[3px] border-white bg-zinc-200 z-20 shadow-sm" />
      </div>
      <div className="mt-1.5 space-y-2.5 px-1">
        <div className="flex justify-between items-center gap-4">
          <div className="h-4 bg-zinc-200 rounded-md w-3/5" />
          <div className="h-4 bg-zinc-200 rounded-md w-10" />
        </div>
        <div className="h-3 bg-zinc-100 rounded-md w-2/5" />
      </div>
    </div>
  );
}

export function ListingCard({ listing, onToggleSave, onOpen, className = "", index = 0, isMinimal = false }) {
  const getConditionStyles = (condition) => {
    const c = condition.toLowerCase();
    if (c === 'like new') return { bg: 'bg-[#D1E9FF]', text: 'text-[#1B4B8A]' };
    if (c === 'brand new' || c === 'new') return { bg: 'bg-[#C8F0EF]', text: 'text-[#1A6B6A]' };
    if (c === 'satisfactory') return { bg: 'bg-[#FFE2C8]', text: 'text-[#8A4A1B]' };
    return { bg: 'bg-[#E5E7EB]', text: 'text-[#4B5563]' };
  };
  const conditionStyle = getConditionStyles(listing.condition);

  return (
    <div
      className={`cursor-pointer group reveal-staggered ${className}`}
      style={{ '--stagger-delay': `${index * 50}ms` }}
      onClick={() => onOpen?.(listing.id)}
    >
      <div className="relative pb-4 overflow-visible">
        <div className="relative overflow-hidden aspect-[4/5] rounded-2xl border border-gray-100 transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-black/5">
          <LazyImage src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" wrapperClassName="w-full h-full" />
          <button
            className={`absolute top-4 right-4 px-3 h-9 rounded-full flex items-center gap-2 z-10 transition-all duration-300 hover:scale-105 active:scale-95 border 
              ${isMinimal 
                ? 'bg-white text-zinc-900 border-zinc-200 shadow-none' 
                : 'bg-white/70 backdrop-blur-md border-white/40 shadow-sm'
              }`}
            onClick={(e) => { e.stopPropagation(); onToggleSave?.(listing.id); }}
          >
            <span className={`text-[12px] font-bold transition-colors duration-300 ${listing.saved ? 'text-[#FF5A5F]' : 'text-zinc-700'}`}>{listing.likes}</span>
            <Heart size={17} strokeWidth={2.5} className={`transition-all duration-300 ${listing.saved ? 'fill-[#FF5A5F] text-[#FF5A5F]' : 'text-[#FF5A5F]'}`} />
          </button>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10 font-inter">
            {listing.spec_tag && (
              <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight ${isMinimal ? '' : 'shadow-sm'} bg-white/85 text-zinc-800 border border-white/60`}>
                {listing.spec_tag}
              </span>
            )}
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight ${isMinimal ? '' : 'shadow-sm'} ${conditionStyle.bg} ${conditionStyle.text}`}>{listing.condition}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-5 w-14 h-14 rounded-full border-[3px] border-white overflow-hidden bg-gray-100 z-20 shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
          <img src={listing.seller.avatar} alt={listing.seller.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="mt-1 px-1 transition-transform duration-300 group-hover:translate-x-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] font-bold leading-[1.2] flex-1 line-clamp-1 font-inter">{listing.title}</p>
          <span className="text-[15px] font-bold font-inter">£{listing.price}</span>
        </div>
        <p className="text-[13px] font-semibold text-gray-600 mt-0 font-inter font-inter">{listing.seller.name}</p>
      </div>
    </div>
  );
}

// --- MAIN APPLICATION ---

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(["macbook", "vintage jacket", "airpods"]);
  const [matchingListings, setMatchingListings] = useState([]);
  const [infiniteListings, setInfiniteListings] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  
  const [categoryListings, setCategoryListings] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => {
    const urlCategory = searchParams.get('category');
    if (!urlCategory) return null;
    const idx = categories.findIndex((cat) => cat.label.toLowerCase() === urlCategory.toLowerCase());
    return idx >= 0 ? idx : null;
  });
  const [sortBy, setSortBy] = useState('Newest');
  const [priceLimit, setPriceLimit] = useState(Number(searchParams.get('max_price') || 200));
  const [selectedConditions, setSelectedConditions] = useState(['any']);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // FAB State: Back to top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  const loaderRef = useRef(null);
  const essentialsScrollRef = useRef(null);
  const LIMIT = 20;
  const isSearchView = Boolean(searchParams.get('q'));

  const buildQueryParams = useCallback((offset = 0) => {
    const q = searchParams.get('q') || undefined;
    const category = searchParams.get('category') || undefined;
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort') || 'newest';
    const conditionFromUrl = searchParams.getAll('condition');

    return {
      q,
      category,
      condition: conditionFromUrl.length > 0 ? conditionFromUrl : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      sort,
      limit: LIMIT,
      offset,
    };
  }, [searchParams]);

  const updateUrlParams = useCallback((updates) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      next.delete(key);
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach((entry) => {
          if (entry !== undefined && entry !== null && entry !== '') next.append(key, String(entry));
        });
        return;
      }
      next.set(key, String(value));
    });

    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Scroll reset & listener for FAB
  useEffect(() => { 
    window.scrollTo(0, 0); 
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchParams, activeCategory]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search results filter
  useEffect(() => {
    if (!debouncedQuery) { setMatchingListings([]); return; }
    const results = [...infiniteListings]
      .filter(item => item.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
      .slice(0, 12);
    setMatchingListings(results);
  }, [debouncedQuery, infiniteListings]);

  // Keep local UI state in sync with URL query params.
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      const idx = categories.findIndex((cat) => cat.label.toLowerCase() === urlCategory.toLowerCase());
      setActiveCategory(idx >= 0 ? idx : null);
    } else {
      setActiveCategory(null);
    }

    setSearchQuery(searchParams.get('q') || "");
    setPriceLimit(Number(searchParams.get('max_price') || 200));
    setSelectedConditions(searchParams.getAll('condition').length > 0 ? searchParams.getAll('condition') : ['any']);

    const sort = searchParams.get('sort');
    if (sort === 'price_asc') setSortBy('Price: Low-High');
    else if (sort === 'price_desc') setSortBy('Price: High-Low');
    else if (sort === 'popularity') setSortBy('Popularity');
    else setSortBy('Newest');
  }, [searchParams]);

  const fetchListings = useCallback(async () => {
    setInitialLoading(true);
    setCategoryLoading(true);
    try {
      const response = await listingsApi.list(buildQueryParams(0));
      const items = response?.items || [];
      const total = response?.total || 0;
      setInfiniteListings(items);
      setCategoryListings(items);
      setTotalItems(total);
      setHasMore(items.length < total);
      setCategoryHasMore(items.length < total);
    } catch (error) {
      console.error('Failed to load listings:', error);
      setInfiniteListings([]);
      setCategoryListings([]);
      setTotalItems(0);
      setHasMore(false);
      setCategoryHasMore(false);
    } finally {
      setInitialLoading(false);
      setCategoryLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleApplyFilters = () => {
    const sortMap = {
      'Newest': 'newest',
      'Price: Low-High': 'price_asc',
      'Price: High-Low': 'price_desc',
      'Popularity': 'popularity',
    };
    const normalizedConditions = selectedConditions.includes('any') ? [] : selectedConditions.map((c) => c.replace(/\s+/g, '_'));
    updateUrlParams({
      sort: sortMap[sortBy] || 'newest',
      max_price: priceLimit,
      condition: normalizedConditions,
    });
    setFilterOpen(false);
  };

  const handleClearFilters = (e) => {
    e.stopPropagation();
    setSortBy('Newest');
    setPriceLimit(200);
    setSelectedConditions(['any']);
    setSelectedSize(null);
    updateUrlParams({
      sort: undefined,
      max_price: undefined,
      condition: [],
    });
    setFilterOpen(false);
  };

  const handleSearchSubmit = (query) => {
    const normalized = (query || '').trim();
    if (!normalized) return;
    setRecentSearches(prev => [normalized, ...prev.filter(q => q !== normalized)].slice(0, 5));
    setIsSearchFocused(false);
    updateUrlParams({ q: normalized });
  };

  const handleToggleSave = async (id) => {
    const targetId = Number(id);
    const previousInfinite = infiniteListings;
    const previousMatching = matchingListings;
    const previousCategory = categoryListings;

    // Optimistic UI update first.
    const optimisticUpdater = (prev) => prev.map((item) => {
      if (Number(item.id) === targetId) {
        const isSaving = !item.saved;
        return { ...item, saved: isSaving, likes: isSaving ? item.likes + 1 : Math.max(0, item.likes - 1) };
      }
      return item;
    });

    setInfiniteListings(optimisticUpdater);
    setMatchingListings(optimisticUpdater);
    setCategoryListings(optimisticUpdater);

    try {
      const response = await listingsApi.toggleSave(targetId);
      const committedUpdater = (prev) => prev.map((item) => (
        Number(item.id) === targetId
          ? { ...item, saved: Boolean(response.saved), likes: response.likes }
          : item
      ));
      setInfiniteListings(committedUpdater);
      setMatchingListings(committedUpdater);
      setCategoryListings(committedUpdater);
    } catch (error) {
      // Revert optimistic update if API call fails.
      setInfiniteListings(previousInfinite);
      setMatchingListings(previousMatching);
      setCategoryListings(previousCategory);
      console.error('Failed to toggle favorite:', error);
    }
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || initialLoading || categoryLoading || !hasMore) return;
    setLoadingMore(true);
    try {
      const response = await listingsApi.list(buildQueryParams(infiniteListings.length));
      const nextBatch = response?.items || [];
      const total = response?.total || totalItems;
      setInfiniteListings(prev => [...prev, ...nextBatch]);
      setCategoryListings(prev => [...prev, ...nextBatch]);
      setTotalItems(total);
      const stillMore = infiniteListings.length + nextBatch.length < total;
      setHasMore(stillMore);
      setCategoryHasMore(stillMore);
    } catch (error) {
      console.error('Failed to load more listings:', error);
      setHasMore(false);
      setCategoryHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, initialLoading, categoryLoading, hasMore, infiniteListings.length, totalItems, buildQueryParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const isDiscoveryMore = activeCategory === null && hasMore;
      const isCategoryMore = activeCategory !== null && categoryHasMore;
      if (entries[0].isIntersecting && (isDiscoveryMore || isCategoryMore)) {
        loadMore();
      }
    }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, categoryHasMore, activeCategory, initialLoading, loadingMore]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollEssentials = (direction) => {
    if (essentialsScrollRef.current) {
      const scrollAmount = essentialsScrollRef.current.offsetWidth * 0.8;
      essentialsScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const showEndState = activeCategory !== null ? !categoryHasMore : !hasMore;
  const openListing = (listingId) => {
    const from = `${location.pathname}${location.search}`;
    navigate(`/listing/${listingId}?from=${encodeURIComponent(from)}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-100 selection:text-blue-700 font-inter scroll-smooth">
      {/* Back to Top Floating Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-10 right-10 w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center z-40 transition-all duration-500 hover:scale-110 active:scale-90 ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        <ChevronUp size={24} className="text-zinc-900" />
      </button>

      {/* Search Dim Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] transition-opacity duration-300 ${isSearchFocused ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSearchFocused(false)}
      />

      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-200/30">
        <div className="flex items-center justify-between px-6 py-3 w-full max-w-[1440px] mx-auto relative z-50">
          <div className="flex items-center gap-8">
            <a className="text-xl font-black tracking-tighter text-zinc-900 cursor-pointer font-inter font-inter" onClick={() => { setFilterOpen(false); setSearchParams(new URLSearchParams()); }}>CS</a>
            <nav className="hidden md:flex items-center gap-6">
              <a className={`font-semibold text-sm tracking-tight cursor-pointer font-inter ${!isSearchView && activeCategory === null ? 'text-zinc-900' : 'text-zinc-400'}`} onClick={() => { setFilterOpen(false); setSearchParams(new URLSearchParams()); }}>Browse</a>
              <a className="text-zinc-400 font-medium hover:text-zinc-800 transition-colors text-sm tracking-tight cursor-pointer font-inter">Bundles</a>
            </nav>
          </div>
          
          <div className="flex-1 max-w-2xl px-8 hidden sm:block relative">
            <div className="relative group">
              <Search size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all ${isSearchFocused ? 'text-blue-600 scale-110' : 'text-zinc-400'}`} />
              <input 
                className="w-full h-11 pl-12 pr-4 bg-zinc-100/80 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-zinc-400 font-inter font-inter" 
                placeholder="Search campus..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900">
                  <X size={14} strokeWidth={3} />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            <div className={`absolute top-full left-8 right-8 mt-4 bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top ${isSearchFocused ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
              <div className="max-h-[70vh] overflow-y-auto no-scrollbar py-6">
                {!searchQuery && recentSearches.length > 0 && (
                  <div className="px-6 mb-8">
                    <h3 className="text-[13px] text-zinc-500 mb-4 flex items-center gap-2 font-inter font-inter"><History size={12} /> Recent searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map(q => <button key={q} onClick={() => handleSearchSubmit(q)} className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 rounded-full text-sm font-medium text-zinc-700 transition-colors font-inter">{q}</button>)}
                    </div>
                  </div>
                )}
                {searchQuery && (
                  <div className="px-6 mb-8">
                    <h3 className="text-[13px] text-zinc-500 mb-4 flex items-center gap-2 font-inter font-inter"><Tag size={12} /> Category suggestions</h3>
                    <div className="space-y-1">
                      {categories.slice(0, 3).map(cat => (
                        <button key={cat.label} onClick={() => handleSearchSubmit(searchQuery)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-blue-50 group flex items-center justify-between transition-colors">
                          <span className="text-[15px] text-zinc-800 font-inter font-inter font-inter">Search for "<span className="font-bold text-blue-600">{searchQuery}</span>" in <span className="font-bold">{cat.label}</span></span>
                          <ChevronRightIcon size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchQuery && (
                  <div className="px-6">
                    <h3 className="text-[13px] text-zinc-500 mb-4 flex items-center gap-2 font-inter font-inter"><Tag size={12} /> Item matches</h3>
                    <div className="space-y-2">
                      {matchingListings.length > 0 ? (
                        matchingListings.slice(0, 5).map(item => (
                          <div key={item.id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-zinc-50 cursor-pointer group transition-colors" onClick={() => openListing(item.id)}>
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100">
                              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-bold text-zinc-900 truncate font-inter font-inter">{item.title}</p>
                              <p className="text-[12px] text-zinc-500 font-inter font-inter">£{item.price} • {item.condition}</p>
                            </div>
                            <ChevronRightIcon size={16} className="text-zinc-300"/>
                          </div>
                        ))
                      ) : <p className="text-sm text-zinc-400 italic px-4 font-inter font-inter">No quick matches for "{searchQuery}"...</p>}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-zinc-50 px-8 py-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-400 font-inter font-inter">Press enter to see all results</span>
                <span className="text-[13px] font-semibold text-blue-600 cursor-pointer hover:underline font-inter font-inter" onClick={() => handleSearchSubmit(searchQuery)}>View all results</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-zinc-500">
              <button className="hover:text-zinc-900 transition-all"><Bell size={22} strokeWidth={1.5} /></button>
              <button className="hover:text-zinc-900 transition-all"><ShoppingCart size={22} strokeWidth={1.5} /></button>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 ml-2 shadow-sm flex items-center gap-1.5">
              Sell <Plus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 ml-2 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {!isSearchView ? (
          <>
            <div className="relative">
              <div className="sticky top-16 z-40 bg-white/40 backdrop-blur-md border-b border-zinc-200/40 transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-16">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-tight font-inter">
                    {activeCategory !== null ? (
                      <>Browsing <span className="text-zinc-400">{categories[activeCategory].label}</span></>
                    ) : (
                      <>Marketplace. <span className="text-zinc-400 font-bold"><TypingSubtitle text="Find everything you need for the term." /></span></>
                    )}
                  </h1>
                </div>
              </div>

              <div className="max-w-[1440px] mx-auto px-6 mt-4 pb-16">
                <section className="border-b border-zinc-200 pt-6 pb-16">
                  <div className="flex items-center justify-between mb-4"><span className="text-lg font-semibold text-zinc-900 font-inter font-inter">Categories</span></div>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                    {categories.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const nextCategory = activeCategory === idx ? undefined : categories[idx].label;
                          updateUrlParams({ category: nextCategory, q: undefined });
                          setFilterOpen(false);
                        }}
                        className={`px-7 py-3 rounded-full border text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 active:scale-90 font-inter ${activeCategory === idx ? 'bg-black border-black text-white shadow-none' : 'bg-transparent border-zinc-300 text-zinc-800'}`}
                      >
                        {link.icon} {link.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section className={`transition-all duration-500 overflow-hidden ${activeCategory !== null || filterOpen ? 'max-h-[1000px] opacity-100 pt-6' : 'max-h-0 opacity-0'}`}>
                  <div className="flex items-center justify-between w-full">
                    <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-1.5 group font-inter">
                      <span className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">Filters</span>
                      <ChevronDown size={18} className={`text-zinc-500 transition-transform duration-500 ${filterOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    <button onClick={handleClearFilters} className="text-blue-600 font-normal text-sm flex items-center gap-0.5 hover:underline transition-all active:scale-95 font-inter">
                      Clear all <span className="ml-1 text-xs"> {'>'} </span>
                    </button>
                  </div>
                  <FilterPanel 
                    isOpen={filterOpen} sortBy={sortBy} setSortBy={setSortBy} priceLimit={priceLimit} setPriceLimit={setPriceLimit}
                    selectedConditions={selectedConditions} setSelectedConditions={setSelectedConditions}
                    selectedSize={selectedSize} setSelectedSize={setSelectedSize} onApply={handleApplyFilters}
                  />
                </section>
              </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6">
              {activeCategory !== null ? (
                <section className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[60vh]">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-8">
                    {categoryLoading ? Array.from({ length: 12 }).map((_, i) => <ListingCardSkeleton key={`init-shimmer-${i}`} />) : (
                      <>
                        {categoryListings.map((item, idx) => ( <ListingCard key={item.id} listing={item} onToggleSave={handleToggleSave} onOpen={openListing} index={idx % 4} isMinimal={true} /> ))}
                        {loadingMore && Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={`more-shimmer-${i}`} />)}
                      </>
                    )}
                  </div>
                </section>
              ) : (
                <>
                  <section className="mb-24 mt-12">
                    <header className="mb-8"><h2 className="text-2xl tracking-tight font-inter font-inter"><span className="font-bold text-zinc-900">The Latest.</span> <span className="text-zinc-500 font-medium">Fresh arrivals from across campus.</span></h2></header>
                    
                    <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory pb-8 px-1">
                      {/* 1. MacBook Air M1 */}
                      <div className="flex-shrink-0 w-[85vw] md:w-[55vw] max-w-[750px] aspect-[4/3] rounded-3xl bg-zinc-900 overflow-hidden relative border border-zinc-800 shadow-2xl shadow-black/10 group cursor-pointer snap-start">
                        <LazyImage src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200" alt="MacBook" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" wrapperClassName="w-full h-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 p-8 md:p-10 text-white z-10 font-inter">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2 block font-mono">LATEST DROP</span>
                          <h3 className="text-3xl md:text-5xl font-bold leading-tight">MacBook Air M1</h3>
                          <p className="text-zinc-100 mt-2 text-base md:text-lg font-medium">Includes original box and charger.</p>
                          <div className="mt-6 md:mt-8"><button className="bg-white text-black px-6 py-2.5 rounded-full text-[11px] md:text-[13px] font-black uppercase tracking-widest transition-all hover:bg-zinc-100 active:scale-95 font-inter">View Deal</button></div>
                        </div>
                      </div>

                      {/* 2. Vintage Levi Jeans Image */}
                      <div className="flex-shrink-0 w-[85vw] md:w-[55vw] max-w-[750px] aspect-[4/3] rounded-3xl overflow-hidden relative shadow-xl shadow-black/5 border border-zinc-200 snap-start">
                        <img 
                          src="image_9ee839.jpg" 
                          alt="Vintage Levi Jeans Search" 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop";
                          }}
                        />
                        {/* Exposure reduction overlay - Lightened so the image is clearly visible */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        
                        {/* Search Bar Overlay */}
                        <div className="absolute bottom-[20%] left-4 md:left-10 right-4 md:right-auto flex">
                          <div className="w-full md:w-[480px] lg:w-[540px] h-[52px] rounded-full border border-white/70 bg-transparent flex items-center pl-5 pr-1.5 gap-3 pointer-events-none">
                            <Search size={18} className="text-white drop-shadow-md" strokeWidth={2} />
                            <div className="flex-1 text-white text-[15px] font-medium font-inter text-left truncate drop-shadow-md">
                              Vintage Levi Jeans near me
                            </div>
                            <div className="bg-[#dcdce0] text-zinc-900 px-6 md:px-8 h-[40px] rounded-full text-[14px] font-medium font-inter flex items-center justify-center shadow-sm">
                              search
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Dorm Starter Kit */}
                      <div className="flex-shrink-0 w-[85vw] md:w-[55vw] max-w-[750px] aspect-[4/3] rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden relative flex flex-col justify-between group cursor-pointer shadow-xl shadow-black/10 snap-start">
                        <LazyImage 
                          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200" 
                          alt="Dorm Room" 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90" 
                          wrapperClassName="absolute inset-0 w-full h-full" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-0" />
                        
                        <div className="p-8 md:p-10 flex-1 flex flex-col justify-center items-start gap-6 relative z-10">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm transition-transform group-hover:scale-105">
                            <Package className="text-white w-8 h-8 md:w-10 md:h-10" />
                          </div>
                          <div className="text-left font-inter">
                            <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2 md:mb-3 block font-mono">BUNDLE DEAL</span>
                            <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">Dorm Starter Kit</h3>
                            <p className="text-blue-200 font-bold text-[15px] md:text-lg mt-2">4 items · £65 · Save 30%</p>
                          </div>
                        </div>
                        <div className="px-8 pb-8 md:px-10 md:pb-10 flex items-center justify-between mt-auto relative z-10">
                          <span className="text-xs md:text-sm font-bold text-zinc-300 font-inter">Limited time university promo</span>
                          <button className="text-zinc-900 p-2 md:p-3 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
                            <ChevronRightIcon size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="mb-24 group/slider relative">
                    <div className="flex justify-between items-baseline mb-12">
                      <h2 className="text-2xl tracking-tight font-inter font-inter"><span className="font-bold text-zinc-900">New semester essentials.</span> <span className="text-zinc-500 font-medium">Set up your perfect study space.</span></h2>
                      <button className="text-blue-600 font-normal text-sm flex items-center gap-0.5 hover:underline transition-all font-inter">View all <span className="ml-1 text-xs"> {'>'} </span></button>
                    </div>
                    <div className="relative">
                      <button onClick={() => scrollEssentials('left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-zinc-100 opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-zinc-50 hover:scale-110"><ChevronLeft size={20} /></button>
                      <div ref={essentialsScrollRef} className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory px-1 pb-4">
                        {initialLoading ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <div key={`skeleton-ess-${i}`} className="w-[280px] md:w-[320px] flex-shrink-0"><ListingCardSkeleton /></div>
                          ))
                        ) : (
                          infiniteListings.slice(0, 8).map((item, idx) => (
                            <ListingCard key={`${item.id}-essentials`} listing={item} onToggleSave={handleToggleSave} onOpen={openListing} index={idx} className="w-[280px] md:w-[320px] flex-shrink-0 snap-start" />
                          ))
                        )}
                      </div>
                      <button onClick={() => scrollEssentials('right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-zinc-100 opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-zinc-50 hover:scale-110"><ChevronRight size={20} /></button>
                    </div>
                  </section>

                  <section className="mb-24">
                    <div className="mb-12"><h2 className="text-2xl tracking-tight font-inter font-inter"><span className="font-bold text-zinc-900">What you might like.</span> <span className="text-zinc-500 font-medium">Curated based on your interests.</span></h2></div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                      {initialLoading ? Array.from({ length: 12 }).map((_, i) => <ListingCardSkeleton key={`skeleton-grid-${i}`} />) : (
                        <>
                          {infiniteListings.map((item, idx) => (<ListingCard key={item.id} listing={item} onToggleSave={handleToggleSave} onOpen={openListing} index={idx % 4} />))}
                          {loadingMore && Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={`skeleton-more-${i}`} />)}
                        </>
                      )}
                    </div>
                  </section>
                </>
              )}
              
              <div ref={loaderRef} className="py-24 flex flex-col items-center justify-center gap-4">
                {showEndState && !initialLoading && !categoryLoading && (
                  <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Check className="text-zinc-300" size={24} strokeWidth={1.5} />
                    <p className="text-[13px] text-zinc-400 font-medium font-inter">You've reached the end</p>
                  </div>
                )}
                {!showEndState && !initialLoading && !categoryLoading && !loadingMore && (
                  <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-[0.2em] animate-pulse font-mono font-mono">Scroll to discover more</p>
                )}
                {loadingMore && (
                  <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-[0.2em] font-mono font-mono">Loading more items...</p>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Search Results View */
          <div className="max-w-[1440px] mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-4 flex flex-col gap-6">
              <div className="pt-8 pb-12">
                <button onClick={() => { setFilterOpen(false); updateUrlParams({ q: undefined, category: undefined, sort: undefined, max_price: undefined, condition: [] }); }} className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-6 hover:underline block font-mono font-mono">← Back to browse</button>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-tight font-inter">
                  Results for <span className="text-zinc-400 font-bold">"{searchParams.get('q') || searchQuery}"</span>
                </h2>
                <p className="mt-4 text-zinc-500 font-medium font-inter pl-1 font-inter">Found {totalItems} items matching your search.</p>
              </div>
              
              <div className="border-b border-zinc-200 pb-2">
                <div className="flex items-center justify-between w-full">
                  <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 py-4 group font-inter">
                    <SlidersHorizontal size={18} className={`${filterOpen ? 'text-blue-600' : 'text-zinc-400'} transition-colors`} />
                    <span className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">Filters</span>
                    <ChevronDown size={18} className={`text-zinc-500 transition-transform duration-500 ${filterOpen ? 'rotate-180 text-blue-600' : ''}`} strokeWidth={1.5} />
                  </button>
                  <button onClick={handleClearFilters} className="text-blue-600 font-normal text-sm flex items-center gap-0.5 hover:underline transition-all active:scale-95 font-inter font-inter">
                    Clear all <span className="ml-1 text-xs"> {'>'} </span>
                  </button>
                </div>
                <FilterPanel isOpen={filterOpen} sortBy={sortBy} setSortBy={setSortBy} priceLimit={priceLimit} setPriceLimit={setPriceLimit} selectedConditions={selectedConditions} setSelectedConditions={setSelectedConditions} selectedSize={selectedSize} setSelectedSize={setSelectedSize} onApply={handleApplyFilters} />
              </div>
            </header>

            {infiniteListings.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-12">
                {infiniteListings.map((item, idx) => (<ListingCard key={item.id} listing={item} onToggleSave={handleToggleSave} onOpen={openListing} index={idx} isMinimal={true} />))}
              </div>
            ) : (
              <div className="py-24">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-8"><Search size={40} className="text-zinc-300" /></div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2 font-inter font-inter font-inter">We couldn't find that.</h3>
                  <p className="text-zinc-500 max-w-sm mb-10 font-medium font-inter font-inter font-inter">Try searching for broader terms or check our categories for related items.</p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-24 font-inter">
                    <button className="px-7 py-3 rounded-full border border-zinc-300 text-sm font-medium text-zinc-800 bg-transparent hover:border-zinc-400 transition-all active:scale-90 flex items-center gap-2 font-inter font-inter"><Bell size={16} /> Notify me when listed</button>
                    <button onClick={() => { setFilterOpen(false); setSearchParams(new URLSearchParams()); }} className="px-7 py-3 rounded-full border border-zinc-300 text-sm font-medium text-zinc-800 bg-transparent hover:border-zinc-400 transition-all active:scale-90 flex items-center gap-2 font-inter font-inter"><Search size={16} /> Browse all items</button>
                  </div>
                </div>

                <section className="mt-24 pt-16 border-t border-zinc-200/60">
                  <header className="mb-12">
                    <h2 className="text-2xl tracking-tight font-inter">
                      <span className="font-bold text-zinc-900 font-inter font-inter font-inter">Related items.</span> <span className="text-zinc-500 font-medium font-inter font-inter font-inter">Similar items you might have meant.</span>
                    </h2>
                  </header>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {infiniteListings.slice(0, 4).map((item, idx) => ( <ListingCard key={`${item.id}-suggestion`} listing={item} onToggleSave={handleToggleSave} onOpen={openListing} index={idx} isMinimal={true} /> ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        <footer className="bg-[#f5f5f7] border-t border-zinc-200/50 mt-32">
          <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-24 text-[12px] text-zinc-500">
            <div className="flex items-center gap-2 pb-6 border-b border-zinc-200 mb-8 text-zinc-400 font-inter">
              <span className="text-zinc-900 font-bold hover:text-blue-600 transition-colors cursor-pointer font-inter font-inter font-inter" onClick={() => { setFilterOpen(false); setSearchParams(new URLSearchParams()); }}>CS</span>
              <ChevronRightIcon size={12} />
              <span className="text-zinc-900 font-inter font-inter font-inter">Browse</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              {[
                { title: "Shop", links: ["Textbooks", "Electronics", "Clothing", "Kitchen & Dining", "Sports Gear"] },
                { title: "Account", links: ["Manage Profile", "Saved Items", "Swap History", "Settings"] },
                { title: "Marketplace", links: ["List an Item", "Bundles", "Verified Swappers", "Safety Guidelines"] },
                { title: "Help", links: ["FAQ", "Contact Us", "Campus Rules", "Report an Issue"] },
                { title: "Swap Values", links: ["Sustainability", "Community First", "Student Safety", "Verified Exchanges"] }
              ].map((group) => (
                <div key={group.title} className="space-y-2">
                  <h4 className="text-zinc-900 font-bold font-inter font-inter font-inter">{group.title}</h4>
                  <ul className="space-y-1 font-inter">{group.links.map(l => <li key={l} className="hover:underline hover:text-zinc-900 cursor-pointer transition-colors font-inter font-inter">{l}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Source+Code+Pro:wght@400;500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Source Code Pro', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { -webkit-font-smoothing: antialiased; background-color: #f5f5f7; }
        input:focus { outline: none; box-shadow: none; }
        .animate-pulse-subtle { animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .reveal-staggered { opacity: 0; transform: translateY(20px); animation: revealFade 0.6s ease forwards; animation-delay: var(--stagger-delay); }
        @keyframes revealFade { to { opacity: 1; transform: translateY(0); } }
        input[type="range"] { -webkit-appearance: none; background: transparent; }
        input[type="range"]::-webkit-slider-runnable-track { width: 100%; height: 4px; background: #e2e2e7; border-radius: 2px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #000; margin-top: -8px; cursor: pointer; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease; }
        input[type="range"]::-webkit-slider-thumb:active { transform: scale(0.9); background: #3b82f6; }
      `}} />
    </div>
  );
};

export default App;
