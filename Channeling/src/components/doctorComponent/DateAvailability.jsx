import React from 'react';


const DateAvailability = () => {
  const DoctorAvailableTimes = [
    {Date: "Monday", FullDate: "2024-12-01", TimePeriod: "8.00AM - 5.00PM",  },
    {Date: "Tuesday", FullDate: "2024-12-01", TimePeriod: "8.00AM - 5.00PM",  },
    {Date: "Wednesday", FullDate: "2024-12-01", TimePeriod: "8.00AM - 5.00PM",  },
    {Date: "Thursday", FullDate: "2024-12-01", TimePeriod: "8.00AM - 5.00PM",  },
    {Date: "Friday", FullDate: "2024-12-01", TimePeriod: "8.00AM - 5.00PM",  },
    {Date: "Saturday", FullDate: "2024-12-01", TimePeriod: "8.00AM - 12.00PM",  },
    {Date: "Sunday", FullDate: "2024-12-01", TimePeriod: "8.00AM - 12.00PM",  },
  
  ];
  

  return (
    // Main container
    <div className="py-4 px-5">
       <div className="flex">
          <h2 className="text-2xl font-semibold">Weekly Available Times</h2>  
       </div>
       <div className="overflow-y-auto h-[510px] mt-1 pr-1">
       {DoctorAvailableTimes && DoctorAvailableTimes.length > 0 ? (
        DoctorAvailableTimes.map((AvailabilieTime) => (
          <div key={AvailabilieTime.Date} className="flex justify-between items-center w-full my-5">
            <div className="flex items-center">
              <div>
                <p className="text-lg font-medium">{AvailabilieTime.Date}</p>
                <p className="text-[14px] text-[#26a626]">Date: {AvailabilieTime.FullDate}</p>
              </div>
            </div>
            <p className="text-[14px] text-center py-2 px-3 rounded-lg text-[#26a626] bg-[#DFFDDD]">{AvailabilieTime.TimePeriod}</p>
          </div>
        ))): (
          <div className="flex justify-center items-center h-full">
            <p className="text-lg text-[#828282]">No weekly Available Times</p>
          </div>
        )} 
        </div>
    </div>
  );
};

export default DateAvailability;