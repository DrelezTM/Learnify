import React, { useState } from 'react';
import { Home, Menu, X, ChevronDown, ClipboardCheck, Calendar, Bell, MessageCircle } from 'lucide-react';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      href: '#dashboard',
      submenu: [
        { name: 'List Kelas', href: '#list-kelas' },
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

  return (
    <div className="flex h-screen bg-gray-50">
     
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-blue-800 transition-all duration-300 ease-in-out shadow-2xl flex flex-col`}>
       
        <div className="flex items-center justify-between p-5">
          {isSidebarOpen && (
            <h1 className="text-2xl font-bold text-white">
              Learnifly
              <span className="inline-block w-2 h-2 bg-white rounded-full ml-1 mb-1"></span>
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

    
        <nav className="flex-1 px-3 mt-4 overflow-y-auto space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleDropdown(item.name);
                  }
                }}
                className="flex items-center justify-between px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <item.icon size={20} className="group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm truncate">{item.name}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  {isSidebarOpen && item.badge && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                  {isSidebarOpen && item.submenu && (
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>
              </a>

              {/* Submenu */}
              {item.submenu && isSidebarOpen && openDropdown === item.name && (
                <div className="ml-10 mt-2 space-y-1 mb-2">
                  {item.submenu.map((subitem) => (
                    <a
                      key={subitem.name}
                      href={subitem.href}
                      className="block px-4 py-2 text-sm text-blue-100 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      {subitem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto">
          <div className="flex items-center space-x-3 text-white bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all duration-200 cursor-pointer">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold text-sm">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        
        </div>

       
      </div>
    </div>
  );
}