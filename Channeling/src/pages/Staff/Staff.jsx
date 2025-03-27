import React, { useState, useRef,useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from "axios";
import StaffMiddleware from "./StaffMiddleware";

//components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StaffDashboard from '../../components/staffComponent/StaffDashboard';
import PatientsAppointment from '../../components/staffComponent/PatientsAppointment';
import ScheduleTime from '../../components/staffComponent/ScheduleTime';
import Message from '../../components/staffComponent/Message';
import Invoice from '../../components/staffComponent/Invoice';
import ProfileSettings from '../../components/staffComponent/ProfileSettings'; 

//images
import profilebg from '../../img/doctorsProfileBg.png';
import profile from '../../img/doctorsPageIcon.png';

//icons
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { MdFormatAlignJustify, MdOutlineMessage, MdEventNote, MdOutlineAccountCircle, MdAutoAwesomeMosaic } from "react-icons/md";
import { TfiReceipt } from "react-icons/tfi";
import userIcon from "../../img/user.png";

const Staff = () => {

  const [activeMenu, setActiveMenu] = useState('dashboard'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const rightSideRef = useRef(null);

  const staffDetails = {
    name: 'Staff',
    field: 'Main',
  };
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

  // Scroll to the top of the right side when the menu is clicked
  const handleMenuClick = (menu) => {
    // Logout message
    if (menu === 'logout') {
      Swal.fire({
        title: '<h2 class="text-[#522422]">Confirm Logout</h2>',
        html: `
          <div class="border-dashed border-t-2 border-black text-[16px] text-[#6A6A6A] m-0">
            Are you sure you want to logout? You will be logged out from your account.
          </div>
        `,
        iconHtml: '<i class="fa-solid fa-arrow-right-from-bracket text-[#ffffff] bg-[#fe0003] text-[40px] p-5 rounded-full"></i>',
        confirmButtonText: '<span class="text-[#000000]">Yes, logout</span>',
        confirmButtonColor: '#fe0003',
        showCloseButton: true,
        width: '550px',
      }).then((result) => {
        if (result.isConfirmed) {
          handleLogout();
        }
      });
    } else {
      setActiveMenu(menu);
      setIsMobileMenuOpen(false);
      if (rightSideRef.current) {
        rightSideRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Handle Logout
const handleLogout = () => {
  // Remove the auth token from local storage
  localStorage.removeItem("staffAuthToken");

  // success message
  Swal.fire({
    title: '<h2 class="text-[#003C01]">Logged Out</h2>',
    text: 'You have been successfully logged out.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    width: '550px',
  }).then(() => {
    // Redirect to the login page after logout
    window.location.href = '/StaffLogin'; // or use history.push() if using React Router
  });
};
  
  return (
  <StaffMiddleware>
      <div className="bg-gradient-to-l from-[#98DED9]  to-[#fdfdff] to-60%">
        <Header />
       
        <div className="grid w-full h-auto grid-cols-1 mt-2 md:grid-cols-7">
          {/* left side */}
          <div className="col-span-1 md:col-span-2 border-2 border-[#98DED9] m-2 md:ml-3 md:mt-3 h-auto">
            {/* profile */}
            <div className="bg-[#F1EFFC] w-full h-auto border-b-2 border-b-[#98DED9]">
            <img src={profilebg} alt="profile_background" className="w-full h-[229px] object-cover" />
            <div className="pb-2">
            {profileDetails && (
              <div className="pb-2">
                <img
                  src={`http://localhost:8081/uploads/${profileDetails.profileImage || userIcon}`}
                  alt="Profile_image"
                  className="object-cover w-32 h-32 mx-auto -mt-16 rounded-full shadow-lg"
                />
              <h2 className="uppercase text-center mt-2 font-bold text-[25px] text-[#161D6F]">
              {staffDetails.name}
              </h2>
              <h4 className="uppercase text-center -mt-2 font-bold text-[20px] text-[#7465B9]">
              {profileDetails.firstName} {profileDetails.lastName}
              </h4>
              </div>
            )}

            </div>
          </div>
             
            {/* navbar */}
            {/* menu items (Desktop) */}
            <div className="hidden my-12 ml-6 md:block ">
              <ul className="text-[20px] font-bold">

                {[
                  { key: 'dashboard', label: 'Dashboard', icon: <MdFormatAlignJustify className="mr-5 text-2xl" /> },
                  { key: 'appointment', label: 'Appointment', icon: <BsFillJournalBookmarkFill className="mr-5 text-xl" /> },
                  { key: 'scheduleTiming', label: 'Schedule Timing', icon: <MdEventNote className="mr-5 text-2xl" /> },
                  { key: 'messages', label: 'Messages', icon: <MdOutlineMessage className="mr-5 text-2xl" /> },
                  { key: 'invoice', label: 'Invoice', icon: <TfiReceipt className="mr-5 text-2xl" /> },
                  { key: 'profileSettings', label: 'Profile Settings', icon: <MdOutlineAccountCircle className="mr-5 text-2xl" /> },
                  { key: 'logout', label: 'Logout', icon: <AiOutlineLogout className="mr-5 text-2xl" /> },
                ].map((item) => (
                  <li key={item.key} className="my-7">
                    <button
                      onClick={() => handleMenuClick(item.key)}
                      className={`w-full text-left no-underline focus:outline-none hover:text-[#5f44c8] rounded-lg
                        ${activeMenu === item.key ? 'text-[#00FF03] hover:text-[#4ae14c]' : 'text-[#261C53]'}`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="sidebar-title">{item.label}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* menu items (Mobile) */}
            <div className="mx-6 my-12 md:hidden">
              <a
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center w-full text-left no-underline focus:outline-none hover:text-[#5f44c8] rounded-lg text-[20px] font-bold transition-all duration-300 ease-in-out
                  ${isMobileMenuOpen ? 'text-[#5f44c8] scale-105 ml-4' : 'text-[#261C53] scale-100 ml-0'}`}
              >
                <MdAutoAwesomeMosaic className="mr-5 text-2xl" />
                <span>MENU</span>
              </a>
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out
                  ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <ul className="mt-4 text-[20px] font-bold border-y-2 border-[#c4c4c4]">
                  {[
                    { key: 'dashboard', label: 'Dashboard', icon: <MdFormatAlignJustify className="mr-5 text-2xl" /> },
                    { key: 'appointment', label: 'Appointment', icon: <BsFillJournalBookmarkFill className="mr-5 text-xl" /> },
                    { key: 'scheduleTiming', label: 'Schedule Timing', icon: <MdEventNote className="mr-5 text-2xl" /> },
                    { key: 'messages', label: 'Messages', icon: <MdOutlineMessage className="mr-5 text-2xl" /> },
                    { key: 'invoice', label: 'Invoice', icon: <TfiReceipt className="mr-5 text-2xl" /> },
                    { key: 'profileSettings', label: 'Profile Settings', icon: <MdOutlineAccountCircle className="mr-5 text-2xl" /> },
                    { key: 'logout', label: 'Logout', icon: <AiOutlineLogout className="mr-5 text-2xl" /> },
                  ].map((item) => (
                    <li key={item.key} className="my-5">
                      <button
                        onClick={() => handleMenuClick(item.key)}
                        className={`w-full ml-5 text-left no-underline focus:outline-none hover:text-[#5f44c8] rounded-lg transition-colors duration-300 ease-in-out
                          ${activeMenu === item.key ? 'text-[#00FF03]' : 'text-[#261C53]'}`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="sidebar-title">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* right side */}
          <div ref={rightSideRef} className="h-auto col-span-1 m-2 md:col-span-5 border-1 md:ml-3 md:mt-3">
            {/* components */}
            {activeMenu === 'dashboard' && <StaffDashboard />}
            {activeMenu === 'appointment' && <PatientsAppointment />}
            {activeMenu === 'scheduleTiming' && <ScheduleTime />}
            {activeMenu === 'messages' && <Message />}
            {activeMenu === 'invoice' && <Invoice />}
            {activeMenu === 'profileSettings' && <ProfileSettings />}
           
          </div>
        </div>
        <Footer />
      </div>
    </StaffMiddleware>

  );
};

export default Staff;