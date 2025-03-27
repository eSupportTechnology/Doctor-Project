import React from 'react';

//components
import Calendar from '../../components/Calendar';

const ScheduleTime = () => {

  return (
      <div className="xsm:m-2 md:mt-3 xsm:border-2 xsm:border-[#C0C2C2] sm:ml-2 sm:border-t-2 sm:border-t-[#C0C2C2] sm:border-l-2 sm:border-l-[#98DED9] sm:border-b-2 sm:border-b-[#C0C2C2]">
        <Calendar />
        {/* Available Events Section */}
        <div className="mt-8 ml-4 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-[#212224]">Available Events</h2>

          {/* Event buttons using flex layout */}
          <div className="flex flex-col space-y-3 max-w-[220px] grid-cols-2 gap-x-16">
            {['Meeting', 'Operations', 'Lunch', 'Conference', 'Business Meeting'].map((event) => (
              <div
                key={event}
                className="h-[44px] flex items-center bg-[#5478BD] border border-[#161D6F] rounded-[4px]"
              >
                <span className="text-white font-[Arial] font-normal text-[17px] pl-4">
                  {event}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Channeling section */}
        <div className="absolute w-[275px] h-[64px] left-[885px] top-[1070px] text-black font-[Calibri] font-normal text-[17px] leading-[18px] capitalize" >
          Channeling
        </div>
        {/* Checkbox section */}
        <div className="-mt-8 pl-96 flex items-center mb-3">
          <input type="checkbox" className="w-[18px] h-[18px] mr-2" />
          <span className="text-black font-[Calibri] text-[18px] leading-[24px] capitalize">
            Remove After Drop
          </span>
        </div>
        
      </div>
  );
};

export default ScheduleTime;