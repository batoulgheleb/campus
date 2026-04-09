import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Package
} from 'lucide-react';
import { listings as listingsApi } from '../api';

/**
 * CampusSwap - Create Listing Page
 * - Isolated View: Focused exclusively on the "List Your Item" flow.
 * - Updated: AI Price Suggestion now features a realistic 3-row skeleton loader for both price and text.
 * - Updated: Price fields and currency symbols use Apple System Font (SF Pro style).
 * - Updated: Reduced corner radius for Pricing, AI Suggestion, and Bundle boxes to rounded-xl.
 */

// --- STATIC DATA ---

const categories = [
  { label: 'Clothing & Shoes', icon: 'shirt' },
  { label: 'Digital Electronics', icon: 'laptop' },
  { label: 'Books', icon: 'book' },
  { label: 'Furniture & Decor', icon: 'table' },
  { label: 'Bikes', icon: 'bike' },
  { label: 'Kitchen & Dining', icon: 'utensils' },
  { label: 'Gaming', icon: 'gamepad' },
  { label: 'Accessories', icon: 'watch' },
  { label: 'Sports Gear', icon: 'trophy' },
  { label: 'Housing', icon: 'home' }
];

const categoryFields = {
  'Clothing & Shoes': [
    { label: 'size', type: 'select', options: ['S', 'M', 'L', 'XL', 'OS'] },
    { label: 'colour', type: 'select', options: ['Black', 'White', 'Grey', 'Navy', 'Red', 'Multi'] },
    { label: 'gender', type: 'select', options: ['Unisex', 'Mens', 'Womens'] },
    { label: 'brand', type: 'text', placeholder: 'e.g. Patagonia' }
  ],
  'Digital Electronics': [
    { label: 'brand', type: 'text', placeholder: 'e.g. Apple' },
    { label: 'storage capacity', type: 'text', placeholder: 'e.g. 256GB' },
    { label: 'screen size', type: 'text', placeholder: 'e.g. 13-inch' }
  ],
  'Books': [
    { label: 'subject', type: 'text', placeholder: 'e.g. Stem, Humanities' },
    { label: 'edition', type: 'text', placeholder: 'e.g. 4th Edition' },
    { label: 'ISBN', type: 'text', placeholder: '13-digit number' },
    { label: 'year', type: 'text', placeholder: 'e.g. 2023' }
  ],
  'Furniture & Decor': [
    { label: 'dimensions', type: 'text', placeholder: 'e.g. 120x60x75cm' },
    { label: 'collection only', type: 'toggle' }
  ],
  'Bikes': [
    { label: 'frame size', type: 'text', placeholder: 'e.g. 54cm' },
    { label: 'type', type: 'select', options: ['Road', 'Mountain', 'Hybrid', 'BMX'] }
  ],
  'Kitchen & Dining': [
    { label: 'brand', type: 'text', placeholder: 'e.g. Ninja, Le Creuset' },
    { label: 'material', type: 'text', placeholder: 'e.g. Ceramic, Steel' }
  ],
  'Gaming': [
    { label: 'platform', type: 'select', options: ['PC', 'PS5', 'Xbox Series X', 'Nintendo Switch'] }
  ],
  'Accessories': [
    { label: 'type', type: 'select', options: ['Watches', 'Jewellery', 'Bags', 'Eyewear'] }
  ],
  'Sports Gear': [
    { label: 'sport', type: 'text', placeholder: 'e.g. Tennis, Football' },
    { label: 'size', type: 'text', placeholder: 'e.g. Men\'s 9, Adult OS' }
  ]
};

