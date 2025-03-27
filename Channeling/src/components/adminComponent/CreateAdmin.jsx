import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const CreateAdmin = () => {

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
              UserName: '',
              Password: '',
              email: '',
              contactNumber: '',
    });
  
    const [adminData, setAdminData] = useState([]);
  
    const toggleForm = () => {
      setShowForm(!showForm);
    };
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/details');
        setAdminData(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };
  
    useEffect(() => {
      fetchAdminData();
    }, []);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post('http://localhost:8081/admin/register', formData); 
          toast.success("Registered successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
      
          if (response.status === 200) {
           // toast.success("Registered successfully!");
            setFormData({
              UserName: '',
              Password: '',
              email: '',
              contactNumber: '',
            });
            fetchAdminData(); // Refresh staff list
          }
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
        <h1 className="text-[20px] uppercase font-semibold text-left">Register Admin</h1>
        <button
          className="p-2 bg-indigo-700 rounded-[10px] text-white ml-[50px] hover:bg-blue-500"
          onClick={toggleForm}
        >
          Register New Admin
        </button>
      </div>

      {showForm && (
        <form
          style={{ marginTop: '20px' }}
          onSubmit={handleSubmit}
          className="xl:ml-[170px] md:ml-[100px] ml-[25px] bg-emerald-50 xl:w-[450px] md:w-[400px] w-[320px] px-5 py-5 border-[1px] border-slate-300 shadow-custom-dark"
        >
          <div className="xl:flex">
            <div>
              <label htmlFor="" className="table-row text-[#261C53] text-[15px] font-bold">User Name:</label>
              <input
                type="text"
                id="UserName"
                name="UserName"
                value={formData.UserName}
                onChange={handleChange}
                className="xl:w-[350px] md:w-[310px] p-3 ml-6 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

          </div>

          <div className="mt-4 xl:flex">
            <div>
              <label htmlFor="email" className="table-row text-[#261C53] text-[15px] font-bold">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="xl:w-[350px] md:w-[310px] p-3 ml-6 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
            
          

          <div className="mt-4 xl:flex">
            <div>
              <label htmlFor="contactNumber" className="table-row text-[#261C53] text-[15px] font-bold">Contact Number:</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="xl:w-[350px] md:w-[310px] p-3 ml-6 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <div className="mt-4">
              <label htmlFor="Password" className="table-row text-[#261C53] text-[15px] font-bold">Password:</label>
              <input
                type="Password"
                id="Password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                className="xl:w-[350px] md:w-[310px] p-3 ml-6 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0004FF] w-[180px] xl:ml-[110px] md:ml-[90px] ml-11 h-[50px] mt-6 text-white rounded-[10px] hover:bg-blue-500"
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
              <th className="px-4 py-5 min-w-[200px]">User Name</th>
              <th className="px-4 py-5">Email</th>
              <th className="px-4 py-5 min-w-[200px]">Contact Number</th>
              <th className="px-4 py-5">Password</th>
            </tr>
          </thead>
          <tbody className='bg-slate-50'>
            {adminData.map((admin, index) => (
              <tr key={admin.id} className="hover:bg-[#ffffff1c] text-center border-t-2 border-[#C0C2C2]">
                <td className='px-2 py-2 text-red'>{index + 1}</td>
                <td className='px-3 py-2'>{admin.UserName}</td>
                <td className='px-3 py-2 text-blue'>{admin.email}</td>
                <td className='px-3 py-2'>{admin.contactNumber}</td>
                <td className='px-3 py-2 text-blue'>{admin.Password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CreateAdmin;