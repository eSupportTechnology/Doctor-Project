import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PatientsAppointment from '../../components/doctorComponent/PatientsAppointment';
import Message from '../../components/Message';
import Invoice from '../../components/Invoice';
import ScheduleTime from './ScheduleTime';  
import ProfileSettings from './ProfileSettings';
import DoctorDashboard from '../../components/doctorComponent/DoctorDashboard';

// Images
import profilebg from '../../img/doctorsProfileBg.png';
import profilePlaceholder from '../../img/doctorsPageIcon.png';

// Icons
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { MdFormatAlignJustify, MdOutlineMessage, MdEventNote, MdOutlineAccountCircle, MdAutoAwesomeMosaic } from "react-icons/md";
import { TfiReceipt } from "react-icons/tfi";

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Are you sure you want to logout?</h2>
        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-[#161D6F] text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            OK
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Doctors = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const rightSideRef = useRef(null);
  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/DoctorLogin');
      return;
    }
  
    fetch('http://localhost:8081/api/doctor/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        console.log(doctorDetails?.profileImage); 
        setDoctorDetails(data);
      })
      .catch((error) => {
        console.error('Error fetching doctor details:', error);
        navigate('/DoctorLogin');
      });
  }, [navigate]);
  
  const handleMenuClick = (menu) => {
    if (menu === 'logout') {
      setIsLogoutModalOpen(true); 
    } else {
      setActiveMenu(menu);
      setIsMobileMenuOpen(false);
      if (rightSideRef.current) {
        rightSideRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    toast.success('You have been successfully logged out.', { position: "top-center", duration: 2000 });
    setTimeout(() => {
      localStorage.removeItem('token'); // Clear token or session
      navigate('/DoctorLogin');
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-l from-[#98DED9] to-[#fdfdff] to-60%">
      <Header />
      <div className="grid w-full h-auto grid-cols-1 mt-2 md:grid-cols-7">
        {/* Left Side */}
        <div className="col-span-1 md:col-span-2 border-2 border-[#98DED9] m-2 md:ml-3 md:mt-3 h-auto">
          {/* Profile */}
          <div className="bg-[#F1EFFC] w-full h-auto border-b-2 border-b-[#98DED9]">
            <img src={profilebg} alt="profile_background" className="w-full h-[229px] object-cover" />
            <div className="pb-2">
                <img
                src={doctorDetails?.profileImage || profilePlaceholder}
                alt="Doctor Profile"
                className="object-cover w-32 h-32 mx-auto -mt-16 rounded-full shadow-lg"
                onError={(e) => {
                  e.target.src = profilePlaceholder;
                }}
              />
              <h2 className="uppercase text-center mt-2 font-bold text-[25px] text-[#161D6F]">
                {doctorDetails?.name || 'Doctor Name'}
              </h2>
              <h4 className="uppercase text-center -mt-2 font-bold text-[20px] text-[#7465B9]">
                {doctorDetails?.specialization || 'Specialization'}
              </h4>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className="mx-6 my-12 md:hidden">
            <a
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex cursor-pointer items-center w-full text-left no-underline focus:outline-none hover:text-[#5f44c8] rounded-lg text-[20px] font-bold transition-all duration-300 ease-in-out
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

          {/* Navbar (Desktop) */}
          <div className="hidden my-12 ml-6 md:block">
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
        </div>

        {/* Right Side */}
        <div ref={rightSideRef} className="h-auto col-span-1 m-2 md:col-span-5 border-1 md:ml-3 md:mt-3">
          {/* Components */}
          {activeMenu === 'dashboard' && <DoctorDashboard />}
          {activeMenu === 'appointment' && <PatientsAppointment />}
          {activeMenu === 'scheduleTiming' && <ScheduleTime />}
          {activeMenu === 'messages' && <div><Message /></div>}
          {activeMenu === 'invoice' && <div><Invoice/></div>}
          {activeMenu === 'profileSettings' && <ProfileSettings />}
        </div>
      </div>
      <Footer />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Doctors;
