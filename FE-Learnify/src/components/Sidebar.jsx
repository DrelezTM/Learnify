import React, { useState } from 'react';
import { Home, Menu, X, ChevronDown, ClipboardCheck, Calendar, MessageCircle, LogOut, Settings } from 'lucide-react';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [activeSubmenu, setActiveSubmenu] = useState('');

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '#dashboard',
      submenu: [
        { name: 'List Kelas', href: '/list-kelas' },
        { name: 'Timeline', href: '#timeline' }
      ]
    },
    {
      name: 'Absensi Per-Matkul',
      icon: ClipboardCheck,
      href: '#absensi',
      submenu: [
        { name: 'Attendance', href: '#attendance' },
        { name: 'Total Session', href: '#total-session' },
        { name: 'Total Attendance', href: '#total-attendance' },
        { name: 'Minimal Attendance', href: '#minimal-attendance' }
      ]
    },
    {
      name: 'Schedule',
      icon: Calendar,
      href: '#schedule',
      submenu: [
        { name: 'Schedule', href: '#schedule-list' },
        { name: 'Calendar', href: '#calendar' }
      ]
    },
    {
      name: 'Forum',
      icon: MessageCircle,
      href: '#forum',
    }
  ];

  const toggleDropdown = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  const handleMenuClick = (itemName, hasSubmenu) => {
    setActiveMenu(itemName);
    if (!hasSubmenu) {
      setActiveSubmenu('');
    }
    if (hasSubmenu) {
      toggleDropdown(itemName);
    }
  };

  const handleSubmenuClick = (submenuName) => {
    setActiveSubmenu(submenuName);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: rgba(255, 255, 255, 0.7);
        }
        .submenu-enter {
          animation: slideDown 0.3s ease-out;
          transform-origin: top;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 transition-all duration-300 ease-in-out shadow-2xl flex flex-col relative`}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="flex items-center justify-between p-5 relative z-10">
          {isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Learnify</h1>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:rotate-90"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex-1 px-3 mt-6 overflow-y-auto space-y-2 relative z-10 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.name;
            const Icon = item.icon;

            return (
              <div key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.name, !!item.submenu);
                  }}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden
                    ${isActive
                      ? 'bg-white text-blue-700 shadow-lg scale-105'
                      : 'text-white hover:bg-white/20 hover:scale-105'
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-600 rounded-r-full"></div>
                  )}

                  <div className="flex items-center space-x-3 flex-1 min-w-0 relative z-10">
                    <Icon
                      size={20}
                      className={`group-hover:scale-110 transition-transform duration-200 flex-shrink-0 ${isActive ? 'text-blue-600' : ''
                        }`}
                    />
                    {isSidebarOpen && (
                      <span className={`font-semibold text-sm truncate ${isActive ? 'text-blue-700' : ''
                        }`}>
                        {item.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2 relative z-10">
                    {isSidebarOpen && item.submenu && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''
                          } ${isActive ? 'text-blue-600' : ''}`}
                      />
                    )}
                  </div>
                </a>

                {item.submenu && isSidebarOpen && openDropdown === item.name && (
                  <div className="ml-4 mt-2 space-y-1 mb-2 border-l-2 border-white/20 pl-4 submenu-enter">
                    {item.submenu.map((subitem) => {
                      const isSubmenuActive = activeSubmenu === subitem.name;

                      return (
                        <a
                          key={subitem.name}
                          href={subitem.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmenuClick(subitem.name);
                          }}
                          className={`block px-4 py-2.5 text-sm rounded-lg transition-all duration-200 relative overflow-hidden
                            ${isSubmenuActive
                              ? 'bg-white text-blue-700 font-semibold shadow-md scale-105'
                              : 'text-blue-100 hover:text-white hover:bg-white/20 hover:scale-105'
                            }`}
                        >
                          {isSubmenuActive && (
                            <div className="absolute left-0 top-0 w-1 h-full bg-blue-600 rounded-r-full"></div>
                          )}
                          <span className="relative z-10">{subitem.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-3 pb-3 space-y-2 relative z-10">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105">
            <Settings size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-red-500/30 rounded-xl transition-all duration-200 hover:scale-105">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        <div className="p-4 mt-auto relative z-10">
          <div className="flex items-center space-x-3 text-white bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-all duration-200 cursor-pointer border border-white/10">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
              JD
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-blue-200">Student</p>
              </div>
            )}
          </div>
        </div>
      </div>




    </div>
  );
}