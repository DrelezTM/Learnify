import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus, X, Trash2, ChevronLeft, ChevronRight, GripVertical, Edit2 } from "lucide-react";
import { getSchedules } from "@/lib/api/schedule-api";

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [events, setEvents] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  
  const [sidebarWidth, setSidebarWidth] = useState(256);

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Trigger fade-in animation
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50);
  }, []);

  useEffect(() => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const fetchSchedules = async () => {
      try {
        const response = await getSchedules(month, year);
        console.log(response);
        if (response.status && response.data) {
          const mappedEvents = response.data.flatMap(enrollment => {
            const course = enrollment.course;
            return course.weeks.flatMap(week =>
              week.assignments.map(assignment => ({
                id: assignment.id,
                title: `${course.title} - ${assignment.title}`,
                startDate: new Date(assignment.deadline),
                endDate: new Date(assignment.deadline),
                color: "#6366f1",
              }))
            );
          });
          setEvents(mappedEvents);
        }
      } catch (error) {
        console.error("Gagal fetch jadwal:", error);
      }
    };

    fetchSchedules();
  }, [ currentDate ]);


  // Monitor sidebar width changes
  useEffect(() => {
    const detectSidebarWidth = () => {
      const sidebar = document.querySelector('.from-blue-600');
      if (sidebar) {
        const width = sidebar.offsetWidth;
        setSidebarWidth(width);
      }
    };

    detectSidebarWidth();

    const sidebar = document.querySelector('.from-blue-600');
    if (sidebar) {
      const observer = new MutationObserver(detectSidebarWidth);
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      const interval = setInterval(detectSidebarWidth, 100);

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const getEventsForDay = (day) => {
    return events.filter(e => {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const startDate = new Date(e.startDate);
      const endDate = new Date(e.endDate);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      dayDate.setHours(0, 0, 0, 0);
      
      return dayDate >= startDate && dayDate <= endDate;
    });
  };

  const calculateEventSpan = (event, day) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    dayDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const isStart = dayDate.getTime() === startDate.getTime();
    const isEnd = dayDate.getTime() === endDate.getTime();
    
    const daysUntilWeekEnd = 6 - new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
    const daysUntilEventEnd = Math.floor((endDate - dayDate) / (1000 * 60 * 60 * 24));
    const span = Math.min(daysUntilWeekEnd, daysUntilEventEnd) + 1;
    
    return { isStart, isEnd, span };
  };

  const renderCalendar = () => {
    const days = [];
    const renderedEvents = new Set();
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const hasEvents = dayEvents.length > 0;
      
      days.push(
        <div
          key={day}
          className={`min-h-[60px] sm:min-h-[80px] md:aspect-square p-1.5 sm:p-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 group relative ${
            isToday(day) 
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50 text-white scale-105" 
              : hasEvents
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg hover:scale-105"
              : "bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-xs sm:text-sm font-semibold mb-1 ${isToday(day) ? "text-white" : "text-gray-700"}`}>
              {day}
            </div>
            
            {hasEvents && (
              <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.map(e => {
                  const { isStart, span } = calculateEventSpan(e, day);
                  
                  if (!isStart || renderedEvents.has(e.id)) return null;
                  renderedEvents.add(e.id);
                  
                  return (
                    <div
                      key={e.id}
                      className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-md text-white font-medium truncate shadow-sm cursor-default hover:shadow-md transition-all flex items-center gap-0.5 sm:gap-1"
                      style={{ 
                        backgroundColor: e.color,
                        gridColumn: `span ${span}`
                      }}
                    >
                      <GripVertical className="w-2 h-2 flex-shrink-0 opacity-60 hidden sm:block" />
                      <span className="truncate">{e.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div 
      className={`bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full transition-all duration-700 ease-out translate-y-4 overflow-y-auto`}
      style={{ 
        marginLeft: `${sidebarWidth}px`,
        height: '100vh'
      }}
    >
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div 
            className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 mb-8 transition-all duration-700 ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {monthNames[currentDate.getMonth()]}
                  </h1>
                  <p className="text-gray-500 text-sm font-medium">{currentDate.getFullYear()}</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="flex-1 sm:flex-initial p-3 bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-lg hover:scale-105 text-gray-700 font-medium rounded-full transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Bulan ini
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="flex-1 sm:flex-initial p-3 bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-lg hover:scale-105 text-gray-700 font-medium rounded-full transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Calendar Grid */}
            <div 
              className={`xl:col-span-3 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 md:p-8 transition-all duration-700 ${
                fadeIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-bold text-gray-600 py-2 text-xs sm:text-sm">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {renderCalendar()}
              </div>
            </div>

            {/* Event List */}
            <div 
              className={`xl:col-span-1 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 transition-all duration-700 ${
                fadeIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Event Mendatang
                </h2>
              </div>
              
              <div className="space-y-3 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Belum ada event</p>
                    <p className="text-gray-400 text-xs mt-1">Klik tanggal untuk menambah</p>
                  </div>
                ) : (
                  events
                    .sort((a, b) => a.startDate - b.startDate)
                    .map((event, idx) => {
                      const duration = Math.ceil((event.endDate - event.startDate) / (1000 * 60 * 60 * 24));
                      const isMultiDay = duration >= 1;
                      
                      return (
                        <div
                          key={event.id}
                          className={`group p-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ${
                            fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                          style={{ transitionDelay: `${400 + idx * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-1.5 h-full rounded-full flex-shrink-0 mt-1" 
                              style={{ backgroundColor: event.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 truncate text-sm md:text-base mb-1">
                                {event.title}
                              </h3>
                              <div className="flex flex-col gap-1 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {event.startDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                  </span>
                                  {isMultiDay && (
                                    <>
                                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                      <span className="font-medium">
                                        {event.endDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400">
                                  {event.startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - 
                                  {event.endDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                {isMultiDay && (
                                  <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full w-fit font-medium">
                                    {duration} hari
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </div>
  );
}