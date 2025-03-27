import React, { useState, useEffect } from 'react'; 
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const CreateDoctor = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specializationId: '',
    qualifications: '',
    experience: '',
    contact_number: '',
    address: '',
    reg_number: '',
    gender: '',
    birthday: '',
    profile_image: '',
  });
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null); // Track the doctor being edited

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/doctors/doctorDetails');
      setData(response.data);
    } catch (error) {
      setError(error);
      console.error('Error fetching doctor details:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        specializationId: '',
        qualifications: '',
        experience: '',
        contact_number: '',
        address: '',
        reg_number: '',
        gender: '',
        birthday: '',
        profile_image: '',
      });
      setEditId(null);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    // Validation
    if (!formData.fullName) {
      toast.error("Full Name is required!");
      return;
    }
    if (!formData.email) {
      toast.error("Email is required!");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required!");
      return;
    }
    if (!formData.specializationId) {
      toast.error("Specialization is required!");
      return;
    }
    if (!formData.qualifications) {
      toast.error("Qualifications are required!");
      return;
    }
    if (!formData.experience) {
      toast.error("Experience is required!");
      return;
    }
    if (!formData.contact_number) {
      toast.error("Contact Number is required!");
      return;
    }
    if (!formData.address) {
      toast.error("Address is required!");
      return;
    }
    if (!formData.reg_number) {
      toast.error("Registration Number is required!");
      return;
    }
    if (!formData.gender) {
      toast.error("Gender is required!");
      return;
    }
    if (!formData.birthday) {
      toast.error("Birthday is required!");
      return;
    }
    if (!formData.profile_image) {
      toast.error("Profile Image is required!");
      return;
    }

    const formDataToSubmit = new FormData();
for (let key in formData) {
  if (key === 'profile_image' && formData[key]) {
    formDataToSubmit.append('profile_image', formData[key]);
  } else {
    formDataToSubmit.append(key, formData[key]);
  }
}


    try {
      const url = editId
      ? `http://localhost:8081/doctors/update/${editId}`
      : 'http://localhost:8081/doctors/register';
      const method = editId ? 'put' : 'post';
      
      console.log(`PUT URL: ${url}`); // 

      const response = await axios({
        method,
        url,
        data: formDataToSubmit,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response); 

      toast.success(editId ? "Doctor updated successfully!" : "Doctor registered successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setFormData({
        fullName: '',
        email: '',
        password: '',
        specializationId: '',
        qualifications: '',
        experience: '',
        contact_number: '',
        address: '',
        reg_number: '',
        gender: '',
        birthday: '',
        profile_image: '',
      });
      setEditId(null);
      fetchData();
    } catch (error) {
      toast.error(editId ? "Update failed. Please try again." : "Registration failed. Please try again.");
      console.error('Error during registration:', error);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      fullName: row.fullName,
      email: row.email,
      password: '', 
      specializationId: row.specializationId,
      qualifications: row.qualifications,
      experience: row.experience,
      contact_number: row.contact_number,
      address: row.address,
      reg_number: row.reg_number,
      gender: row.gender,
      birthday: row.birthday,
      profile_image: row.profileImage,
    });
    setEditId(row.id); 
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/doctors/${id}`);
      toast.success("Doctor deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete doctor. Please try again.");
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8081/category/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const columns = [
    {
      name: 'Profile Image',
      selector: row => (
        <img
          src={row.profileImage ? `http://localhost:8081/${row.profileImage}` : 'default-image-path.jpg'}
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
      ),
      sortable: true,
    },
    { name: 'Full Name', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Specialization', selector: row => row.specialization, sortable: true },
    { name: 'Experience', selector: row => row.experience, sortable: true },
    { name: 'Contact', selector: row => row.contact_number, sortable: true },
    { name: 'Address', selector: row => row.address, sortable: true },
    { name: 'Register No', selector: row => row.reg_number, sortable: true },
    { name: 'Gender', selector: row => row.gender, sortable: true },
    { name: 'Birthday', selector: row => row.birthday, sortable: true },
    {
      name: 'Action',
      cell: row => (
        <div className="flex items-center justify-center space-x-3">
          <button onClick={() => handleEdit(row)} className="flex items-center justify-center font-semibold p-[6px] rounded-md shadow-md bg-green text-white hover:bg-green-500">
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(row.id)} className="flex items-center justify-center font-semibold p-[6px] rounded-md shadow-md bg-red text-white hover:bg-red-500">
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#202643',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
      },
    },
  };


  return (
    <div>
      <Toaster />
      <div className="flex">
        <h1 className="text-[20px] uppercase font-semibold text-left">Register doctor</h1>
        <button
        className="p-2 bg-indigo-700 rounded-[10px] text-white ml-[50px] hover:bg-blue-500 xl:ml-[50px] sm:ml-0 w-full sm:w-auto"
        onClick={toggleForm}
      >
        Register New Doctor
      </button>

      </div>

      {showForm && (
         <form
         style={{ marginTop: '20px' }}
         onSubmit={handleSubmit}
         className="bg-emerald-50 w-full max-w-2xl px-5 py-5 border-[1px] border-slate-300 shadow-custom-dark"
       >
          <div className="">
            <div>
              <label htmlFor="fullName" className="table-row text-[#261C53] text-[15px] font-bold">Full Name :</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="table-row text-[#261C53] text-[15px] font-bold">Email :</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="mt-4">
            <div>
              <label htmlFor="password" className="table-row text-[#261C53] text-[15px] font-bold">Password :</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="specializationId" className="table-row text-[#261C53] text-[15px] font-bold">SpecializationId :</label>

              <select name="specializationId" id="specializationId" value={formData.specializationId} onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled selected className="text-gray-700">
                  Select your specialization
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="text-black bg-white">
                    {category.id}. {category.eng_name} - {category.sin_name}
                  </option>
                ))}
              </select>

            </div>
          </div>

          <div className="mt-4 ">
            <div>
              <label htmlFor="qualifications" className="table-row text-[#261C53] text-[15px] font-bold">Qualifications :</label>
              <input
                type="text"
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

          </div>

          <div className="mt-4 xl:flex">
          <div>
            <label htmlFor="experience" className="table-row text-[#261C53] text-[15px] font-bold">Experience :</label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="p-3 bg-gray-200 border rounded-lg w-full xl:w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="xl:ml-[20px] mt-4 xl:mt-0">
            <label htmlFor="contact_number" className="table-row text-[#261C53] text-[15px] font-bold">Contact Number :</label>
            <input
              type="text"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 xl:w-[300px]"
            />
          </div>
        </div>

          <div className="">
            <div className="mt-4">
              <label htmlFor="address" className="table-row text-[#261C53] text-[15px] font-bold">Address :</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-4 ">
              <label htmlFor="reg_number" className="table-row text-[#261C53] text-[15px] font-bold">Reg Number :</label>
              <input
                type="text"
                id="reg_number"
                name="reg_number"
                value={formData.reg_number}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

          <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:gap-6">
            {/* Gender Field */}
            <div className="flex-1">
              <label htmlFor="gender" className="table-row text-[#261C53] text-[15px] font-bold">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Birthday Field */}
            <div className="flex-1">
              <label htmlFor="birthday" className="table-row text-[#261C53] text-[15px] font-bold">
                Birthday:
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          
          {/* Profile image */}
          <div className="flex mt-6 space-x-4">
          <div className="w-full">
          <label htmlFor="profile_image" className="table-row text-[#261C53] text-[15px] font-bold">Profile Image:</label>
            <input
              type="file"
              id="profile_image"
              name="profile_image"
              onChange={handleFileChange}
              className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
          </div>
          <button
          type="submit"
          className="bg-green w-[250px] h-[50px] mt-6 text-white rounded-[10px] hover:bg-blue-500 mx-auto block"
          >
          Submit
        </button>

        </form>
      )}

      {/* <div className="mt-[50px] xl:p-4 overflow-y-scroll h-[600px]">
        <table className="w-full border border-collapse border-gray-200 shadow-md table-auto border-l-[1px] border-l-[#98DED9]">
          <thead className="bg-indigo-100 border-t-[1px] border-[#C0C2C2] xl:font-[20px] font-[10px] text-fontDark">
            <tr>
              <th className="px-4 py-5">#</th>
              <th className="px-4 py-5 min-w-[200px]">Full Name</th>
              <th className="px-4 py-5">Email</th>
              <th className="px-4 py-5">SpecializationId</th>
              <th className="px-4 py-5 min-w-[200px]">Qualifications</th>
              <th className="px-4 py-5 min-w-[200px]">Experience</th>
              <th className="px-4 py-5 min-w-[200px]">Contact Number</th>
              <th className="px-4 py-5 min-w-[200px]">Address</th>
              <th className="px-4 py-5 min-w-[200px]">Reg Number</th>
              <th className="px-4 py-5">Password</th>
            </tr>
          </thead>
          <tbody className='bg-slate-50'>
            {staffData.map((staff, index) => (
              <tr key={staff.id} className="hover:bg-[#ffffff1c] text-center border-t-2 border-[#C0C2C2]">
                <td className='px-2 py-2 text-red'>{index + 1}</td>
                <td className='px-3 py-2'>{staff.fullName}</td>
                <td className='px-3 py-2 text-blue'>{staff.email}</td>
                <td className='px-3 py-2 text-blue '>{staff.specializationId}</td>
                <td className='px-3 py-2'>{staff.qualifications}</td>
                <td className='px-3 py-2'>{staff.experience}</td>
                <td className='px-3 py-2'>{staff.contact_number}</td>
                <td className='px-3 py-2'>{staff.address}</td>
                <td className='px-3 py-2 text-blue'>{staff.reg_number}</td>
                <td className='px-3 py-2'>{staff.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      <div className='h-fit p-[1px] mt-2 bg-[#202643]'>
        <DataTable
          columns={columns}
          data={data}
          fixedHeader
          fixedHeaderScrollHeight="80vh"
          className="data-table"
          customStyles={customStyles}
        />
      </div>
    </div>
  )
}

export default CreateDoctor