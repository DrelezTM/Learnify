import { useState } from 'react';
import { Menu, X, BookOpen, Home, Users, FileText, Award, Bell, Search } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-white" />
              <span className="text-white text-2xl font-bold">Learnify</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-blue-200 transition flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
              <a href="#courses" className="text-white hover:text-blue-200 transition flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Courses</span>
              </a>
              <a href="#community" className="text-white hover:text-blue-200 transition flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </a>
              <a href="#achievements" className="text-white hover:text-blue-200 transition flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Achievements</span>
              </a>
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white hover:text-blue-200 transition">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-white hover:text-blue-200 transition relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              <button className="bg-white text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition shadow-md">
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className={`hidden md:block overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 pb-4' : 'max-h-0'}`}>
            <input type="text" placeholder="Search courses..." className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-blue-700 border-t border-blue-600 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <input type="text" placeholder="Search courses..." className="w-full px-4 py-2 rounded-lg mb-3 focus:outline-none" />
            <a href="#home" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md flex items-center space-x-2 transition">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </a>
            <a href="#courses" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md flex items-center space-x-2 transition">
              <FileText className="h-5 w-5" />
              <span>Courses</span>
            </a>
            <a href="#community" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md flex items-center space-x-2 transition">
              <Users className="h-5 w-5" />
              <span>Community</span>
            </a>
            <a href="#achievements" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md flex items-center space-x-2 transition">
              <Award className="h-5 w-5" />
              <span>Achievements</span>
            </a>
            <button className="w-full bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition mt-3">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">Welcome to Learnify</h1>
          <p className="text-xl text-blue-700 mb-8">Expand your knowledge, one course at a time</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg">
            Start Learning Today
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <FileText className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">1000+ Courses</h3>
              <p className="text-blue-700">Access thousands of courses</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <Users className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Active Community</h3>
              <p className="text-blue-700">Join millions of learners</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <Award className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Certificates</h3>
              <p className="text-blue-700">Earn recognized certificates</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;