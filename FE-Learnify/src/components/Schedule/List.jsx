import React, { useState } from "react";
import { Calendar, Clock, Plus, X, Trash2, ChevronLeft, ChevronRight, GripVertical, Edit2 } from "lucide-react";

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: "Meeting dengan Tim", startDate: new Date(2025, 10, 25, 10, 0), endDate: new Date(2025, 10, 25, 11, 0), color: "#6366f1" },
    { id: 2, title: "Presentasi Proyek", startDate: new Date(2025, 10, 27, 14, 0), endDate: new Date(2025, 10, 27, 16, 0), color: "#ef4444" },
    { id: 3, title: "Workshop Design", startDate: new Date(2025, 10, 28, 9, 0), endDate: new Date(2025, 10, 30, 17, 0), color: "#10b981" }
  ]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartTime, setEventStartTime] = useState("10:00");
  const [eventEndTime, setEventEndTime] = useState("11:00");
  const [eventEndDate, setEventEndDate] = useState(null);
  const [eventColor, setEventColor] = useState("#6366f1");
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [draggedOverDate, setDraggedOverDate] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

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
    
    // Calculate how many days until end of week or event end
    const daysUntilWeekEnd = 6 - new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
    const daysUntilEventEnd = Math.floor((endDate - dayDate) / (1000 * 60 * 60 * 24));
    const span = Math.min(daysUntilWeekEnd, daysUntilEventEnd) + 1;
    
    return { isStart, isEnd, span };
  };

  const addEvent = () => {
    if (!eventTitle.trim()) return;
    
    const [sh, sm] = eventStartTime.split(":");
    const [eh, em] = eventEndTime.split(":");
    
    const startDate = new Date(selectedDate);
    startDate.setHours(parseInt(sh), parseInt(sm));
    
    const endDate = eventEndDate ? new Date(eventEndDate) : new Date(selectedDate);
    endDate.setHours(parseInt(eh), parseInt(em));
    
    if (editingEventId) {
      // Update existing event
      setEvents(events.map(e => 
        e.id === editingEventId 
          ? { ...e, title: eventTitle, startDate: startDate, endDate: endDate, color: eventColor }
          : e
      ));
      setEditingEventId(null);
    } else {
      // Add new event
      setEvents([...events, { 
        id: Date.now(), 
        title: eventTitle, 
        startDate: startDate,
        endDate: endDate,
        color: eventColor 
      }]);
    }
    
    setEventTitle("");
    setEventStartTime("10:00");
    setEventEndTime("11:00");
    setEventEndDate(null);
    setShowModal(false);
  };

  const editEvent = (event) => {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setSelectedDate(new Date(event.startDate));
    setEventEndDate(new Date(event.endDate));
    setEventStartTime(event.startDate.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }));
    setEventEndTime(event.endDate.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }));
    setEventColor(event.color);
    setShowModal(true);
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, day) => {
    e.preventDefault();
    setDraggedOverDate(day);
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedEvent) {
      const oldStart = new Date(draggedEvent.startDate);
      const oldEnd = new Date(draggedEvent.endDate);
      const duration = oldEnd - oldStart;
      
      const newStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      newStart.setHours(oldStart.getHours(), oldStart.getMinutes());
      
      const newEnd = new Date(newStart.getTime() + duration);
      
      setEvents(events.map(e => 
        e.id === draggedEvent.id 
          ? { ...e, startDate: newStart, endDate: newEnd }
          : e
      ));
      
      setDraggedEvent(null);
      setDraggedOverDate(null);
    }
  };

  const handleDayClick = (day) => {
    if (draggedEvent) return; // Don't open modal if dragging
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setEventEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setShowModal(true);
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
          onClick={() => handleDayClick(day)}
          onDragOver={(e) => handleDragOver(e, day)}
          onDrop={(e) => handleDrop(e, day)}
          className={`aspect-square p-2 rounded-2xl cursor-pointer transition-all duration-300 group relative ${
            draggedOverDate === day 
              ? "bg-blue-100 border-2 border-blue-400 scale-105" 
              : isToday(day) 
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50 text-white scale-105" 
              : hasEvents
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg hover:scale-105"
              : "bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-sm font-semibold mb-1 ${isToday(day) ? "text-white" : "text-gray-700"}`}>
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
                      draggable
                      onDragStart={(ev) => handleDragStart(ev, e)}
                      className="text-[10px] px-1.5 py-0.5 rounded-md text-white font-medium truncate shadow-sm cursor-move hover:shadow-md transition-all flex items-center gap-1"
                      style={{ 
                        backgroundColor: e.color,
                        gridColumn: `span ${span}`
                      }}
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      <GripVertical className="w-2 h-2 flex-shrink-0 opacity-60" />
                      <span className="truncate">{e.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!hasEvents && !isToday(day) && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-blue-500 font-medium mt-auto">
                + Tambah
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 mb-8">
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
          <div className="xl:col-span-3 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 md:p-8">
            <div className="grid grid-cols-7 gap-3 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center font-bold text-gray-600 py-2 text-xs md:text-sm">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3">
              {renderCalendar()}
            </div>
          </div>

          {/* Event List */}
          <div className="xl:col-span-1 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 md:p-8">
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
                  .map(event => {
                    const duration = Math.ceil((event.endDate - event.startDate) / (1000 * 60 * 60 * 24));
                    const isMultiDay = duration >= 1;
                    
                    return (
                      <div
                        key={event.id}
                        className="group p-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
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
                          <div className="flex gap-1">
                            <button
                              onClick={() => editEvent(event)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300 flex-shrink-0"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {editingEventId ? "Edit Event" : "Tambah Event Baru"}
                </h2>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    setEditingEventId(null);
                    setEventTitle("");
                    setEventStartTime("10:00");
                    setEventEndTime("11:00");
                    setEventEndDate(null);
                  }} 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Event
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    placeholder="Masukkan judul event..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={selectedDate?.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={eventEndDate?.toISOString().split('T')[0]}
                      onChange={(e) => setEventEndDate(new Date(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Waktu Mulai
                    </label>
                    <input
                      type="time"
                      value={eventStartTime}
                      onChange={(e) => setEventStartTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Waktu Selesai
                    </label>
                    <input
                      type="time"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Warna Label
                  </label>
                  <div className="flex gap-3">
                    {["#6366f1", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map(color => (
                      <button
                        key={color}
                        onClick={() => setEventColor(color)}
                        className={`w-11 h-11 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
                          eventColor === color ? "ring-4 ring-offset-2 ring-gray-300 scale-110" : "hover:shadow-xl"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={addEvent}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                >
                  {editingEventId ? (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Update Event
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Tambah Event
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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