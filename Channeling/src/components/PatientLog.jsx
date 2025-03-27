import React, { useState } from 'react'; 
import bgimage from '../img/patientBg.png';
import GoogleIcon from '../img/Google.png';
import AppleIcon from '../img/Apple.png';
import FacebookIcon from '../img/Facebook.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fontsource/montserrat/700.css';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const PatientLog = () => {
  const [showPassword, setShowPassword] = useState(false);
 // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [show, setshow] = useState(false)
  console.log(show);

  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   /*onst handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/patient/login', formData);
            console.log('Login Successful:', response.data);
            toast.success('Login Successful!', { position: "top-center" });
            //navigate('/');

            setFormData({
              identifier: '', password: ''
            });
            
            setTimeout(() => {
              navigate('/'); // 2 seconds delay before navigating
          }, 2000);
            
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            //setErrorMessage('Login failed. Please check your credentials.');

            toast.error('Login failed. Please try again.', { position: "top-center" });
        }
    };*/

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:8081/patient/login', formData);
          console.log('Login Successful:', response.data);
          toast.success('Login Successful!', { position: "top-center" });
          //navigate('/');
          
          localStorage.setItem("patientAuthToken", response.data.token); // Save token
          setFormData({
            identifier: '', password: ''
          });
          
          setTimeout(() => {
            navigate('/patients'); // 2 seconds delay before navigating
        }, 2000);
          
      } catch (error ) {
          console.error('Login Error:', error.response?.data || error.message);
          //setErrorMessage('Login failed. Please check your credentials.');

          toast.error('Login failed. Please try again.', { position: "top-center" });
      }
  };


  
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background Image with Full Screen Cover */} 
      <Toaster/>
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${bgimage})`,
        }}
      ></div>

        
      {/* Gradient Overlay on Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#c6f5f2] via-[#eeecfc88] to-[#EEECFC] opacity-60 z-10"></div>

      {/* Back Button  
      <button
        onClick={() => window.history.back()}
        className="absolute top-[8%] left-[100px] px-6 py-2 bg-[#161D6F] text-white rounded flex items-center text-sm md:text-base z-30 font-bold"
      >
        <i className="mr-1 text-[12px] white text- fas fa-chevron-left"></i>
        Back
      </button>*/}
      {/* Main Content Section */}
      <div className="relative z-20 flex items-center justify-end flex-grow p-4 gap-7 sm:p-8">
        {/* Login Form Container */}
        <div className="p-5 rounded-lg w-full max-w-[500px] bg-opacity-90 mt-20 ml-auto lg:w-2/5">
          {/* Welcome Message */}
          <h1
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            className="text-left mb-[50px] text-[#261C53] font-bold text-3xl sm:text-4xl md:text-5xl"
          >
            Welcome to Our Patient Portal!
          </h1>

          {/* Login Form */}
          <form action="" onSubmit={handleSubmit}>
            {/* Email Input Field */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Enter Email Or Phone Number"
                className="w-full px-3 py-3 rounded border border-[#7465B9] placeholder-[#7465B9]"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
              />
              <i
                className="fa-regular fa-circle-xmark absolute right-3 top-6 transform -translate-y-1/2 text-[#7465B9] cursor-pointer"
                onClick={() => setFormData({ ...formData, identifier: '' })}
              ></i>
              <p className='pl-5 pr-5 text-[17px] font-extrabold text-[#7465B9]'>ඔබගේ ඊමේල් හෝ දුරකථන අංකය ඇතුලත් කරන්න</p>
            </div>
  
            {/* Password Input Field */}
            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded border border-[#7465B9] placeholder-[#7465B9]"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                onClick={() => setShowPassword(!showPassword)}
                className={`fa-regular ${
                  showPassword ? 'fa-eye' : 'fa-eye-slash'
                } absolute right-3 top-6 transform -translate-y-1/2 text-[#7465B9] cursor-pointer`}
              ></i>
              <p className='pl-5 pr-5 text-[17px] font-extrabold text-[#7465B9]'>මුරපදය ඇතුලත් කරන්න</p>
            </div>

            {/* Remember Me and Forgot Password Links */}
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-[#261C53] text-sm sm:text-base md:text-base hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{ fontFamily: 'Calibri, sans-serif' }}
              className="w-full py-2.5 bg-[#7465B9] rounded text-white text-lg font-bold"
            >
              Login
            </button>
          </form>

          {/* Divider for Alternative Sign-In Options */}
          <div className="mt-8 text-center">
            <div className="flex items-center gap-3">
              <span className="flex-1 border-t border-[#7465B9]"></span>
              <p className="text-[#2B2768]">Or continue with</p>
              <span className="flex-1 border-t border-[#7465B9]"></span>
            </div>

            {/* Social Media Sign-In Icons */}
            <div className="flex justify-center gap-5 mt-5">
              <img src={GoogleIcon} alt="Google" className="h-16 cursor-pointer w-17 sm:w-36 sm:h-24 hover:scale-[105%] transition-all duration-300" />
              <img src={AppleIcon} alt="Apple" className="h-16 cursor-pointer w-17 sm:w-36 sm:h-24 hover:scale-[105%] transition-all duration-300" />
              <img src={FacebookIcon} alt="Facebook" className="h-16 cursor-pointer w-17 sm:w-36 sm:h-24 hover:scale-[105%] transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <div className="relative z-20 mt-auto">
      
      </div>
    </div>
  );
};

export default PatientLog;
