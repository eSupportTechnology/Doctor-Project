import React from 'react';

//components
import Calendar from '../../components/Calendar';

const ScheduleTime = () => {
  return (
    <div className="m-2 md:mt-3 border-2 border-[#C0C2C2] sm:border-t-[#C0C2C2] sm:border-l-[#98DED9] sm:border-b-[#C0C2C2]">
      <Calendar />
      
      {/* Main content wrapper with responsive layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between p-4">
        {/* Available Events Section */}
        <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#212224]">
            Available Events
          </h2>
          
          {/* Event buttons with responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:max-w-2xl lg:max-w-[220px]">
            {['Meeting', 'Operations', 'Lunch', 'Conference', 'Business Meeting'].map((event) => (
              <div
                key={event}
                className="h-11 flex items-center bg-[#5478BD] border border-[#161D6F] rounded-[4px] hover:bg-[#4367AC] transition-colors"
              >
                <span className="text-white font-normal text-base sm:text-[17px] pl-4">
                  {event}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side content */}
        <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-start lg:w-2/3">
          {/* Channeling section */}
          <div className="mt-4 sm:mt-0 lg:mt-16 mb-2 sm:mb-0 lg:mb-4 sm:ml-9 text-black font-normal text-base sm:text-[17px] leading-[18px] capitalize">
            Channeling
          </div>
          
          {/* Checkbox section */}
          <div className="flex items-center mb-2">
            <input 
              type="checkbox" 
              className="w-[18px] h-[18px] mr-2"
              aria-label="Remove after drop"
            />
            <span className="text-black font-normal text-base sm:text-[18px] leading-[24px] capitalize">
              Remove After Drop
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTime;