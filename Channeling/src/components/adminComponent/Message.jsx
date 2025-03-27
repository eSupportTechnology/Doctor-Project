import React, { useState,useEffect } from 'react'
import DatePicker from "react-datepicker";
import { AiFillCaretDown } from "react-icons/ai";
import img from '../../img/doctorPatientsProfile.png';

export default function Message() {

    
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarVisible(false); 
  };

    const data = [
      { id: "01",img: img, name: "EMILY JOHNSON", time: "11.00AM", status: "Paid", message1: false, message2: true, customMessage: false },
      { id: "02",img: img, name: "MICHAEL SMITH", time: "10.00AM", status: "Paid", message1: false, message2: true, customMessage: false },
      { id: "03",img: img, name: "SOPHIA MARTINEZ", time: "11.20AM", status: "Paid", message1: false, message2: true, customMessage: false },
      { id: "04",img: img, name: "DAVID LEE", time: "11.30AM", status: "Unpaid", message1: true, message2: false, customMessage: true },
      { id: "05",img: img, name: "ISABELLA BROWN", time: "01.00PM", status: "Unpaid", message1: true, message2: false, customMessage: true },
      { id: "06",img: img, name: "CHRISTOPHER GARCIA", time: "02.00PM", status: "Paid", message1: false, message2: true, customMessage: false },
      { id: "07",img: img, name: "OLIVIA WILSON", time: "01.30PM", status: "Unpaid", message1: true, message2: false, customMessage: true },
      { id: "08",img: img, name: "JAMES THOMPSON", time: "01.20PM", status: "Paid", message1: false, message2: true, customMessage: false },
      { id: "09",img: img, name: "Patient Name", time: "12.00PM", status: "No Book", message1: true, message2: true, customMessage: true },
      { id: "10",img: img, name: "Patient Name", time: "12.00PM", status: "No Book", message1: true, message2: true, customMessage: true },
      { id: "11",img: img, name: "Patient Name", time: "12.00PM", status: "No Book", message1: true, message2: true, customMessage: true },
      { id: "12",img: img, name: "Patient Name", time: "12.00PM", status: "No Book", message1: true, message2: true, customMessage: true },
      { id: "13",img: img, name: "Patient Name", time: "12.00PM", status: "No Book", message1: true, message2: true, customMessage: true },

    ];
    const [selectedMessage, setSelectedMessage] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [currentDate, setCurrentDate] = useState("");

  const sendMessage = (message) => {
    if (message) {
      alert(`Message Sent: ${message}`);
    } else {
      alert("Please select a message or type a custom message.");
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div>

     <div className="items-center justify-between mt-2 space-y-3 md:flex md:space-x-3 md:space-y-0">
        <div className="space-y-2 md:flex md:space-x-3 md:space-y-0">
          <h1 className="text-[20px] uppercase font-semibold text-left">Message&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>
          <button className="bg-[#00FF03] mr-2 md:mr-0 w-auto px-2 h-auto py-1 lg:py-0 lg:h-8 text-black rounded text-center font-medium">Make Appointment</button>
          <button className="bg-[#0004FF] w-auto px-2 h-auto py-1 lg:py-0 lg:h-8 text-white rounded text-center font-medium">Add Patient </button>
        </div>
        {/* calendar search */}
        <div className="relative">
          <button  onClick={() => setIsCalendarVisible(!isCalendarVisible)} className="flex items-center justify-between h-12 px-3 font-medium text-black transition-all duration-200 bg-white border border-gray-300 rounded min-w-28 hover:from-blue-600 hover:to-blue-800">
            <span>{selectedDate ? selectedDate.toLocaleDateString() : "DATE"}</span><AiFillCaretDown className="text-xl" />
          </button>
          {isCalendarVisible && (
          <div className="absolute z-50 top-14 md:right-0 xsm:left-0">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              calendarClassName="custom-calendar"
            />
          </div>
            )}
        </div>
      </div>
      
      {/* Message table*/}
      <div className="xl:p-4 overflow-y-scroll h-[600px] mt-[15px]">
      <table className="w-full border border-collapse border-gray-200 shadow-md table-auto border-l-[1px] border-l-[#98DED9]">
        <thead>
          <tr className="bg-gray-100 border-t-[1px] border-[#C0C2C2] xl:font-[20px] font-[10px]">
            <th className="px-4 py-5 ">#</th>
            <th className="px-4 py-5 ">NAME</th>
            <th className="px-4 py-5 ">TIME</th>
            <th className="px-4 py-5 ">STATUS</th>
            <th className="px-4 py-5 ">MESSAGE 01</th>
            <th className="px-4 py-5 ">MESSAGE 02</th>
            <th className="px-4 py-5 ">CUSTOM MESSAGE</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
            key={index}
            className='bg-white border-t-[1px] border-[#C0C2C2] hover:bg-slate-50'>
              <td className="px-4 py-2 text-center ">
                {row.id}
              </td>
              <td className="px-4 py-2 ">
                <div className="flex items-center space-x-4">
                    <img src={row.img} alt={row.name} className="w-12 h-12 rounded-full" />
                    <span className='uppercase xl:text-[15px] text-[14px]'>{row.name}</span>
                </div>
              </td>
              <td className="px-4 py-2 text-center ">
                {row.time}
              </td>
              <td className="px-4 py-2 text-center ">
                <span
                  className={`px-2 py-1 rounded-[4px]  text-black ${
                    row.status === "Paid"
                      ? "bg-[#0DFF00BD] border-[#056700] border-[1px] px-6"
                      : row.status === "Unpaid"
                      ? "bg-red border-[#4C0000] border-[1px] px-3"
                      : "bg-[#EEFF00] border-[1px] border-[#856121]"
                  }`}
                >
                  {row.status}
                </span>
                </td>
                <td className="px-4 py-2 text-center ">
                    <input
                    type="checkbox" className='w-4 h-4 cursor-pointer'
                    name="message"
                    value="Message 01: Dr. Rasika Dissanayake's today Appointment."
                    onChange={(e) => setSelectedMessage(e.target.value)}
                    />
                </td>
                <td className="px-4 py-2 text-center ">
                    <input
                    type="checkbox" className='w-4 h-4 cursor-pointer'
                    name="message"
                    value="Message 02: Dr. Rasika Dissanayake has arrived. "
                    onChange={(e) => setSelectedMessage(e.target.value)}
                    />
                </td>
                <td className="px-4 py-2 text-center ">
                    <input
                    type="checkbox" className='w-4 h-4 cursor-pointer'
                    name="message"
                    value={customMessage}
                    onChange={(e) => setSelectedMessage(customMessage)}
                    />
                </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
       {/*Message container */}
       <div className='flex'>
            <div className='bg-[#C7C7C7AB] xl:w-[170px] xl:h-[152px] mt-3 xl:ml-12 border-dashed border-t-[2px] border-l-[2px] border-b-[2px] border-[#666565] py-12 text-center'>
            <span className='uppercase text-[#656565] xl:font-[15px]'>message 01</span> 
            </div>
            <div className='bg-[#EEFF01] mt-3 border-[1px] border-black xl:w-[780px] w-[400px]'>
             <p className='xl:text-[15px] text-[12px] text-center font-bold ml-1'>වෛද්‍ය  රසික දිසානායක මහතාගේ හමුව සඳහා අද <span className='bg-[#0DFF00BD]'>{currentDate}</span> වන දින ඔබ  ලබා දී ඇති/ ඔබට ලබාදී ඇති නියමිත වේලාවට <span className='bg-[#0DFF00BD]'>(පෙරවරු 01.30)</span> පැමිණ සිටින්න.යම්කිසි හේතුවක් මත වේලාව වෙන් කරගැනීම අවලංගු කිරීමට අවශ්‍ය නම් ඇමතුමක් ලබාදී පෙර දැනුම් දීමක් කරන ලෙස කරුණාවෙන් ඉල්ලා සිටිමු.
             </p>
             <p className='xl:text-[15px] text-[10px] mt-1 text-justify'>Dr. Rasika Dissanayake's Appointment today, Please arrive at your scheduled time on 03/11/2020 at 01.30 AM. If you need to cancel your appointment for any reason, please call and give us prior notice.</p>
             <button 
             onClick={() => sendMessage(selectedMessage)}
             className='bg-[#0004FF] text-white xl:ml-[600px] ml-[300px] px-4 my-1 rounded border-[1px] border-[#00014B] hover:bg-[#4042b8]'>Send</button>
            </div>    
       </div>
        
       <div className='flex'>
            <div className='bg-[#C7C7C7AB] xl:w-[170px] xl:h-[130px] mt-3 xl:ml-12 border-dashed border-t-[2px] border-l-[2px] border-b-[2px] border-[#666565] py-7 text-center'>
            <span className='uppercase text-[#656565] font-[15px]'>message 02</span> 
            </div>
            <div className='bg-[#EEFF01] mt-3 border-[1px] border-black xl:w-[780px] w-[400px]'>
            <p className='xl:text-[15px] text-[12px] font-bold ml-1'><span className='bg-[#0DFF00BD]'> {currentDate}</span> වන දින වෛද්‍ය රසික දිසානායක මහතා මේ මොහොතේ පැමිණ ඇත. ඔබට නියමිත වේලාවට (පෙරවරු 01.30) පැමිණ සිටින්න.
            </p>
            <p className='xl:text-[15px] text-[10px] mt-2 ml-1'>Doctor Rasika Dissanayake  arrived here on 03/11/2020. Please arrive at 01.30 AM at the time you have given.</p>
            <button 
            onClick={() => sendMessage(selectedMessage)}
            className='bg-[#0004FF] text-white xl:ml-[600px] ml-[300px] px-4 rounded border-[1px] border-[#00014B] hover:bg-[#4042b8]'>Send</button>
            </div>    
       </div>
        
       <div className='flex'>
            <div 
            className='bg-[#C7C7C7AB] xl:w-[170px] w-[95px] xl:h-[34px] mt-3 xl:ml-12 border-dashed border-t-[2px] border-l-[2px] border-b-[2px] border-[#666565] pt-1 xl:text-center'>
               <span className='uppercase text-[#656565] font-[15px]'>custom message</span> 
            </div>
            <div className='bg-[#EEFF01] mt-3 border-[1px] border-black xl:w-[780px] w-[400px] xl:h-[34px]'>
             <input type="text" placeholder='Type Here If You Want To Send Message For Patient.' 
             className='bg-[#EEFF01] xl:w-[602px] w-[297px] h-[32px]'
             value={customMessage}
             onChange={(e) => setCustomMessage(e.target.value)}/>
             <button 
             className='bg-[#0004FF] text-white px-4 rounded border-[1px] border-[#00014B] hover:bg-[#4042b8]'
             onClick={() => sendMessage(customMessage)}
             >
            Send</button>
            </div>    
       </div>
        
    </div>
  )
}