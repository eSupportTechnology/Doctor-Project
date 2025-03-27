import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 


//components
import PatientList from './PatientList';
import DateAvailability from './DateAvailability';

//icons
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

//images
import ContainerImg  from '../../img/doctorDashContainor01.png';
import PatientIcon from '../../img/patientIcon.png';
import AppointmentIcon from '../../img/appointmentIcon.png';
import DollarIcon from '../../img/dollarIcon.png';
import DoctorCalendar from './DoctorCalendar';


const DoctorDashboard = () => {
const [doctorName, setDoctorName] = useState('');
const navigate = useNavigate();

const DoctorDashboard = {TotalPatients: "100", TotalAppointment: "120", TotalPayment: "1000.00", MonthlypatientCount: "30", PreviousMonthCount: "40", PreviousMonthPresentage: "30%", CurrentMonthCount: "60", CurrentMonthPresentage: "70%" };


useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    } 
    
    fetch('http://localhost:8081/api/doctor/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Doctor name:', data.name);  
        setDoctorName(data.name);  
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, []);


  return (
    <div className="bg-transparent border-2 border-[#C0C2C2] md:border-0 md:border-transparent p-2 md:p-0">
        <h1 className="text-[20px] uppercase font-semibold text-left">Dashboard</h1>
        {/* Main Container */}
        <div className="mt-7 mb-1">
            {/* Container 01 */}
            <div className="grid grid-cols-1 w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Patients Container */}
                <div className="flex  w-full bg-white py-5 px-3 xl:px-6 h-32 hover:scale-[102%] md:hover:scale-105 transition-all duration-300 bg-gradient-to-tr from-[#D5F3FF] to-white shadow-lg">
                    <div className="bg-white border-4 border-[#3E36B0] w-[75px] h-[75px] content-center rounded-full">
                        <img src={PatientIcon} alt="patient" className="w-10 h-10 m-auto" />
                    </div>
                    <div className="ml-4">
                        <p className="text-[18px] font-semibold text-[#7B7B7B]">Total Patients</p>
                        <p className="text-[30px] font-bold text-[#3E36B0] -mt-2">{DoctorDashboard.TotalPatients}</p>
                        <p className="text-[18px] font-normal text-[#A9A9A9] -mt-2">Till Today</p>
                    </div>
                </div>
                {/* Total Appointment Container */}
                <div className="flex  w-full bg-white py-5 px-3 xl:px-6 h-32 hover:scale-[102%] md:hover:scale-105 transition-all duration-300 bg-gradient-to-tr from-[#D5F3FF] to-white shadow-lg">
                    <div className="bg-white border-4 border-[#3E36B0] w-[75px] h-[75px] content-center rounded-full">
                        <img src={AppointmentIcon} alt="Appointment" className="w-10 h-10 m-auto" />
                    </div>
                    <div className="ml-4">
                        <p className="text-[18px] font-semibold text-[#7B7B7B]">Total Appointment</p>
                        <p className="text-[30px] font-bold text-[#3E36B0] -mt-2">{DoctorDashboard.TotalAppointment}</p>
                        <p className="text-[18px] font-normal text-[#A9A9A9] -mt-2">Till Today</p>
                    </div>
                </div>
                {/* Total Payment Container */}
                <div className="flex  w-full bg-white py-5 px-3 xl:px-6 h-32 hover:scale-[102%] md:hover:scale-105 transition-all duration-300 bg-gradient-to-tr from-[#D5F3FF] to-white shadow-lg">
                    <div className="bg-white border-4 border-[#3E36B0] w-[75px] h-[75px] content-center rounded-full">
                        <img src={DollarIcon} alt="Appointment" className="w-12 h-12 m-auto" />
                    </div>
                    <div className="ml-4">
                        <p className="text-[18px] font-semibold text-[#7B7B7B]">Total Payment</p>
                        <p className="text-[30px] font-bold text-[#3E36B0] -mt-2">RS.{DoctorDashboard.TotalPayment}</p>
                        <p className="text-[18px] font-normal text-[#A9A9A9] -mt-2">Till Today</p>
                    </div>
                </div>
            </div>
            {/* Container 02 */}
            <div className="grid grid-cols-1 mt-3 gap-4 lg:grid-cols-5">
                {/* Monthly Patient details Container */}
                <div className="lg:col-span-3 w-full h-fit sm:h-[350px]">
                <h2 className="text-left font-medium text-lg text-black">Good Morning <span className="font-bold text-xl text-[#3E36B0]">{doctorName ? `Dr. ${doctorName}` : 'Loading...'}</span></h2>
                    {/* Monthly Patient Count Container */}
                    <div className="w-full h-fit sm:h-[310px] shadow-lg mt-3 p-3" style={{backgroundImage: `url(${ContainerImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
                        <h2 className="text-left font-semibold text-2xl text-black">Monthly Patient Count</h2>
                        <h2 className="text-left font-semibold text-[38px] text-black my-4">{DoctorDashboard.MonthlypatientCount}</h2>
                        <div className="space-y-2 sm:flex sm:space-x-10 sm:space-y-0">
                            {/* Patient count Monthly comparison container */}
                            <div className="w-[200px] h-[130px] rounded-xl bg-white p-5 hover:scale-[102%] md:hover:scale-105  transition-all duration-300">
                                <p className="font-semibold mt-1 text-md">Previous Month</p>
                                <div className="flex justify-between my-3 align-middle ">
                                    <p className="font-semibold my-2 text-center  text-3xl">{DoctorDashboard.PreviousMonthCount}</p>
                                    <p className={`flex font-semibold my-2 text-sm text-center py-2 px-3 rounded-lg ${DoctorDashboard.PreviousMonthPresentage > DoctorDashboard.CurrentMonthPresentage ? 'bg-[#DFFDDD] text-[#008000]' : 'bg-[#FBC3C3] text-[#D30404]'}`}>
                                        {DoctorDashboard.PreviousMonthPresentage}
                                        {DoctorDashboard.PreviousMonthPresentage > DoctorDashboard.CurrentMonthPresentage ? <FaArrowTrendUp className="ml-2 mt-1 text-md" /> : <FaArrowTrendDown className="ml-2 mt-1 text-md" />}
                                    </p>
                                </div>
                            </div>
                            <div className="w-[200px] h-[130px] rounded-xl bg-white p-5 hover:scale-[102%] md:hover:scale-105  transition-all duration-300">
                                <p className="font-semibold my-1 text-md">Current Month</p>
                                <div className="flex justify-between my-3 align-middle">
                                    <p className="font-semibold my-2 text-center  text-3xl">{DoctorDashboard.CurrentMonthCount}</p>
                                    <p className={`flex font-semibold my-2 text-sm text-center py-2 px-3 rounded-lg ${DoctorDashboard.CurrentMonthPresentage > DoctorDashboard.PreviousMonthPresentage ? 'bg-[#DFFDDD] text-[#008000]' : 'bg-[#FBC3C3] text-[#D30404]'}`}>
                                        {DoctorDashboard.CurrentMonthPresentage}
                                        {DoctorDashboard.CurrentMonthPresentage > DoctorDashboard.PreviousMonthPresentage ? <FaArrowTrendUp className="ml-2 mt-1 text-md" /> : <FaArrowTrendDown className="ml-2 mt-1 text-md" />}
                                    </p>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
                {/* Container 03 */}
                <div className="lg:col-span-2 w-full h-[350px] bg-white shadow-lg">
                    <DoctorCalendar />
                </div>
            </div>
            {/* Container 04 */}
            <div className="grid grid-cols-1 gap-4 mt-3 lg:grid-cols-2">
                {/* PatientList component */}
                <div className="w-full h-[565px] bg-gradient-to-tr from-[#D5F3FF] to-white shadow-lg">
                    <PatientList />
                </div>
                {/* Monthly Payment component */}
                <div className="w-full bg-gradient-to-tl h-[565px] from-[#D5F3FF] to-white shadow-lg">
                    <DateAvailability />
                </div>
            </div>
        </div>
    </div>
  );
};

export default DoctorDashboard;