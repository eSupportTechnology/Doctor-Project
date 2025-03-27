import React from 'react'
import backgroundImage from '../img/Background.png';
import '../CSS/Register.css';
import image from '../img/doct img.png';
import { IoIosArrowBack } from "react-icons/io";

export default function Signin() {
  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: 'center',
    /*height:'100vh',*/
    width: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
  
  const handleLogin = () => {
    const role = document.getElementById('role').value;

    if (!role) {
      alert("Please select a role before logging in.");
      return;
    }
    
    let pageUrl = "";
    switch (role) {
      case "doctor":
        pageUrl = "doctorLogin";
        break;
      case "patient":
        pageUrl = "/patientLogin";
        break;
      case "staff":
        pageUrl = "/staffLogin";
        break;
      case "admin":
        pageUrl = "/adminLogin";
        break;
      default:
        alert("Role not recognized.");
        return;
    }
    
    window.location.href = pageUrl;
  };

  
  return (
    <div className='bg-gradient-to-r from-white to-[#98DED999]'>
    <div style={style}>
    <div className='xl:h-[721px] md:h-[720px] h-[680px]'>
      <div>
        <br /><br />
      <button 
      onClick={() => window.history.back()}
      className='bg-[#161D6F] w-[100px] xl:ml-[100px] ml-[20px] rounded text-lightColor text-center shadow-custom-dark hover:bg-[#354da2] flex p-2 font-bold' >
      <IoIosArrowBack className='mt-[5px] ml-[12px] font-bold'/>
       Back
       </button>

      <div className='flex'>
      <div className='text-line' >
      <h1 className='xl:text-[50px] text-[37px] xl:ml-[100px] ml-[20px] font-bold text-[#202643]'>Sign in to get your</h1>
      <h1 className='xl:text-[50px] text-[37px] xl:ml-[100px] ml-[20px] font-bold text-[#202643]'>Services</h1>
      <h6 className='xl:ml-[100px] ml-[20px] mt-9 font-bold md:ml-[100px]'>If you don't have an account</h6>
      <h6 className='xl:ml-[100px] ml-[20px] md:ml-[100px] font-bold'>you can <span className='text-[#0B2F9F]'> Sign up here!</span></h6>
      <h6 className='font-bold xl:ml-[100px] md:ml-[100px] ml-[20px] mt-9'>ගිණුමක් නොමැති නම්<br/>ඔබට මෙහි <span className='text-[#0B2F9F]'>ලියාපදිංචි</span> විය හැක!</h6>
      
      <div className='xl:ml-[400px] ml-[20px] md:ml-[200px] text-xl underline font-bold xl:w-[300px] xl:h-[200px] text-center text-[#202643]'>
        <p className='mt-10 text-[#202643] xl:text-[22px] text-[13px] xl:mr-0 mr-[190px]'>Select Your Role for Login<br/>ඔබේ භූමිකාව තෝරන්න</p>
        
        <div className="font-normal xl:w-[300px] w-[200px] mt-4">
          <select name="role" id="role" className="px-5 py-1.5 text-lg text-center border border-black rounded-xl bg-[#D2D4D4]">
              <option value="" disabled selected className="text-center text-gray-500">Select your role</option>
              <option value="doctor" className="text-black bg-white">Doctor</option>
              <option value="patient" className="text-black bg-white">Patient</option>
              <option value="staff" className="text-black bg-white">Staff</option>
              <option value="admin" className="text-black bg-white ">Admin</option></select>
          </div>
    
      <input type="button" value="Log In" onClick={handleLogin} className='bg-green p-2.5 xl:mr-0 mr-[200px] rounded mt-6 hover:bg-[#87b43f]'/>
      
      </div>
      
      </div>
      
      <img src={image} alt="Doctor" className="absolute xl:w-[480px] w-[170px] xl:h-[634px] h-[350px] xl:top-[267px] xl:left-[800px] left-[210px] top-[607px]
      md:h-[450px] md:w-[330px] md:left-[540px] md:top-[449px]"/>
    
      </div>
      </div>
    
    
   </div>
   </div>
   </div>
  )
}
