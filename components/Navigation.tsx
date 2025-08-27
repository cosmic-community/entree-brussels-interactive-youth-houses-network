'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="font-medium text-dark hover:text-primary transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              href="/projects" 
              className="font-medium text-dark hover:text-primary transition-colors duration-300"
            >
              Projects
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl text-dark">Entree</span>
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/about-entree" 
              className="font-medium text-dark hover:text-primary transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="font-medium text-dark hover:text-primary transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute h-0.5 w-6 bg-dark transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1'
              }`} />
              <span className={`absolute h-0.5 w-6 bg-dark transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'top-3'
              }`} />
              <span className={`absolute h-0.5 w-6 bg-dark transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 top-3' : 'top-5'
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'max-h-64 opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
            <Link 
              href="/" 
              className="block px-4 py-2 font-medium text-dark hover:text-primary hover:bg-gray-50 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/projects" 
              className="block px-4 py-2 font-medium text-dark hover:text-primary hover:bg-gray-50 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/about-entree" 
              className="block px-4 py-2 font-medium text-dark hover:text-primary hover:bg-gray-50 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-2 font-medium text-dark hover:text-primary hover:bg-gray-50 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Animated shapes on scroll */}
      <div className={`absolute top-0 right-0 w-20 h-20 transition-all duration-500 ${
        isScrolled ? 'translate-x-0 opacity-30' : 'translate-x-full opacity-0'
      }`}>
        <div className="w-4 h-4 bg-accent rounded-full animate-float animation-delay-100"></div>
        <div className="w-3 h-3 bg-secondary rounded-full animate-bounce-gentle animation-delay-300 mt-4 ml-8"></div>
      </div>
    </nav>
  )
}