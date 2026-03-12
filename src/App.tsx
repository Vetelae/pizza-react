import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-powder">
      <Navbar />
       <main className="flex-1 pt-16">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App