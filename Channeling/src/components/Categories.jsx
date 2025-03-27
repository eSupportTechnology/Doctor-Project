import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/table.css'

const Category = ({ name, sinname, image, categoryId }) => {
    const [doctors, setDoctors] = useState([]);
    const [category, setCategory] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8081/category/category/${categoryId}/doctors`);
                const data = await response.json();

                console.log('Full API Response:', data);
                if (Array.isArray(data)) {
                    setDoctors(data);
                } else if (data.doctors && Array.isArray(data.doctors)) {
                    setDoctors(data.doctors);
                } else {
                    setDoctors([]);
                    setError('Invalid response structure or no doctors found.');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('An error occurred while fetching doctors.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [categoryId]);



    return (
        <div className='relative mb-3 ml-3 mr-3 overflow-hidden border-2 border-solid h-96 rounded-xl border-fontDark'>
            <div className='absolute z-20 flex items-center justify-center rounded-lg bg-green h-fit w-fit'>
                <h1 className='p-2 text-sm font-bold uppercase sm:text-lg md:text-xl'>{name}</h1>
            </div>

            <div className='absolute inset-0 z-10 opacity-100 bg-overlay'></div>

            <div className='absolute z-30 flex flex-col items-center justify-center w-full h-full mt-1 sm:mt-3 md:mt-4'>
                <h1 className='text-sm font-bold sm:text-lg md:text-xl'>({sinname})</h1>

                <div className="w-11/12 h-56 mt-2 overflow-auto custom-scroll">
                    <table className="w-full h-full table-fixed">
                        <thead>
                            <tr>
                                <th className="w-1/4"></th>
                                <th className="w-1/5 text-xs sm:text-sm md:text-base">Patient No</th>
                                <th className="w-1/4 text-xs sm:text-sm md:text-base">Make Appointment</th>
                                <th className="w-1/12 text-xs sm:text-sm md:text-base">OPN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500">Loading...</td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan="5" className="text-center text-red-500">{error}</td>
                                </tr>
                            )}
                            {!loading && !error && doctors.length > 0 ? (
                                doctors.map((doctor) => (
                                    <tr key={doctor.id} className="align-top">
                                        <td className="text-xs font-bold sm:text-sm md:text-base">
                                            {doctor.fullName || 'No Name'}
                                        </td>
                                        <td className="text-center text-xs sm:text-sm md:text-base">
                                            05
                                        </td>
                                        <td className="text-center flex justify-center">
                                            <Link to={`/doctorShedule?doctorId=${doctor.id}`} className="no-underline">
                                                <h6 className="bg-[#0B2F9F] w-fit font-extralight text-[#fff] py-1 px-5 rounded-[5px] cursor-pointer text-xs sm:text-sm md:text-sm">
                                                    Book Now
                                                </h6>
                                            </Link>
                                        </td>
                                        <td className="text-center text-xs sm:text-sm md:text-base">
                                            00
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                !loading && !error && (
                                    <tr>
                                        <td colSpan="5" className="text-center">No doctors found for this category.</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>


            </div>

            <div className='h-full'>
                <img className='object-cover w-full h-full' src={image} alt={image} />
            </div>
        </div>
    );
};

export default Category;
