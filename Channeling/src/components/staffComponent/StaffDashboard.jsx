import React, { useState, useRef,useEffect } from 'react';
import axios from "axios";

//components
import PatientList from '../doctorComponent/PatientList';
import DateAvailability from '../doctorComponent/DateAvailability';

//icons
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

//images
import ContainerImg  from '../../img/doctorDashContainor01.png';
import PatientIcon from '../../img/patientIcon.png';
import AppointmentIcon from '../../img/appointmentIcon.png';
import DollarIcon from '../../img/dollarIcon.png';

const StaffDashboard = () => {

  const DoctorDashboard = {TotalPatients: "100", TotalAppointment: "120", TotalPayment: "1000.00", MonthlypatientCount: "30", PreviousMonthCount: "40", PreviousMonthPresentage: "30%", CurrentMonthCount: "60", CurrentMonthPresentage: "70%" };

    const [profileDetails, setProfileDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
      // Fetch profile details after login
      useEffect(() => {
        const fetchProfileDetails = async () => {
          try {
            const token = localStorage.getItem("staffAuthToken"); // Retrieve token from localStorage
            const response = await axios.get("http://localhost:8081/staff/me", {
              headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
              },
            });
            setProfileDetails(response.data);
            setIsLoading(false);
          } catch (err) {
            setError("Failed to load profile details.");
            setIsLoading(false);
          }
        };
        fetchProfileDetails();
      }, []);
  return (
    <div className="bg-transparent border-2 border-[#C0C2C2] md:border-0 md:border-transparent p-2 md:p-0">
        <h1 className="text-[20px] uppercase font-semibold text-left">Dashboard</h1>
        {/* Main Container */}
        <div className="mb-1 mt-7">
            {/* Container 01 */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="grid grid-cols-1 gap-4 mt-3 lg:grid-cols-5">
                {/* Monthly Patient details Container */}
                <div className="lg:col-span-3 w-full h-fit sm:h-[350px]">
                {profileDetails && (
                    <h2 className="text-lg font-medium text-left text-black">WelCome  <span className="font-bold text-xl text-[#3E36B0]">{profileDetails.firstName} {profileDetails.lastName}</span></h2>
                )}
                    {/* Monthly Patient Count Container */}
                    <div className="w-full h-fit sm:h-[310px] shadow-lg mt-3 p-3" style={{backgroundImage: `url(${ContainerImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
                        <h2 className="text-2xl font-semibold text-left text-black">Monthly Patient Count</h2>
                        <h2 className="text-left font-semibold text-[38px] text-black my-4">{DoctorDashboard.MonthlypatientCount}</h2>
                        <div className="space-y-2 sm:flex sm:space-x-10 sm:space-y-0">
                            {/* Patient count Monthly comparison container */}
                            <div className="w-[200px] h-[130px] rounded-xl bg-white p-5 hover:scale-[102%] md:hover:scale-105  transition-all duration-300">
                                <p className="mt-1 font-semibold text-md">Previous Month</p>
                                <div className="flex justify-between my-3 align-middle ">
                                    <p className="my-2 text-3xl font-semibold text-center">{DoctorDashboard.PreviousMonthCount}</p>
                                    <p className={`flex font-semibold my-2 text-sm text-center py-2 px-3 rounded-lg ${DoctorDashboard.PreviousMonthPresentage > DoctorDashboard.CurrentMonthPresentage ? 'bg-[#DFFDDD] text-[#008000]' : 'bg-[#FBC3C3] text-[#D30404]'}`}>
                                        {DoctorDashboard.PreviousMonthPresentage}
                                        {DoctorDashboard.PreviousMonthPresentage > DoctorDashboard.CurrentMonthPresentage ? <FaArrowTrendUp className="mt-1 ml-2 text-md" /> : <FaArrowTrendDown className="mt-1 ml-2 text-md" />}
                                    </p>
                                </div>
                            </div>
                            <div className="w-[200px] h-[130px] rounded-xl bg-white p-5 hover:scale-[102%] md:hover:scale-105  transition-all duration-300">
                                <p className="my-1 font-semibold text-md">Current Month</p>
                                <div className="flex justify-between my-3 align-middle">
                                    <p className="my-2 text-3xl font-semibold text-center">{DoctorDashboard.CurrentMonthCount}</p>
                                    <p className={`flex font-semibold my-2 text-sm text-center py-2 px-3 rounded-lg ${DoctorDashboard.CurrentMonthPresentage > DoctorDashboard.PreviousMonthPresentage ? 'bg-[#DFFDDD] text-[#008000]' : 'bg-[#FBC3C3] text-[#D30404]'}`}>
                                        {DoctorDashboard.CurrentMonthPresentage}
                                        {DoctorDashboard.CurrentMonthPresentage > DoctorDashboard.PreviousMonthPresentage ? <FaArrowTrendUp className="mt-1 ml-2 text-md" /> : <FaArrowTrendDown className="mt-1 ml-2 text-md" />}
                                    </p>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
                {/*  */}
                <div className="lg:col-span-2 w-full h-[350px] bg-white shadow-lg">
                </div>
            </div>
            {/* Container 03 */}
            <div className="grid grid-cols-1 gap-4 mt-3 lg:grid-cols-2">
                {/*  */}
                <div className="w-full h-[565px] bg-gradient-to-tr from-[#D5F3FF] to-white shadow-lg">
                    <PatientList />
                </div>
                {/*  */}
                <div className="w-full bg-gradient-to-tl h-[565px] from-[#D5F3FF] to-white shadow-lg">
                    <DateAvailability />
                </div>
            </div>
        </div>
    </div>
  );
};

export default StaffDashboard;