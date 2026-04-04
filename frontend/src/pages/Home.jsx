/**
 * Home Page - shown after login
 */
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user, logout } = useAuth()
  
  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl flex justify-between items-center w-full px-12 py-5 max-w-full sticky top-0 z-50 border-b border-outline-variant/50">
        <div className="text-lg font-bold font-['Source_Code_Pro'] text-on-surface tracking-tighter">CAMPUSPLUG</div>
        <div className="flex items-center gap-8">
          <span className="text-sm text-on-surface-variant">
            Welcome, <span className="font-medium text-on-surface">{user?.username}</span>
          </span>
          <button 
            onClick={logout}
            className="text-[11px] font-semibold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            LOG OUT
          </button>
        </div>
      </header>
      
      <main className="min-h-screen bg-surface-container/30 p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-medium">
              DASHBOARD
            </span>
            <h1 className="font-headline text-4xl font-semibold tracking-tight text-on-surface">
              Welcome to CampusPlug
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed font-light">
              You're logged in! This is where listings, messages, and your wallet will appear.
            </p>
          </div>
          
          {/* User Info Card */}
          <div className="bg-white p-8 rounded-2xl apple-shadow border border-outline-variant/30">
            <h2 className="font-headline font-semibold text-lg text-on-surface mb-6">Your Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary">Username</span>
                <p className="font-medium text-on-surface">{user?.username}</p>
              </div>
              <div>
                <span className="text-secondary">Email</span>
                <p className="font-medium text-on-surface">{user?.email}</p>
              </div>
              <div>
                <span className="text-secondary">University</span>
                <p className="font-medium text-on-surface">{user?.university}</p>
              </div>
              <div>
                <span className="text-secondary">Verified</span>
                <p className="font-medium text-on-surface">
                  {user?.is_verified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-amber-600">Pending verification</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-secondary">Rating</span>
                <p className="font-medium text-on-surface">{user?.rating?.toFixed(1)} ★</p>
              </div>
              <div>
                <span className="text-secondary">Carbon Saved</span>
                <p className="font-medium text-on-surface">{user?.carbon_saved?.toFixed(1)} kg</p>
              </div>
            </div>
          </div>
          
          {/* Coming Soon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Browse Listings', 'Messages', 'Wallet'].map((feature) => (
              <div 
                key={feature}
                className="bg-white p-8 rounded-2xl apple-shadow border border-outline-variant/30 flex flex-col items-center justify-center text-center h-48"
              >
                <span className="material-symbols-outlined text-4xl text-outline mb-4">
                  {feature === 'Browse Listings' ? 'storefront' : feature === 'Messages' ? 'chat' : 'wallet'}
                </span>
                <h3 className="font-headline font-medium text-on-surface">{feature}</h3>
                <p className="text-sm text-secondary mt-1">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
