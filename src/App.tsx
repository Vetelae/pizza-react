import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Footer from './components/Footer'
import LoginPanel from './components/auth/LoginPanel'
import CartPanel from './components/customer/cart/CartPanel'
import ConfirmEmail from './pages/ConfirmEmail'
import OrderDetails from './pages/OrderDetails'
import ResetPassword from './pages/ResetPassword'
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminCategories from '@/pages/admin/AdminCategories'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrderMonitoring from './pages/admin/AdminOrderMonitoring'
import AdminOrderHistory from './pages/admin/AdminOrderHistory'
import AdminMenuItems from './pages/admin/AdminMenuItems'
import AdminNews from './pages/admin/AdminNews'
import Navbar from './components/NavBar'
import Profile from './pages/Profile'
import { ProtectedGuestRoute } from '@/components/user/ProtectedGuestRoute'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-powder">
      <Navbar />
       <main className="flex-1 pt-16">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedGuestRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="order-monitoring" element={<AdminOrderMonitoring />} />
              <Route path="order-history" element={<AdminOrderHistory />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="menu-items" element={<AdminMenuItems />} />
              <Route path="news" element={<AdminNews />} />
            </Route>
          </Route>

      </Routes>
      </main>
      <LoginPanel />
      <CartPanel />

      <Footer />
    </div>
  )
}

export default App
