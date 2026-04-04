/**
 * Register Page - converted from register.html
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  
  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    
    // Validation
    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters')
      return
    }
    
    if (!agreeTerms) {
      setFormError('Please agree to the Terms and Conditions')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Use fullName as username (or extract first part of email)
      const username = fullName.replace(/\s+/g, '_').toLowerCase()
      // Extract university from email domain (basic approach)
      const emailDomain = email.split('@')[1] || ''
      const university = emailDomain.replace('.ac.uk', '').replace('.edu', '')
      
      await register(email, username, password, university)
      navigate('/')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl flex justify-between items-center w-full px-12 py-5 max-w-full sticky top-0 z-50 border-b border-outline-variant/50">
        <div className="text-lg font-bold font-['Source_Code_Pro'] text-on-surface tracking-tighter">CAMPUSPLUG</div>
        <div className="flex items-center gap-8">
          <Link to="/register" className="font-body text-[11px] font-semibold uppercase tracking-widest text-primary">
            REGISTER
          </Link>
          <div className="flex gap-5">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer text-[22px]">favorite</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer text-[22px]">account_circle</span>
          </div>
        </div>
      </header>
      
      <main className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Left Column: Gallery Slideshow */}
        <section className="hidden lg:flex lg:w-[45%] flex-col px-24 pt-16 pb-32 gap-16 overflow-hidden sticky top-[72px] h-[calc(100vh-72px)] bg-surface-container/30">
          <div className="space-y-6">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-medium">
              JOIN THE COMMUNITY
            </span>
            <h1 className="font-headline text-6xl font-semibold leading-[1.1] tracking-tight text-on-surface">
              The Curated<br />Exchange.
            </h1>
            <p className="text-on-surface-variant text-xl max-w-md leading-relaxed font-light">
              Join a secure, academic-first marketplace designed specifically for students. Verified identities, trusted trades, and zero clutter.
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
                    alt="minimalist wooden desk lamp"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVgSwf-SUFNaXfUWGvvTyA4ePKjAl1pYa15G4Q1ehYrzlEpJq5PQ57-csdUvHcNTVf8e-yNwFs805RQ-l3Oh53QYr_KHsfM3kiHdYHJ1uqaUDwmqzkfhHGEjaaeV4NOERAZI353liIjNGzuUsZ7cdkMMh6gO7iiWiIpG4drbqaHw5MV1sPMvLSNaEBilAU0OawcpZv3MPT2Q-lZSLc9T_jVQkwd3FVLarWOqAujUs5eJc_Ccu7_rDtwZoeaCmHgYfvyEG1YhKnJYC-"
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-headline font-medium text-base text-on-surface">Study Lamp</h3>
                    <p className="font-body text-sm text-secondary mt-0.5">£25.00</p>
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
                    alt="premium studio headphones"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-s26CtbieP0cSc3OfV3ZURK9zahydh5FRzxiFbY18l0mtENjUIgAAk2CSbrWMKzhSlq-Y43Rcl7xHBPZke43lUZuFlyKuochEMddqlqI-qKLoVIpbw2Tw6gz6E-CKmgEYWYEnD2RcCdhuI-pyoslnDPml-yDl2oknUiea2cPnDdLCd_OOMPGsFnxpGSY1p6MYAGWra8FKtvOJ5uRQ1IPuhoEuCTV8w_hHf-J-K0harB6uc5PtjJSxUkX3zM7-pMWaC8pUS2uc42eR"
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-headline font-medium text-base text-on-surface">Audio-M X5</h3>
                    <p className="font-body text-sm text-secondary mt-0.5">£85.00</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicators */}
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-on-surface rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-outline rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-outline rounded-full"></div>
            </div>
          </div>
        </section>
        
        {/* Right Column: Registration Form */}
        <section className="w-full lg:w-[55%] flex items-center justify-center px-12 py-24 lg:py-32">
          <div className="w-full max-w-lg space-y-16">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-semibold tracking-tight text-on-surface">Register</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed font-light">
                Complete registration to join the largest student-led community.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Error message */}
              {formError && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}
              
              <div className="space-y-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="font-body text-[13px] text-on-surface-variant font-medium ml-1">Full Name</label>
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full apple-input bg-white px-5 py-4 text-on-surface placeholder:text-secondary/50 rounded-xl transition-all" 
                    placeholder="e.g. Jordan Kim"
                    required
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label className="font-body text-[13px] text-on-surface-variant font-medium ml-1">University Email</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full apple-input bg-white px-5 py-4 text-on-surface placeholder:text-secondary/50 rounded-xl transition-all" 
                    placeholder="student@university.ac.uk"
                    required
                  />
                </div>
                
                {/* Passwords */}
                <div className="space-y-6">
                  <div className="space-y-2 relative">
                    <label className="font-body text-[13px] text-on-surface-variant font-medium ml-1">Create Password</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full apple-input bg-white px-5 py-4 pr-12 text-on-surface rounded-xl transition-all"
                      required
                    />
                    <span 
                      className="material-symbols-outlined absolute right-4 bottom-4 text-secondary cursor-pointer hover:text-on-surface transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 relative">
                    <label className="font-body text-[13px] text-on-surface-variant font-medium ml-1">Retype Password</label>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full apple-input bg-white px-5 py-4 pr-12 text-on-surface rounded-xl transition-all"
                      required
                    />
                    <span 
                      className="material-symbols-outlined absolute right-4 bottom-4 text-secondary cursor-pointer hover:text-on-surface transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Verification Section - placeholder for now */}
              <div className="space-y-6 pt-6 border-t border-outline-variant/40">
                <div className="space-y-1">
                  <h3 className="font-headline font-semibold text-base text-on-surface">Verify your student status</h3>
                  <p className="text-[13px] text-on-surface-variant font-light">
                    Upload a photo of your student ID or your letter of acceptance.
                  </p>
                </div>
                <div className="border border-dashed border-outline rounded-2xl p-12 flex flex-col items-center justify-center gap-4 group hover:border-primary transition-all cursor-pointer bg-surface-container/20">
                  <span className="material-symbols-outlined text-4xl text-secondary group-hover:text-primary transition-colors">
                    cloud_upload
                  </span>
                  <div className="text-center">
                    <span className="font-body text-sm font-medium block text-on-surface">Drag and drop or browse</span>
                    <span className="text-[11px] text-secondary font-medium tracking-wide">JPG, PNG, PDF (MAX 5MB)</span>
                  </div>
                </div>
                <p className="text-[12px] text-secondary text-center">
                  (File upload coming soon — registration works without it for now)
                </p>
              </div>
              
              {/* Agreement */}
              <label className="flex items-start gap-3 cursor-pointer group pt-2">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input 
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border border-outline rounded-md checked:bg-primary checked:border-primary transition-all"
                  />
                  <span className="material-symbols-outlined absolute text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                    check
                  </span>
                </div>
                <span className="text-[13px] text-on-surface-variant leading-tight font-light">
                  I agree to the <a className="text-primary hover:underline underline-offset-4" href="#">Terms and Conditions</a> and <a className="text-primary hover:underline underline-offset-4" href="#">Privacy Policy</a>
                </span>
              </label>
              
              {/* CTA */}
              <div className="space-y-8">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-[#0071e3]/50 text-white font-headline font-semibold py-4 px-8 rounded-full transition-all transform active:scale-[0.99] text-base"
                >
                  {isLoading ? 'Creating account...' : 'Join Now'}
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-secondary font-light">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4">
                      Log In
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
        <div className="text-on-surface font-['Source_Code_Pro'] font-bold tracking-tighter text-lg">CAMPUSPLUG</div>
        <div className="flex gap-10">
          <a className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary hover:text-primary transition-all" href="#">PRIVACY</a>
          <a className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary hover:text-primary transition-all" href="#">TERMS</a>
          <a className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary hover:text-primary transition-all" href="#">SUPPORT</a>
        </div>
        <p className="font-body text-[10px] uppercase tracking-widest text-secondary font-medium opacity-50">© 2026 CAMPUSPLUG</p>
      </footer>
    </>
  )
}
