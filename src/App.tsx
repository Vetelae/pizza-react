import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Menu from './pages/Menu'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bgtheme">
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </div>
  )
}

export default App