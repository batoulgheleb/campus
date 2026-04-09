import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Listings from './pages/Listings'
import Listing from './pages/Listing'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import PersonalProfile from './pages/Personal_Profile'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/listings" element={<Navigate to="/browse" replace />} />
      <Route path="/browse" element={<Listings />} />
      <Route path="/listing" element={<Navigate to="/browse" replace />} />
      <Route path="/listing/:id" element={<Listing />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/me" element={user ? <PersonalProfile /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
