import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import bgImage from '../../img/bg-doctorShedule.png';
import { IoIosArrowBack } from "react-icons/io";
import { FaStethoscope } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { VscColorMode } from "react-icons/vsc";
import doctorImage from '../../img/Rectangle 43.png';

export default function DoctorSchedule() {
  // Background style for the page
  const style = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '1200px',
    width: '100%',
  };
  const appointments = [
    { date: 'October 15, 2024', time: 'Thu 04:30 pm', activeAppointments: 10 },
    { date: 'October 15, 2024', time: 'Thu 04:30 pm', activeAppointments: 10 },
    { date: 'October 16, 2024', time: 'Thu 04:30 pm', activeAppointments: 0 },
    { date: 'October 17, 2024', time: 'Thu 04:30 pm', activeAppointments: 20 },
    { date: 'October 20, 2024', time: 'Thu 04:30 pm', activeAppointments: 2 },
  ];

  return (
    <div style={style}>
      <Header />

      <div>
        {/* Back Button */}
        <br /><br />
        <button 
        onClick={() => window.history.back()}
        className='bg-[#00008B] w-[100px] font-bold xl:ml-[100px] ml-[20px] rounded text-lightColor text-center shadow-custom-dark hover:bg-[#354da2] flex p-2' >
        <IoIosArrowBack className='mt-[5px] ml-[12px] font-bold'/>
       Back
       </button>

        {/* Doctor Information */}
        <div 
        className="py-2 pr-1 flex items-center border-[1px] border-dashed border-[#28225D] rounded-[20px] shadow-sm xl:ml-[200px] ml-[20px] mt-3 bg-gradient-to-b from-lightColor to-[#8ee1d5] xl:w-[650px] w-[450px] md:w-[650px] ">
       <div>
        <img src={doctorImage} alt="" className='flex xl:m-2'/>
       </div>
        <div>
            <h4 className="xl:font-[25px] font-bold text-[#000000] xl:mb-[30px] ">Dr. RASIKA DISSANAYAKE<br/>
            <span>Dr. රසික දිසානායක</span></h4>
            <ul className="pl-5 list-disc text-[#28225D]">
            <li>Pain Management</li>
            <li>Anesthetist</li>
            <li className="text-sm text-red-600">Special Notes: <span className='font-bold'>NO CANCELLATIONS AND NO REFUNDS.</span></li>
            </ul>
            </div> 
        </div>

        {/* Section Title */}
        <div className="mb-4 mt-3 font-bold xl:text-[35px] text-[25px] text-[#161D6F] xl:mr-[100px] mr-[50px] text-right">
          <h3 className="flex items-center justify-end text-right">
          <FaStethoscope className="mr-3" />
          Pain Management - Anesthetist</h3>
          <h3>{appointments.length} Sessions</h3>
        </div>
        
        {/* Appointment Cards */}
        <div className='xl:ml-[150px] ml-2 mb-[80px] md:ml-[100px]'>
        <div className="h-[400px] overflow-y-scroll xl:mr-[100px]">
          {appointments.map((appointment, index) => (
            
            <div
              key={index}
              className="flex items-center justify-between p-4 mb-4 border-[1px] border-dashed border-[#28225D] rounded-[20px] shadow-sm bg-[#DFE0EB] xl:w-[1210px] md:w-[800px] w-[450px] h-[65px] xl:h-[65px] ">
              <div className='flex'>
              <VscColorMode className='mt-[6px] text-green xl:text-[20px] md:text-[20px] text-[10px] xl:ml-[20px]'/>
              </div>
              <div>
                <ul className="xl:pl-5 list-disc xl:mr-[100px] xl:ml-6 md:ml-4 pl-5 mb-3">
                <li className="text-[#261C53] mt-3 xl:text-[15px] md:text-[15px] text-[10px]">{appointment.date}</li>
                <li className="font-semibold xl:text-[15px] md:text-[15px] text-[10px]"><span className='text-red'>{appointment.time}</span></li>
                </ul>
              </div>
          
              <div className="flex items-center text-center">
                <p className="xl:mr-[200px] md:mr-[70px] mr-[10px] xl:text-[15px] md:text-[15px] text-[9px] text-[#261C53] mt-3 ml-6">
                  ACTIVE APPOINTMENTS<br/><span className="font-bold text-red">{appointment.activeAppointments}</span>
                </p>
                
                <button className="flex px-4 py-2 text-white rounded-lg bg-red hover:bg-[#BF0000] xl:text-[15px] md:text-[15px] text-[10px]"><FaBookmark className='mt-1' />BOOK</button>
                <p className="text-[12px] text-[#261C53] mt-2 xl:mr-[100px] md:mr-[50px] pl-[50px] font-bold xl:text-[15px] md:text-[15px] mb-2">AVAILABLE</p>
                
                </div>
              
            </div>
          ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
