import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const CreateStaff = () => {

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      address: '',
      gender: '',
      dob: '',
      profileImage : null,
      NIC: '',
      Qualification: '',
      password: ''
    });
  

    const [staffData, setStaffData] = useState([]);
  
    const toggleForm = () => {
      setShowForm(!showForm);
    };
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleFileChange = (e) => {
      setFormData({
        ...formData,
        profileImage: e.target.files[0]
      });
    };
  
    const fetchStaffData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/staff/details');
        setStaffData(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };
  
    useEffect(() => {
      fetchStaffData();
    }, []);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key]) { // Only append if the field is not empty
            formDataToSend.append(key, formData[key]);
          }
        });
      
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.contactNumber || !formData.address || !formData.gender || !formData.dob || !formData.profileImage || !formData.NIC || !formData.Qualification || !formData.password) {
          toast.error("All fields are required!");
          return;
        }
      
        try {
          const response = await axios.post('http://localhost:8081/staff/register', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          toast.success("Registered successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
      
          //if (response.status === 200) {
           // toast.success("Registered successfully!");
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              contactNumber: '',
              address: '',
              gender: '',
              dob: '',
              profileImage: null,
              NIC: '',
              Qualification: '',
              password: ''
            });
            fetchStaffData(); // Refresh staff list
         // }
          console.log('Registered successfully:', response.data);
        } catch (error) {
          toast.error("Registration failed. Please try again.");
          console.error('Error during registration:', error);
        }
      };
      
      
  return (
    <div>
      <Toaster />
      <div className="flex">
        <h1 className="text-[20px] uppercase font-semibold text-left">Register Staff</h1>
        <button
          className="p-2 bg-indigo-700 rounded-[10px] text-white ml-[50px] hover:bg-blue-500"
          onClick={toggleForm}
        >
          Add New Staff Member
        </button>
      </div>

      {showForm && (
        <form
          style={{ marginTop: '20px' }}
          onSubmit={handleSubmit}
          className="xl:ml-[170px] md:ml-[100px] ml-[25px] bg-emerald-50 xl:w-[600px] md:w-[370px] w-[310px] px-5 py-5 border-[1px] border-slate-300 shadow-custom-dark"
        >
          <div className="xl:flex">
            <div>
              <label htmlFor="firstName" className="table-row text-[#261C53] text-[15px] font-bold">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="xl:w-[240px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="xl:ml-[50px] mt-4 xl:mt-0">
              <label htmlFor="lastName" className="table-row text-[#261C53] text-[15px] font-bold">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="xl:w-[240px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="mt-4">
            <div>
              <label htmlFor="email" className="table-row text-[#261C53] text-[15px] font-bold">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="xl:w-[540px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="contactNumber" className="table-row text-[#261C53] text-[15px] font-bold">Contact Number:</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="xl:w-[540px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="mt-4">
            <div>
              <label htmlFor="address" className="table-row text-[#261C53] text-[15px] font-bold">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="xl:w-[540px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            </div>
            
            <div className='mt-4 xl:flex'>
            <div className="">
              <label htmlFor="gender" className="table-row text-[#261C53] text-[15px] font-bold">Gender:</label>
              <div className="xl:w-[240px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className='ml-2'
                /> Female
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="ml-[50px]"
                /> Male
              </div>
            </div>
         
            <div className='xl:ml-[50px] mt-4 xl:mt-0'>
              <label htmlFor="dob" className="table-row text-[#261C53] text-[15px] font-bold">Date of Birth:</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="xl:w-[240px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            </div>
            
            <div className='xl:flex'>
            <div className="mt-4 ">
              <label htmlFor="profileImage" className="table-row text-[#261C53] text-[15px] font-bold">Profile Image:</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="profileImage_"
                onChange={handleFileChange}
                className="bg-gray-200 xl:w-[240px] md:w-[310px] w-[256px] p-3 ml-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
           </div> 
           
            <div className='mt-4 xl:ml-[50px]'>
              <label htmlFor="NIC" className="table-row text-[#261C53] text-[15px] font-bold">NIC:</label>
              <input
                type="text"
                id="NIC"
                name="NIC"
                value={formData.NIC}
                onChange={handleChange}
                className="xl:w-[240px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>  
                     
            </div>

            <div className="mt-4">
              <label htmlFor="Qualification" className="table-row text-[#261C53] text-[15px] font-bold">Qualification:</label>
              <input
                type="text"
                id="Qualification"
                name="Qualification"
                value={formData.Qualification}
                onChange={handleChange}
                className="xl:w-[540px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
         
          <div className="">
            <div className="mt-4">
              <label htmlFor="password" className="table-row text-[#261C53] text-[15px] font-bold">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="xl:w-[540px] md:w-[310px] w-[256px] p-3 ml-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0004FF] xl:w-[250px] w-[200px] xl:ml-[150px] md:ml-[60px] ml-[30px] h-[50px] mt-6 text-white rounded-[10px] hover:bg-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      <div className="mt-[50px] xl:p-4 overflow-y-scroll h-[600px]">
        <table className="w-full border border-collapse border-gray-200 shadow-md table-auto border-l-[1px] border-l-[#98DED9]">
          <thead className="bg-indigo-100 border-t-[1px] border-[#C0C2C2] xl:font-[20px] font-[10px] text-fontDark">
            <tr>
              <th className="px-4 py-5">#</th>
              <th className="px-12 py-5 w-[100px] h-[100px]"></th>
              <th className="px-4 py-5">Name</th>
              <th className="px-4 py-5">Email</th>
              <th className="px-4 py-5">Contact Number</th>
              <th className="px-4 py-5">Address</th>
              <th className="px-4 py-5">Gender</th>
              <th className="px-4 py-5">Date of Birth</th>
              <th className="px-4 py-5">NIC</th>
              <th className="px-4 py-5">Qualification</th>
              <th className="px-4 py-5">Password</th>
            </tr>
          </thead>
          <tbody className='bg-slate-50'>
            {staffData.map((staff, index) => (
              <tr key={staff.id} className="hover:bg-[#ffffff1c] text-center border-t-2 border-[#C0C2C2]">
                <td className='px-2 py-2 text-red'>{index + 1}</td>
                <td className='px-3 py-2'>
                  {staff.profileImage && (
                    <img src={`http://localhost:8081/uploads/${staff.profileImage}`} alt="Profile" width="70px" height="70px" className='rounded-full' />
                  )}
                </td>
                <td className='px-3 py-2'>{`${staff.firstName} ${staff.lastName}`}</td>
                <td className='px-3 py-2 text-blue'>{staff.email}</td>
                <td className='px-3 py-2'>{staff.contactNumber}</td>
                <td className='px-3 py-2 text-blue '>{staff.address}</td>
                <td className='px-3 py-2'>{staff.gender}</td>
                <td className='px-3 py-2'>{staff.dob}</td>               
                <td className='px-3 py-2'>{staff.NIC}</td>
                <td className='px-3 py-2'>{staff.Qualification}</td>
                <td className='px-3 py-2 text-blue'>{staff.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateStaff;
