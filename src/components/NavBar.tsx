// src/components/Navbar.tsx
import { Link } from 'react-router-dom'
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaShoppingBasket } from "react-icons/fa";
import { useAuthStore } from '../store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useEffect, useRef, useState } from 'react';

function Navbar() {
  const { openLogin, isAuthenticated } = useAuthStore()
  const { mutate: logout } = useLogout()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="bg-gray-700 fixed top-0 left-0 right-0 w-full z-50">
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
            {isAuthenticated ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  aria-label="Account menu"
                  className="hover:text-glow text-base sm:text-xl md:text-2xl px-3 py-2 rounded-md transition text-orange"
                >
                  <IoPersonCircleSharp className="text-2xl sm:text-3xl md:text-4xl" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-orange hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                aria-label="Sign in"
                className="hover:text-glow text-base sm:text-xl md:text-2xl px-3 py-2 rounded-md transition text-orange"
              >
                <IoPersonCircleSharp className="text-2xl sm:text-3xl md:text-4xl" />
              </button>
            )}
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