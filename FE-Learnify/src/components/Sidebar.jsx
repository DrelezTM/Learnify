import React, { useState, useEffect } from 'react';
import { Home, Menu, X, ChevronDown, ClipboardCheck, Calendar, LogOut, Settings } from 'lucide-react';
import { fetchLogout } from '@/lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState('');
  
  // NEW: State for User Data
  const [user, setUser] = useState({ name: "Guest", role: "Student", initials: "G" });

  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. GET USER DATA FROM LOCAL STORAGE ---
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        
        // Helper to get initials (e.g. "Budi Santoso" -> "BS")
        const getInitials = (name) => {
            if (!name) return "G";
            const matches = name.match(/\b\w/g) || [];
            return ((matches[0] || '') + (matches[matches.length - 1] || '')).toUpperCase();
        };

        setUser({
            name: userData.name || "User",
            // If database doesn't have 'role', use email as subtitle
            role: userData.role || userData.email || "Student", 
            initials: getInitials(userData.name)
        });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '/courses',
    },
    {
      name: 'Presensi',
      icon: ClipboardCheck,
      href: '/attendance',
    },
    {
      name: 'Schedule',
      icon: Calendar,
      href: '/schedule', 
    },
  ];

  // --- Efek untuk Mengatur Menu Aktif berdasarkan URL ---
  useEffect(() => {
    const currentPath = location.pathname;

    const activeItem = menuItems.find(item => {
      if (item.href === currentPath) return true;
      if (item.submenu && currentPath.startsWith(item.href)) return true;
      return false;
    });

    if (activeItem) {
      setActiveMenu(activeItem.name);
      if (activeItem.submenu) {
        const activeSub = activeItem.submenu.find(sub => sub.href === currentPath);
        if (activeSub) {
          setActiveSubmenu(activeSub.name);
          setOpenDropdown(activeItem.name); 
        } else {
          setActiveSubmenu('');
        }
      } else {
        setOpenDropdown(null);
        setActiveSubmenu('');
      }
    }
  }, [location.pathname]);

  const toggleDropdown = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  const handleMenuClick = (item) => {
    const { name, href, submenu } = item;
    setActiveMenu(name);
    if (!submenu) {
      navigate(href);
      setOpenDropdown(null);
      setActiveSubmenu('');
    } else {
      toggleDropdown(name);
    }
  };

  const handleSubmenuClick = (sub) => {
    setActiveSubmenu(sub.name);
    navigate(sub.href); 
  };

  const handleLogout = async () => {
    if (typeof window === 'undefined') return null;
    try {
      await fetchLogout();
      // Clear all storage
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate("/");
    } catch (error) {
      console.error('Failed logout', error);
    }
  };

  return (
    <>
      <style>{`
        @keyframes menuActivate { 0% { transform: scale(0.95); } 50% { transform: scale(1.08); } 100% { transform: scale(1.05); } }
        @keyframes submenuSlideIn { 0% { opacity: 0; transform: translateX(-20px) scale(0.9); } 60% { transform: translateX(4px) scale(1.02); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
        .menu-activate { animation: menuActivate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .submenu-slide-in { animation: submenuSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} h-screen fixed top-0 left-0 z-50 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 transition-all duration-300 ease-in-out shadow-2xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/50`}>
        <div className="flex items-center justify-between p-5 relative z-10">
          {isSidebarOpen && (
            <div className="flex items-center space-x-2 transition-all duration-300">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Learnify</h1>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300 hover:rotate-90 hover:scale-110 active:rotate-90 active:scale-95">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-2 relative z-10">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.name;
            const Icon = item.icon;
            const isOpen = openDropdown === item.name;

            return (
              <div key={item.name} onClick={(e) => { e.preventDefault(); handleMenuClick(item); }}>
                <a href={item.href} onClick={(e) => { e.preventDefault(); handleMenuClick(item); }} className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:translate-x-1.5 hover:scale-105 active:translate-x-1 active:scale-95 ${isActive ? 'bg-white text-blue-700 shadow-lg scale-105 menu-activate' : 'text-white hover:bg-white/20'}`}>
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Icon size={20} className={`${isActive ? 'text-blue-600' : ''}`} />
                    {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                  </div>
                  {isSidebarOpen && item.submenu && (
                    <ChevronDown size={16} className={`transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`} />
                  )}
                </a>
                {item.submenu && isSidebarOpen && isOpen && (
                  <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-white/20 pl-4 overflow-hidden">
                    {item.submenu.map((sub, index) => {
                      const activeSub = activeSubmenu === sub.name;
                      return (
                        <a key={sub.name} href={sub.href} onClick={(e) => { e.preventDefault(); handleSubmenuClick(sub); }} className={`block px-4 py-2 text-sm rounded-lg transition-all duration-300 ease-out hover:translate-x-1.5 hover:!bg-white/20 active:translate-x-1 active:scale-95 opacity-0 -translate-x-5 submenu-slide-in ${activeSub ? 'bg-white text-blue-700 font-semibold' : 'text-blue-100 hover:text-white'}`} style={{ animationDelay: `${index * 80}ms` }}>
                          {sub.name}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-3 pb-3 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 ease-out hover:translate-x-1.5 hover:scale-105 active:translate-x-1 active:scale-95">
            <Settings size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-red-500/30 rounded-xl transition-all duration-300 ease-out hover:translate-x-1.5 hover:scale-105 active:translate-x-1 active:scale-95">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* --- DYNAMIC USER SECTION --- */}
        <div className="p-4 mt-auto">
          <div className="flex items-center space-x-3 text-white bg-white/10 backdrop-blur-sm rounded-xl p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/15">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center font-bold">
              {user.initials}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-blue-200 truncate">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}