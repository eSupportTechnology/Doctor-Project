import React, { useState, useCallback } from 'react';

const EventModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [eventData, setEventData] = useState({
    date: selectedDate ? formatDateForInput(selectedDate) : '',
    startTime: '09:00',
    endTime: '11:00',
  });

  if (!isOpen) return null;

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Event</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded text-sm sm:text-base"
              value={eventData.date}
              onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="w-full p-2 border rounded text-sm sm:text-base"
                value={eventData.startTime}
                onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                className="w-full p-2 border rounded text-sm sm:text-base"
                value={eventData.endTime}
                onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded text-sm sm:text-base hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3455EA] text-white rounded text-sm sm:text-base hover:bg-[#2e46b3]"
              onClick={() => {
                onSave({
                  date: eventData.date,
                  time: `${eventData.startTime} - ${eventData.endTime}`
                });
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('Month');
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get month details
  const getMonthDetails = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    return { year, month, startingDay, totalDays };
  }, [currentDate]);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate calendar days
  const generateCalendarDays = useCallback(() => {
    const { startingDay, totalDays } = getMonthDetails();
    const days = [];
    
    // Previous month's days
    for (let i = 0; i < startingDay; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), -startingDay + i + 1);
      days.push({
        date,
        formattedDate: formatDate(date),
        isCurrentMonth: false,
        events: events.filter(event => event.date === formatDate(date))
      });
    }
    
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push({
        date,
        formattedDate: formatDate(date),
        isCurrentMonth: true,
        events: events.filter(event => event.date === formatDate(date))
      });
    }
    
    // Next month's days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      days.push({
        date,
        formattedDate: formatDate(date),
        isCurrentMonth: false,
        events: events.filter(event => event.date === formatDate(date))
      });
    }
    
    return days;
  }, [currentDate, events, getMonthDetails]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now() }]);
  };

  const openAddEventModal = (date = null) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="w-full mx-auto p-2 sm:p-4">
      {/* Header - Mobile First Design */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
        {/* Navigation Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex">
            <button 
              className="p-1 sm:p-2 bg-[#3455EA] text-white rounded-l hover:bg-[#2e46b3] text-base sm:text-lg border-r border-white"
              onClick={goToPreviousMonth}
            >
              &lt;
            </button>
            <button 
              className="p-1 sm:p-2 bg-[#3455EA] text-white rounded-r hover:bg-[#2e46b3] text-base sm:text-lg"
              onClick={goToNextMonth}
            >
              &gt;
            </button>
          </div>
          
          <button 
            className="px-3 py-1 sm:px-4 sm:py-2 bg-[#3455EA] text-white rounded hover:bg-[#2e46b3] text-base sm:text-lg"
            onClick={goToToday}
          >
            Today
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden bg-[#3455EA] text-white px-3 py-1 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Menu
          </button>
        </div>

        {/* Month/Year Title */}
        <div className="text-center w-full sm:w-auto">
          <h2 className="font-semibold text-xl sm:text-2xl text-black">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>

        {/* View Controls and Add Event - Responsive */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto`}>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:space-x-2">
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                view === 'Month' ? 'bg-[#3455EA] text-white' : 'bg-[#3455EA] text-white hover:bg-[#2e46b3]'
              }`}
              onClick={() => setView('Month')}
            >
              Month
            </button>
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                view === 'Week' ? 'bg-[#3455EA] text-white' : 'bg-[#3455EA] text-white hover:bg-[#2e46b3]'
              }`}
              onClick={() => setView('Week')}
            >
              Week
            </button>
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                view === 'Day' ? 'bg-[#3455EA] text-white' : 'bg-[#3455EA] text-white hover:bg-[#2e46b3]'
              }`}
              onClick={() => setView('Day')}
            >
              Day
            </button>
          </div>
          <button 
            className="px-2 py-1 sm:px-4 sm:py-2 bg-[#00FFEE] text-[#5A5A5A] text-sm sm:text-base font-semibold rounded hover:bg-cyan-500 hover:text-white w-full sm:w-auto"
            onClick={() => openAddEventModal(new Date())}
          >
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded shadow-lg overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-[#00FFEE] text-black">
          {weekDays.map(day => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-base font-semibold">
              {window.innerWidth < 640 ? day.slice(0, 1) : day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 text-right text-sm sm:text-base">
          {generateCalendarDays().map((day, index) => (
            <div
              key={index}
              className={`min-h-16 sm:min-h-24 p-1 sm:p-2 border-t border-l border-[#636161] border-[0.75px] relative cursor-pointer hover:bg-gray-50 ${
                day.isCurrentMonth ? 'bg-white' : 'bg-[#F0F0F0]'
              } ${isToday(day.date) ? 'bg-white' : ''}`}
              onClick={() => openAddEventModal(day.date)}
            >
              <span className={`inline-flex w-5 h-5 sm:w-6 sm:h-6 items-center justify-center rounded-full ${
                isToday(day.date) 
                  ? 'bg-[#3455EA] text-white' 
                  : day.isCurrentMonth 
                    ? 'text-[#948F8F]' 
                    : 'text-[#948F8F]'
              }`}>
                {day.date.getDate()}
              </span>
              
              {/* Events */}
              <div className="mt-1 space-y-1">
                {day.events.map(event => (
                  <div 
                    key={event.id}
                    className="bg-[#3455EA] text-white text-xs p-1 rounded cursor-pointer hover:bg-[#2e46b3] truncate"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle event click
                    }}
                  >
                    {event.time}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;