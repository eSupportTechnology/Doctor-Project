import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoogleIcon from '../../img/Google.png';
import AppleIcon from '../../img/Apple.png';
import FacebookIcon from '../../img/Facebook.png';
import doctorImage from '../../img/doctor.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';



const DoctorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/doctors/login', formData);
      console.log('Login Successful:', response.data); // 
      
      if (response.data.token) {
        toast.success('Login Successful!', { position: "top-center", duration: 2000 });
      
        const { token, user } = response.data;
      
        localStorage.setItem('token', token); 
        console.log('Token stored:', token);  
        
        setFormData({
          email: '', password: ''
        });
      
        setTimeout(() => {
          console.log("Navigating to /doctors");
          navigate('/doctors');
        }, 3000); 
        
        
      } else {
        toast.error('Invalid response, token missing.', { position: "top-center", duration: 3000 });
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      toast.error('Login failed. Please try again.', { position: "top-center", duration: 3000 });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Toaster/>
      {/* Background Image with Full Screen Cover */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${doctorImage})`,  // Use the imported image
        }}
      ></div>

      {/* Gradient Overlay on Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#98DED9] via-[#EEECFC] to-[#EEECFC] opacity-60 z-10"></div>

      {/* Header Component */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main Content Section */}
      <div className="flex justify-end items-center flex-grow gap-7 relative z-20 p-4 sm:p-8">
        {/* Login Form Container */}
        <div className="p-5 rounded-lg w-full max-w-[500px] bg-opacity-90 mt-20 ml-auto lg:w-2/5">

          {/* Welcome Message */}
          <h1 style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-left mb-3 text-[#261C53] font-bold text-3xl sm:text-4xl md:text-5xl">
            Welcome, Doctor!
          </h1>

          {/* Informational Paragraph */}
          <p className="text-center mb-3 text-[#261C53] text-sm sm:text-base md:text-base">
            Please sign in to access your dashboard. Here you can manage appointments, view patient records, and access important medical resources. Your commitment to healthcare excellence starts with a click.
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input Field */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Enter Email Or Phone Number"
                className="w-full px-3 py-3 rounded border border-[#7465B9] placeholder-[#7465B9]"
                name='email'
                value={formData.email}
                onChange={handleChange}
              />
              <i
                className="fa-regular fa-circle-xmark absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7465B9] cursor-pointer"
                onClick={() => setEmail('')}
              ></i>
            </div>

            {/* Password Input Field */}
            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="........."
                className="w-full px-4 py-3 rounded border border-[#7465B9] placeholder-[#7465B9]"
                name='password'
                value={formData.password}
                onChange={handleChange}
              />
              <i
                onClick={() => setShowPassword(!showPassword)}
                className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'
                  } absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7465B9] cursor-pointer`}
              ></i>
            </div>

            {/* Remember Me and Forgot Password Links */}
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-[#261C53] text-sm sm:text-base md:text-base">Forgot Password?</a>
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
              <img src={GoogleIcon} alt="Google" className="w-17 h-16 sm:w-36 sm:h-24 cursor-pointer" />
              <img src={AppleIcon} alt="Apple" className="w-17 h-16 sm:w-36 sm:h-24 cursor-pointer" />
              <img src={FacebookIcon} alt="Facebook" className="w-17 h-16 sm:w-36 sm:h-24 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>


      {/* Footer Component */}
      <div className="relative z-20 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default DoctorLogin;
