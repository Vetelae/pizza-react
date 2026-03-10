// src/components/Navbar.tsx
import { Link } from 'react-router-dom'
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaShoppingBasket } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-bgtheme sticky top-0 z-50">
      <div className="w-full border-b-2 border-night mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/home" className="text-2xl md:text-4xl font-bold text-orange">
              Pizza Shop
            </Link>
            </div>
          
          
          {/* Navigation Links - Center */}
          <div className="flex space-x-4">
            <Link 
              to="/menu" 
              className="hover:text-glow font-bold text-base sm:text-xl md:text-2xl px-3 py-2 rounded-md transition text-orange"
            >
              Menu
            </Link>
            <Link 
              to="/about" 
              className="hover:text-glow font-bold text-base sm:text-xl md:text-2xl px-3 py-2 rounded-md transition text-orange"
            >
              About
            </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
              to="/login" 
              className="hover:text-glow text-base sm:text-xl md:text-2xl px-3 py-2 rounded-md transition text-orange"
            >
              <IoPersonCircleSharp className="text-2xl sm:text-3xl md:text-4xl" />
            </Link>
               <Link 
              to="/cart" 
              className="hover:text-glow text-base sm:text-xl md:text-2xl px-3 py-2 rounded-md transition text-orange"
            >
              <FaShoppingBasket className="text-2xl sm:text-3xl md:text-4xl" />
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  )
}

export default Navbar