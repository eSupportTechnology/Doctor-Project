import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPhoneAlt } from "react-icons/fa";

const Invoice = ({onViewInvoice}) => {
  const [details, setDetails] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/doctors/doctorDetails');
      setDetails(response.data);
    } catch (error) {
      setError(error);
      console.error('Error fetching doctor details:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-5">
      <Toaster />
      <h1 className="text-2xl font-bold mb-5">Doctor Details</h1>
      {error ? (
        <p className="text-red-500">Failed to load doctor details. Please try again later.</p>
      ) : (
        <div className="flex flex-wrap">
          {details.map((doctor) => (
            <div key={doctor.id} className="mb-10 px-5 mt-10 w-full sm:w-1/2 md:w-1/3">
              <div className="p-5 bg-white flex flex-col items-center justify-center rounded-lg shadow-md gap-4">
                <img
                  className="w-32 h-32 sm:w-42 sm:h-42 md:w-52 md:h-52 rounded-full object-cover border border-fontDark"
                  src={`http://localhost:8081/${doctor.profileImage}`}
                  alt={doctor.fullName}
                />
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-base font-semibold text-fontDark">{doctor.fullName}</h1>
                  <h3 className="text-sm">-{doctor.specialization}-</h3>
                  <h3
                    className="text-sm mt-2 cursor-pointer text-blue-500 hover:underline flex gap-2 items-center justify-center"
                    onClick={() => {
                      navigator.clipboard.writeText(doctor.contact_number);
                      toast.success('Copied to clipboard');
                    }}
                  >
                    <FaPhoneAlt className='text-green'/>
                    {doctor.contact_number}
                  </h3>
                </div>
                <button className="flex items-center justify-center text-sm text-white uppercase font-light text-left bg-[#97CE4F] py-2 w-[100%] rounded-lg transform transition-transform duration-300 hover:scale-105"
                onClick={() => onViewInvoice(doctor)}>
                  Show Invoices
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoice;
