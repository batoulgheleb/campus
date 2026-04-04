/**
 * Auth Context - manages authentication state across the app.
 * 
 * React Context is like a global variable that components can subscribe to.
 * When the user logs in/out, all components using useAuth() automatically update.
 * 
 * Similar to how in C you might have a global `current_user` pointer,
 * but React handles re-rendering when it changes.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../api'

// Create the context (like declaring the global)
const AuthContext = createContext(null)

// Provider component wraps the app and provides auth state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // On mount, check if we have a stored token and load user
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Try to load current user with stored token
      auth.me()
        .then(userData => setUser(userData))
        .catch(() => {
          // Token invalid/expired, clear it
          localStorage.removeItem('access_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])
  
  // Login function
  const login = async (email, password) => {
    setError(null)
    try {
      await auth.login(email, password)
      const userData = await auth.me()
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }
  
  // Register function
  const register = async (email, username, password, university) => {
    setError(null)
    try {
      const userData = await auth.register(email, username, password, university)
      // After registration, log them in automatically
      await auth.login(email, password)
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }
  
  // Logout function
  const logout = () => {
    auth.logout()
    setUser(null)
  }
  
  // The value that gets passed to all consumers
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context (like calling getCurrentUser() in C)
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
