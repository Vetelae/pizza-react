import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Footer from './components/Footer'
import LoginPanel from './components/auth/LoginPanel'
import ConfirmEmail from './pages/ConfirmEmail'
import ResetPassword from './pages/ResetPassword'
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminCategories from '@/pages/admin/AdminCategories'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMenuItems from './pages/admin/AdminMenuItems'
import AdminNews from './pages/admin/AdminNews'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-powder">
      <Navbar />
       <main className="flex-1 pt-16">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="menu-items" element={<AdminMenuItems />} />
              <Route path="news" element={<AdminNews />} />
            </Route>
          </Route>

      </Routes>
      </main>
      <LoginPanel />

      <Footer />
    </div>
  )
}

export default App