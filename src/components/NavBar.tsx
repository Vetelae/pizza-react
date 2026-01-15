// src/components/NavBar.tsx
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="bg-bgtheme">
      <div className="max-w-8xl border-b-2 border-night mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/home" className="text-2xl font-bold text-orange">
              Pizza Shop
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link 
              to="/home" 
              className="hover:text-glow px-3 py-2 rounded-md transition text-orange"
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className="hover:text-glow px-3 py-2 rounded-md transition text-orange"
            >
              Menu
            </Link>
            <Link 
              to="/about" 
              className="hover:text-glow px-3 py-2 rounded-md transition text-orange"
            >
              About
            </Link>
              <Link 
              to="/about" 
              className="hover:text-glow px-3 py-2 rounded-md transition text-orange"
            >
              Login
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  )
}

export default NavBar