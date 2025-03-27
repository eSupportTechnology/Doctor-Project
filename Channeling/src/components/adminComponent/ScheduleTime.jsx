import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaRegEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

const ScheduleTime = ({ onEditSchedule }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8081/category/doccategory')  // Adjust this URL to your backend endpoint
      .then((response) => {
        setCategories(response.data); // Set the categories with their doctors
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

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

  const columns = [
    { name: 'Doctor ID', selector: row => row.id, sortable: true },
    { name: 'Doctor Name', selector: row => row.fullName, sortable: true },
    { name: 'Experience', selector: row => row.experience, sortable: true },
    { name: 'Contact', selector: row => row.contact_number },
    {
      name: '',
      cell: row => (
        <div className="flex space-x-3 justify-center items-center">
          <button
            className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1 outline-slate-500 gap-1 bg-blue text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105"
          >
            View Schedule
            <FaRegEye className='text-sm' />
          </button>
        </div>
      ),
    },
    {
      name: '',
      cell: row => (
        <div className="flex space-x-3 justify-center items-center">
          <button onClick={() => onEditSchedule(row)}  className="flex items-center justify-center align-middle font-semibold gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1 outline-slate-500 bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
            Edit Schedule
            <FaEdit className='text-sm' />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {error && <p>Error: {error}</p>}
      {categories.length === 0 ? (
        <p>Loading categories...</p>
      ) : (
        categories.map((category) => (
          <div key={category.id}>
            <h1 className='bg-[#4694C8] mt-6 w-fit p-1 rounded-sm text-gray-50 text-lg'>{category.eng_name}</h1>
            <DataTable
              columns={columns}
              data={category.Doctors}  // Use the doctors list from each category
              fixedHeader
              fixedHeaderScrollHeight="80vh"
              className="data-table"
              customStyles={customStyles}
            />
          </div>
        ))
      )}
    </>
  );
};

export default ScheduleTime;