const App = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('edit');
  const [selectedCategory, setSelectedCategory] = useState('Books');
  const [aiPriceLoading, setAiPriceLoading] = useState(true);
  const [suggestedRange, setSuggestedRange] = useState("£45.00 - £62.00");
  const [isPosting, setIsPosting] = useState(false);
  const [bundleChoice, setBundleChoice] = useState(null);
  const [condition, setCondition] = useState('Like new');
  const [imageUrl, setImageUrl] = useState('');
  const [size, setSize] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loadingEditData, setLoadingEditData] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const isFormValid = title.trim() !== '' && description.trim() !== '' && price.trim() !== '';

  const appleFontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

  useEffect(() => {
    setAiPriceLoading(true);
    const timer = setTimeout(() => {
      setAiPriceLoading(false);
      const base = Math.floor(Math.random() * 50) + 10;
      setSuggestedRange(`£${base}.00 - £${base + 15}.00`);
    }, 1800); // Slightly longer for better visual of the new skeleton
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  useEffect(() => {
    const loadEditListing = async () => {
      if (!editingId) return;
      setLoadingEditData(true);
      setFormError('');
      try {
        const listing = await listingsApi.get(editingId);
        setTitle(listing.title || '');
        setDescription(listing.description || '');
        setPrice(String(listing.price ?? ''));
        setSelectedCategory(listing.category || 'Books');
        setCondition(listing.condition || 'Like new');
        setSize(listing.size || '');
        setImageUrl(listing.images?.[0] || '');
      } catch (error) {
        setFormError(error.message || 'Failed to load listing for edit.');
      } finally {
        setLoadingEditData(false);
      }
    };
    loadEditListing();
  }, [editingId]);

  const handlePostItem = async () => {
    if (!isFormValid || isPosting || loadingEditData) return;
    setIsPosting(true);
    setFormError('');
    setFormSuccess('');
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category: selectedCategory,
        condition,
        size: size.trim() || undefined,
        images: [imageUrl.trim() || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"],
      };

      const result = editingId
        ? await listingsApi.update(editingId, payload)
        : await listingsApi.create(payload);

      setFormSuccess(editingId ? 'Listing updated successfully.' : 'Listing posted successfully.');
      setTimeout(() => {
        navigate(`/listing/${result.id}?from=${encodeURIComponent('/browse')}`);
      }, 300);
    } catch (error) {
      setFormError(error.message || (editingId ? 'Failed to update listing.' : 'Failed to post listing.'));
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-100 selection:text-blue-700 font-inter">
      
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-200/30">
        <div className="flex items-center justify-between px-6 py-3 w-full max-w-[1440px] mx-auto relative z-50">
          <div className="flex items-center gap-8">
            <a className="text-xl font-black tracking-tighter text-zinc-900 cursor-pointer font-inter" onClick={() => navigate('/browse')}>CS</a>
            <nav className="hidden md:flex items-center gap-6">
              <a className="font-semibold text-sm tracking-tight cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors" onClick={() => navigate('/browse')}>Browse</a>
              <a className="text-zinc-400 font-medium hover:text-zinc-800 transition-colors text-sm tracking-tight cursor-pointer">Bundles</a>
            </nav>
          </div>
          
          <div className="flex-1 max-w-2xl px-8 hidden sm:block relative">
            <div className="relative group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                className="w-full h-11 pl-12 pr-4 bg-zinc-100/80 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-zinc-400" 
                placeholder="Search campus..." 
                type="text"
                disabled
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-zinc-500 font-inter">
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all font-inter"><Bell size={22} strokeWidth={1.5} /></button>
              <button className="p-2 hover:bg-zinc-100/50 rounded-lg transition-all font-inter"><ShoppingCart size={22} strokeWidth={1.5} /></button>
            </div>
            <button className="px-5 py-2.5 rounded-lg text-sm font-bold bg-zinc-900 text-white shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform font-inter">
              Sell <Plus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 ml-2 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 font-inter">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-tight mb-4 font-inter font-inter">{editingId ? 'Edit Listing' : 'List Your Item'}</h1>
            <p className="text-base text-zinc-500 font-medium max-w-2xl leading-relaxed font-inter font-inter font-inter">
              Create a high-fidelity listing for the student community. Quality photos and detailed info attract the best offers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 font-inter">
            
            <div className="lg:col-span-7 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              
              <section>
                <h2 className="text-[13px] font-medium text-zinc-500 mb-6 font-inter font-inter font-inter">Upload photos</h2>
                <div className="grid grid-cols-4 gap-4 font-inter">
                  <div className="col-span-4 aspect-[16/10] bg-white rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 hover:border-blue-400 transition-all group cursor-pointer font-inter">
                    <Camera size={32} className="text-zinc-300 group-hover:scale-110 group-hover:text-blue-500 transition-all mb-3 font-inter font-inter" />
                    <span className="text-sm font-semibold text-zinc-500 font-inter font-inter">Add primary image</span>
                  </div>
                  <div className="col-span-4">
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-[15px] focus:ring-2 focus:ring-blue-100 transition-all outline-none font-inter"
                      placeholder="Primary image URL (optional for now)"
                      type="url"
                    />
                  </div>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-200 hover:border-blue-400 transition-all cursor-pointer group font-inter">
                      <Plus size={20} className="text-zinc-300 group-hover:text-blue-500 transition-colors font-inter" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8 font-inter font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 font-inter font-inter">Item details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-900 mb-3 font-inter">Item title</label>
                    <input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-[15px] focus:ring-2 focus:ring-blue-100 transition-all outline-none font-inter font-inter" 
                      placeholder="e.g., Organic Chemistry 4th Ed" 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-900 mb-3 font-inter font-inter">Category</label>
                    <div className="relative font-inter">
                      <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-[15px] outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100 font-inter font-inter font-inter font-inter"
                      >
                        {categories.map(cat => <option key={cat.label} value={cat.label}>{cat.label}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  {(selectedCategory === 'Clothing & Shoes' || selectedCategory === 'Sports Gear') && (
                    <div>
                      <label className="block text-sm font-bold text-zinc-900 mb-3 font-inter">Size</label>
                      <input
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-[15px] focus:ring-2 focus:ring-blue-100 transition-all outline-none font-inter"
                        placeholder="e.g., M, UK 9, OS"
                        type="text"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-zinc-900 mb-3 font-inter font-inter font-inter">Detailed description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-[15px] outline-none h-40 resize-none focus:ring-2 focus:ring-blue-100 font-inter font-inter" 
                      placeholder="Describe the item's condition, features, or why you're selling it..."
                    ></textarea>
                  </div>
                </div>
              </section>

              <section className="animate-in fade-in slide-in-from-bottom-2 duration-500 font-inter font-inter font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 mb-6">Item specifics</h2>
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100 font-inter font-inter">
                  <div className="flex items-center px-6 py-5">
                    <label className="w-1/3 text-sm font-bold text-zinc-900 font-inter font-inter font-inter">Condition</label>
                    <div className="w-2/3 relative font-inter font-inter">
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-[15px] text-zinc-600 focus:ring-0 appearance-none cursor-pointer font-inter"
                      >
                        <option>New</option>
                        <option>Like new</option>
                        <option>Very good</option>
                        <option>Fair</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  {categoryFields[selectedCategory]?.map((field) => (
                    <div key={field.label} className="flex items-center px-6 py-5 font-inter font-inter">
                      <label className="w-1/3 text-sm font-bold text-zinc-900 capitalize font-inter font-inter font-inter">{field.label}</label>
                      <div className="w-2/3 relative font-inter font-inter font-inter">
                        {field.type === 'text' && (
                          <input 
                            type="text" 
                            placeholder={field.placeholder} 
                            className="w-full bg-transparent border-none p-0 text-[15px] text-zinc-600 focus:ring-0 placeholder:text-zinc-300 font-inter font-inter"
                          />
                        )}
                        {field.type === 'select' && (
                          <>
                            <select className="w-full bg-transparent border-none p-0 text-[15px] text-zinc-600 focus:ring-0 appearance-none cursor-pointer font-inter font-inter">
                              <option value="">Select {field.label}</option>
                              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                          </>
                        )}
                        {field.type === 'toggle' && (
                          <div className="flex items-center font-inter font-inter">
                            <input type="checkbox" className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-0 transition-colors font-inter font-inter" />
                            <span className="ml-3 text-[13px] text-zinc-400 font-medium font-inter">Toggle for bulky items</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-start gap-2 px-1 font-inter font-inter font-inter">
                  <Info size={14} className="text-zinc-300 mt-0.5" />
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-inter font-inter">
                    Accurate specifics help your item appear in filtered searches. Buyers are 40% more likely to purchase items with full details.
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column: Pricing, Bundle, and Delivery */}
            <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-right-6 duration-700 delay-300 font-inter">
              
              <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-xl shadow-zinc-200/40">
                <h2 className="text-[13px] font-medium text-zinc-500 mb-6 font-inter font-inter">Pricing and delivery</h2>
                <div className="mb-8 font-inter font-inter font-inter">
                  <label className="block text-sm font-bold text-zinc-900 mb-3">Asking price</label>
                  <div className="relative font-inter">
                    <span 
                      style={{ fontFamily: appleFontStack }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-zinc-400"
                    >
                      £
                    </span>
                    <input 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{ fontFamily: appleFontStack }}
                      className="w-full bg-zinc-50 border-none rounded-xl p-5 pl-10 text-3xl font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 font-inter font-inter" 
                      placeholder="0.00" 
                      type="number"
                    />
                  </div>
                </div>

                {/* AI Suggestion Logic with 3-Row Skeleton */}
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-8 font-inter font-inter">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkle className="text-blue-600 font-inter" size={16} />
                    <span className="text-[11px] font-medium text-blue-600 font-inter">AI Price Suggestion</span>
                  </div>
                  
                  {aiPriceLoading ? (
                    <div className="space-y-4 font-inter font-inter">
                      {/* Row 1: The Price bar (Thicker, medium length) */}
                      <div className="h-7 w-3/4 bg-blue-100/50 animate-pulse rounded-md" />
                      
                      {/* Row 2: Text line 1 (Thinner, full length) */}
                      <div className="h-2.5 w-full bg-blue-100/30 animate-pulse rounded-sm" />
                      
                      {/* Row 3: Text line 2 (Thinner, partial length) */}
                      <div className="h-2.5 w-4/5 bg-blue-100/30 animate-pulse rounded-sm" />
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-700 font-inter">
                      <div 
                        style={{ fontFamily: appleFontStack }}
                        className="text-2xl font-semibold text-zinc-900 tracking-tight"
                      >
                        {suggestedRange}
                      </div>
                      <p className="text-[12px] text-zinc-500 mt-2 leading-relaxed font-inter font-inter font-inter font-inter font-inter">
                        Based on 12 recent sales of similar items at your campus library exchange.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <section>
                <h2 className="text-[13px] font-medium text-zinc-500 mb-6 font-inter font-inter font-inter">Bundle this item?</h2>
                <div className="grid grid-cols-2 gap-3 font-inter font-inter">
                  <button 
                    onClick={() => setBundleChoice('existing')}
                    className={`flex flex-col items-start justify-center py-4 px-5 rounded-xl border-2 transition-all duration-300 text-left group
                      ${bundleChoice === 'existing' 
                        ? 'border-[#0071e3] bg-transparent' 
                        : 'border-zinc-200 bg-transparent hover:border-zinc-300'}`}
                  >
                    <span className={`text-[15px] font-normal mb-1 ${bundleChoice === 'existing' ? 'text-[#0071e3]' : 'text-zinc-900'}`}>Add to existing</span>
                    <span className="text-[10px] text-zinc-400 font-medium leading-tight">Bundle with your current listings.</span>
                  </button>
                  <button 
                    onClick={() => setBundleChoice('new')}
                    className={`flex flex-col items-start justify-center py-4 px-5 rounded-xl border-2 transition-all duration-300 text-left group
                      ${bundleChoice === 'new' 
                        ? 'border-[#0071e3] bg-transparent' 
                        : 'border-zinc-200 bg-transparent hover:border-zinc-300'}`}
                  >
                    <span className={`text-[15px] font-normal mb-1 ${bundleChoice === 'new' ? 'text-[#0071e3]' : 'text-zinc-900'}`}>Create new</span>
                    <span className="text-[10px] text-zinc-400 font-medium leading-tight">Start a fresh bundle for this item.</span>
                  </button>
                </div>
              </section>

              <section className="space-y-5 font-inter">
                <h2 className="text-[13px] font-medium text-zinc-500 font-inter">Delivery options</h2>
                <div className="space-y-5 px-1 font-inter font-inter font-inter">
                  <div className="flex gap-4 items-start text-left font-inter font-inter font-inter">
                    <Truck size={20} className="text-zinc-900 mt-0.5 font-inter" strokeWidth={1.5} />
                    <div className="flex-1 font-inter font-inter font-inter font-inter">
                       <p className="text-[13px] font-bold text-zinc-900 leading-none">Delivery:</p>
                       <p className="text-[13px] text-zinc-900 mt-1 leading-snug">Domestic Shipping</p>
                       <button className="text-[12px] text-blue-600 hover:underline mt-0.5 block text-left">
                          Customise your delivery options in settings
                       </button>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start text-left font-inter font-inter font-inter">
                    <Package size={20} className="text-zinc-900 mt-0.5" strokeWidth={1.5} />
                    <div className="flex-1 font-inter font-inter font-inter font-inter font-inter">
                       <p className="text-[13px] font-bold text-zinc-900 leading-none font-inter">Pickup:</p>
                       <p className="text-[13px] text-zinc-900 mt-1 leading-snug">Local Pickup (On-Campus)</p>
                       <button className="text-[12px] text-blue-600 hover:underline mt-0.5 block text-left">
                          Discuss with buyer for availability
                       </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-4 font-inter">
                <button 
                  onClick={handlePostItem}
                  disabled={!isFormValid || isPosting || loadingEditData}
                  className={`w-full py-4 rounded-2xl text-[15px] font-medium text-white transition-all transform active:scale-95 flex items-center justify-center font-inter font-inter font-inter
                    ${isFormValid 
                      ? 'bg-[#0071e3] hover:bg-[#0077ed]' 
                      : 'bg-[#9CBDEA]/60 cursor-not-allowed'}
                    ${isPosting ? 'opacity-60 scale-[0.98]' : ''}`}
                >
                  {loadingEditData ? 'Loading listing...' : isPosting ? (editingId ? 'Saving...' : 'Posting...') : (editingId ? 'Save changes' : 'Post item')}
                </button>
                {formError && <p className="text-sm text-rose-600 mt-3">{formError}</p>}
                {formSuccess && <p className="text-sm text-emerald-600 mt-3">{formSuccess}</p>}
                
                <div className="text-left mt-8 space-y-4 px-1 font-inter font-inter font-inter font-inter">
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-inter font-inter font-inter font-inter">
                    By posting, you agree to our academic integrity policy and student safety guidelines. Listings are reviewed for authenticity.
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-inter font-inter font-inter font-inter font-inter">
                    All payments must be done through the app although pickup is an option. Buyer will always pay for the delivery fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#f5f5f7] border-t border-zinc-200/50 mt-32 font-inter font-inter">
        <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-24 text-[12px] text-zinc-500 font-inter">
          <div className="flex items-center gap-2 pb-6 border-b border-zinc-200 mb-8 text-zinc-400 font-inter font-inter">
            <span className="text-zinc-900 font-bold hover:text-blue-600 transition-colors cursor-pointer font-inter font-inter font-inter font-inter font-inter">CS</span>
            <ChevronRight size={12} />
            <span className="text-zinc-900 font-medium font-inter">List an item</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 font-inter">
            {[
              { title: "Shop", links: ["Textbooks", "Electronics", "Clothing", "Kitchen & Dining", "Sports Gear"] },
              { title: "Account", links: ["Manage Profile", "Saved Items", "Swap History", "Settings"] },
              { title: "Marketplace", links: ["List an Item", "Bundles", "Verified Swappers", "Safety Guidelines"] },
              { title: "Help", links: ["FAQ", "Contact Us", "Campus Rules", "Report an Issue"] },
              { title: "Swap Values", links: ["Sustainability", "Community First", "Student Safety", "Verified Exchanges"] }
            ].map((group) => (
              <div key={group.title} className="space-y-2 font-inter">
                <h4 className="text-zinc-900 font-bold font-inter">{group.title}</h4>
                <ul className="space-y-1 font-inter">
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
        .font-mono { font-family: 'Source Code Pro', monospace; }
        body { -webkit-font-smoothing: antialiased; background-color: #f5f5f7; }
        input:focus { outline: none; box-shadow: none; }
        select:focus { outline: none; box-shadow: none; }
        .animate-pulse-subtle { animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}} />
    </div>
  );
};

export default App;
