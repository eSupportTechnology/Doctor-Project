import React, { useState } from 'react'
import registerbg from '../img/RegisterBg.png';
import { IoIosArrowBack } from "react-icons/io";
import image1 from '../img/Google.png';
import image2 from '../img/Apple.png';
import image3 from '../img/Facebook.png';
import { IoMdCloseCircleOutline, IoMdClose } from "react-icons/io";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


import axios from 'axios';



export default function Register() {
  const style = {
    backgroundImage: `url(${registerbg})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',

  };


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    nic: '',
    username: '',
    password: '',
    profileImage: null,
  })

  //const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  /*const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
 
    try {
        const response = await axios.post('http://localhost:8081/patient/register', formData);
        //setSuccessMessage('Registered successfully');
        toast.success("Registered successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      });
        
        setFormData({ 
          firstName: '',
          lastName: '',
          dob: '',
          gender: '',
          phone: '',
          email: '',
          address: '',
          nic: '',
          username: '',
          password: '',
          profileImage: null,
        });

        setTimeout(() => {
          navigate('/signin'); // 2 seconds delay before navigating
      }, 2000);
        console.log('Registered successfully:', response.data);
    } catch (error) {

      toast.error("Registration failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
        console.error('Error during registration:', error.response?.data || error.message);
    }
};*/


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        'http://localhost:8081/patient/register',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Registered successfully!');
      setTimeout(() => navigate('/patientLogin'), 2000);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };


  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0], // File object එක යෙදේ.
    });
  };



  return (
    <div className='w-full'>
      <div style={style} className=' w-full xl:h-[850px] h-[1600px] md:h-[750px]'>
        <Toaster />
        <div className='bg-gradient-to-r from-[#98DED9D6] to-[#EEECFCD6] w-full xl:h-[900px] h-[1600px]'>
          {/* Back Button*/}
          <br /><br />

          {/* Form section */}
          <form action="" onSubmit={handleSubmit} className='flex-row xl:flex ml-[10px] mt-[20px] xl:ml-[250px] md:ml-[80px] lg:ml-[80px] md:flex'>
            <div className='xl:w-[200px] h-[600px] w-[150px] md:w-[500px] md:h-[600px] xl:ml-0 ml-3'>


              <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px]'>Full Name</label>
              <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px] font-[Calibri]'>(මුල නම සහ අග නම ඇතුළත් කරන්න.)</label>

              <div className='flex'>
                <div className='flex'>
                  <input type="text"
                    className='mt-[5px] xl:ml-0 ml-[20px] pl-4 py-1.5 xl:w-[250px] md:w-[200px] w-[150px] h-[50px] placeholder-[#7465B9] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]'
                    placeholder='First Name' name="firstName"
                    value={formData.firstName}
                    onChange={handleChange} required />
                  {/*<IoMdCloseCircleOutline className='absolute text-[#7465B9] cursor-pointer xl:ml-[220px] ml-[140px] mt-6' />*/}
                  <IoMdCloseCircleOutline
                    className={`absolute xl:ml-[215px] md:ml-[180px] ml-[140px] mt-5 text-[#7465B9] cursor-pointer 
          ${!formData.firstName && 'opacity-50 pointer-events-none'
                      }`}
                    onClick={() => setFormData({ ...formData, firstName: '' })}
                  />
                </div>
                <div className='flex ml-3'>
                  <input type="text"
                    className='mt-[5px] xl:ml-[10px] xl:w-[250px] w-[150px] md:w-[200px] pl-4 py-1.5 placeholder-[#7465B9] text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]'
                    placeholder='Last Name' name='lastName'
                    value={formData.lastName}
                    onChange={handleChange} required />
                  <IoMdCloseCircleOutline
                    className={`absolute xl:ml-[225px] md:ml-[165px] ml-[120px] mt-5 text-[#7465B9] cursor-pointer 
          ${!formData.lastName && 'opacity-50 pointer-events-none'
                      }`}
                    onClick={() => setFormData({ ...formData, lastName: '' })}
                  />
                </div>
              </div>

              <div className='mt-[20px]'>
                <div className='flex-row xl:flex md:flex'>

                  <div>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px] '>Date of Birth</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px] '>(උපන්දිනය ඇතුළත් කරන්න.)</label>
                    <input type="date" name='dob'
                      placeholder="MM/DD/YYYY" required value={formData.dob}
                      onChange={handleChange}
                      className='mt-[5px] p-3 text-[#7465B9] xl:ml-0 ml-[20px] xl:w-[250px] md:w-[200px] w-[300px] h-[50px] placeholder-black text-[15px] border-[1px] border-[#7465B9] hover:border-black rounded-[9px]' />
                  </div>


                  <div className='xl:ml-5 xl:mt-0 mt-[20px] md:mt-0'>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px] '>Gender</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px]'>(ස්ත්‍රී පුරුෂ භාවය.)</label>
                    <div className='bg-white mt-[5px] xl:pl-7 pl-12 md:pl-4 xl:ml-0 ml-[20px] xl:py-3 py-3  xl:w-[250px] md:w-[200px] w-[300px] h-[50px] placeholder-[#7465B9] placeholder:text-[10px] border-[1px] border-[#7465B9] hover:border-black rounded-[9px]'>
                      <input type="radio" id="female"
                        name="gender" value="female" checked={formData.gender === "female"}
                        onChange={handleChange} />
                      <label htmlFor="" className='text-[#7465B9] mt-4 text-[14px] ml-2'>Female</label>
                      <input type="radio" id="male"
                        name="gender" className='ml-10' value="male" checked={formData.gender === "male"}
                        onChange={handleChange} />
                      <label htmlFor="" className='text-[#7465B9] text-[14px] ml-2'>Male</label>
                    </div>
                  </div>

                </div>
              </div>

              <div className='mt-[20px]'>
                <div>
                  <label htmlFor="" className=' text-[#7465B9] xl:text-[17px] text-[13px] '>Your profile image</label>
                  <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px] '>(ඔබගේ ඡයාරූපය ඇතුළත් කරන්න.)</label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleFileChange}
                    className="mt-[5px] pl-4 py-1.5 xl:ml-0 ml-[20px] xl:w-[520px] w-[300px] h-[50px] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px] bg-white md:w-[420px] text-[#7465B9]"
                  />
                </div>
              </div>

              <div className='mt-[20px]'>
                <div className='flex-row xl:flex md:flex'>

                  <div>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px]'>Phone Number</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px]'>(දුරකථන අංකය ඇතුළත් කරන්න.)</label>
                    <input type="text" name='phone' value={formData.phone} onChange={handleChange}
                      placeholder="" required
                      className='mt-[5px] pl-4 py-1.5 xl:ml-0 ml-[20px] xl:w-[250px] md:w-[200px] w-[300px] h-[50px] placeholder-[#7465B9] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]' />
                  </div>

                  <div className='xl:ml-5 xl:mt-0 mt-[20px] md:mt-0'>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px]'>Email Address</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px]'>(විද්‍යුත් ලිපිනය ඇතුළත් කරන්න.)</label>
                    <input type="email" name='email' value={formData.email} onChange={handleChange}
                      placeholder="" required
                      className='mt-[5px] pl-4 py-1.5 xl:ml-0 ml-[20px] xl:w-[250px] md:w-[200px] w-[300px] h-[50px] placeholder-[#7465B9] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]' />
                  </div>

                </div>
              </div>

              <div className='mt-[20px]'>
                <div className='flex-row xl:flex md:flex'>

                  <div>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px]'>Address</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px]'>(ලිපිනය ඇතුළත් කරන්න.)</label>
                    <input type="text" name='address' value={formData.address} onChange={handleChange}
                      placeholder="" required
                      className='mt-[5px] pl-4 py-1.5 xl:ml-0 ml-[20px] xl:w-[250px] md:w-[200px] w-[300px] h-[50px] placeholder-[#7465B9] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]' />
                  </div>

                  <div className='xl:ml-5 xl:mt-0 mt-[20px] md:mt-0'>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px]'>NIC Number</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px]'>(ජාතික හැඳුනුම්පත් අංකය.)</label>
                    <input type="text" name='nic' value={formData.nic} onChange={handleChange}
                      placeholder="" required
                      className='mt-[5px] pl-4 py-1.5 xl:ml-0 ml-[20px] xl:w-[250px] md:w-[200px] w-[300px] h-[50px] placeholder-[#7465B9] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]' />
                  </div>

                </div>
              </div>

              <div className='mt-[20px]'>
                <div className='flex-row xl:flex md:flex'>

                  <div>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px]'>User Name</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px]'>(පරිශීලක නාමය ඇතුළත් කරන්න.)</label>
                    <input type="text" name='username' value={formData.username} onChange={handleChange}
                      placeholder="" required
                      className='mt-[5px] pl-4 py-1.5 xl:ml-0 ml-[20px] xl:w-[250px] md:w-[200px] w-[300px] h-[50px] placeholder-[#7465B9] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]' />
                  </div>

                  <div className='xl:ml-5 xl:mt-0 mt-[20px] md:mt-0'>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[17px] text-[13px]'>Password</label>
                    <label htmlFor="" className='table-row text-[#7465B9] xl:text-[14px] text-[13px]'>(නව මුරපදයක් යොදන්න.)</label>
                    <input type="password" name='password' value={formData.password} onChange={handleChange}
                      placeholder="" required
                      className='mt-[5px] pl-4 py-1.5 xl:ml-0 ml-[20px] xl:w-[250px] md:w-[200px] w-[300px]  h-[50px] placeholder-[#7465B9] placeholder:text-sm border-[1px] border-[#7465B9] hover:border-black rounded-[9px]' />
                  </div>

                </div>
              </div>
            </div>


            <div className='xl:ml-[380px] ml-[25px] md:ml-[55px]'>
              <div className='xl:w-[400px] w-[320px] xl:mt-[45%] mt-[700px] md:mt-[150px] xl:mr-0 mr-[20px] flex flex-col xl:items-center justify-center'>
                <button className='p-2.5 rounded mt-2 bg-[#7465B9] xl:w-[350px] w-[300px] hover:bg-[#8050ac] text-lightColor text-xl font-bold'
                  type="submit">
                  Sign up
                </button>

                <div className="flex items-center w-full mt-10 xl:justify-center">
                  <div className="border-t border-[#7465B8] xl:w-[110px] w-[95px]"></div>
                  <span className="text-[#261C53] ml-3 mr-3 xl:mb-0">Or continue</span>
                  <div className="border-t border-[#7465B8] xl:w-[110px] w-[95px]"></div>
                </div>

                <div className='flex mt-8 space-x-4 xl:justify-center xl:items-center'>
                  <img src={image1} alt="Google" className='xl:w-[110px] w-[90px] hover:scale-[105%] transition-all duration-300' />
                  <img src={image2} alt="Mac" className='xl:w-[110px] w-[90px] hover:scale-[105%] transition-all duration-300' />
                  <img src={image3} alt="Facebook" className='xl:w-[110px] w-[90px] hover:scale-[105%] transition-all duration-300' />
                </div>
              </div>
            </div>


          </form>

        </div>
      </div>
    </div>
  )
}