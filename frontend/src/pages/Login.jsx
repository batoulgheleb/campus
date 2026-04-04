/**
 * Login Page - converted from login.html
 * 
 * React components return JSX (looks like HTML but is JavaScript).
 * Key differences from HTML:
 * - class → className (class is reserved in JS)
 * - onclick → onClick (camelCase events)
 * - We use useState to track form input values
 * - We use useNavigate to redirect after login
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, error } = useAuth()
  
  // Form state - each input needs its own state variable
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()  // Prevent page reload (default form behavior)
    setFormError('')
    setIsLoading(true)
    
    try {
      await login(email, password)
      navigate('/')  // Redirect to home on success
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <main className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Left Column: Gallery Slideshow */}
        <section className="hidden lg:flex lg:w-[45%] flex-col px-24 py-32 gap-16 overflow-hidden sticky top-0 h-screen bg-surface-container/30">
          <div className="space-y-6">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-medium">
              WELCOME BACK
            </span>
            <h1 className="font-headline text-6xl font-semibold leading-[1.1] tracking-tight text-on-surface">
              Your Campus<br />Marketplace.
            </h1>
            <p className="text-on-surface-variant text-xl max-w-md leading-relaxed font-light">
              Sign in to browse listings, message sellers, and manage your wallet.
            </p>
          </div>
          
          {/* Product Gallery */}
          <div className="relative w-full">
            <div className="flex gap-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-12">
              {/* Card 1 */}
              <div className="min-w-[320px] bg-white p-8 rounded-2xl apple-shadow flex flex-col gap-6 snap-center border border-outline-variant/30">
                <div className="bg-surface-container rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8">
                  <img 
                    className="w-full h-full object-contain mix-blend-multiply" 
                    alt="Modern minimalist tablet on a clean white desk"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwdpp_JyPC9EMgrE1h7YIOM41FwlnR1wZo7b4iV5bQLeXVI0IIX_Wg6Vfx7l1HmS0h-WsOp6lxGxiDLY8ubuwfGOydo9sT6EDHXFzSTIXsO7hVAwK6yoDY_NDbGcYa2alhTaHggeQIdKW3pQG_CJYZBusaH4ohe-h_mIxsasOGISDamf2w8idgElDzMBHkspORMyRsEwYDX9siEW-hc4oyS652YltcO4BMdU6XMDho5V2_GVpIlDGvZL3ZnWehMQ1jT06zqq28-n4t"
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-headline font-medium text-base text-on-surface">iPad Pro M2</h3>
                    <p className="font-body text-sm text-secondary mt-0.5">£749.00</p>
                  </div>
                  <span className="text-[10px] font-label bg-surface-container text-on-surface-variant px-3 py-1 rounded-full uppercase tracking-wider border border-outline-variant">
                    Like New
                  </span>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="min-w-[320px] bg-white p-8 rounded-2xl apple-shadow flex flex-col gap-6 snap-center border border-outline-variant/30">
                <div className="bg-surface-container rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8">
                  <img 
                    className="w-full h-full object-contain mix-blend-multiply" 
                    alt="Professional camera lens"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD8eWBaQ_rj41plW5NTuQYpvjYoKbyRv6FbtS3cIT-St8yB1MixxyruxwCNUGs2Burvm_8-e8AWttO515C0e8A_J4Q_pJAxKyrEbYy61sg4c1UOKOnGoAYwEdxm5SRkaJBmHHODGjMOs9R5vBxlY3TbNqFQv9YImLq0H6DuLdBsmlmprJkvm6zZaohQTW6FRcTOAuh6OAm74ZgQtCLjlJjBi27Nlm-85O335289lGzbUEUO5-dkyft55TX1OiyktZsiq19iNPUP1wq"
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-headline font-medium text-base text-on-surface">Sony 85mm f1.8</h3>
                    <p className="font-body text-sm text-secondary mt-0.5">£320.00</p>
                  </div>
                  <span className="text-[10px] font-label bg-surface-container text-on-surface-variant px-3 py-1 rounded-full uppercase tracking-wider border border-outline-variant">
                    Used
                  </span>
                </div>
              </div>
            </div>
            
            {/* Indicators */}
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-on-surface rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-outline rounded-full"></div>
            </div>
          </div>
        </section>
        
        {/* Right Column: Login Form */}
        <section className="w-full lg:w-[55%] flex items-center justify-center px-12 py-24 lg:py-32">
          <div className="w-full max-w-lg space-y-16">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-semibold tracking-tight text-on-surface">Log in</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed font-light">Enter your details to continue.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Error message */}
              {formError && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}
              
              <div className="space-y-8">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="font-body text-[13px] text-on-surface-variant font-medium ml-1">
                    University Email
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full apple-input bg-white px-5 py-4 text-on-surface placeholder:text-secondary/50 rounded-xl transition-all" 
                    placeholder="student@university.ac.uk"
                    required
                  />
                </div>
                
                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="font-body text-[13px] text-on-surface-variant font-medium">Password</label>
                    <a className="text-[12px] text-primary hover:underline underline-offset-4 font-medium" href="#">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full apple-input bg-white px-5 py-4 pr-12 text-on-surface rounded-xl transition-all" 
                      placeholder="••••••••"
                      required
                    />
                    <span 
                      className="material-symbols-outlined absolute right-4 bottom-4 text-secondary cursor-pointer hover:text-on-surface transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="space-y-10">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-[#0071e3]/50 text-white font-headline font-semibold py-4 px-8 rounded-full transition-all transform active:scale-[0.99] text-base"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
                
                {/* Divider */}
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-outline-variant/50"></div>
                  <span className="flex-shrink mx-6 text-[11px] font-label text-secondary tracking-widest uppercase">OR</span>
                  <div className="flex-grow border-t border-outline-variant/50"></div>
                </div>
                
                {/* Google Login */}
                <button 
                  type="button"
                  className="w-full py-4 bg-white border border-outline-variant rounded-full flex items-center justify-center gap-3 hover:bg-surface-container/20 transition-all group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-headline font-medium text-sm text-on-surface">Continue with Google</span>
                </button>
                
                <div className="text-center pt-2">
                  <p className="text-sm text-secondary font-light">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-medium hover:underline underline-offset-4">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-16 flex flex-col items-center gap-8 w-full border-t border-outline-variant/30">
        <div className="text-on-surface font-['Source_Code_Pro'] font-bold tracking-tighter text-lg">CAMPUS SWAP</div>
        <div className="flex gap-10">
          <a className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary hover:text-primary transition-all" href="#">PRIVACY</a>
          <a className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary hover:text-primary transition-all" href="#">TERMS</a>
          <a className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary hover:text-primary transition-all" href="#">SUPPORT</a>
        </div>
        <p className="font-body text-[10px] uppercase tracking-widest text-secondary font-medium opacity-50">© 2026 CAMPUSWAP</p>
      </footer>
    </>
  )
}
