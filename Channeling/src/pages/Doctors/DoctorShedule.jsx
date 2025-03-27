import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import bgImage from '../../img/bg-doctorShedule.png';
import { IoIosArrowBack } from "react-icons/io";
import { FaStethoscope } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { VscColorMode } from "react-icons/vsc";
import doctorImage from '../../img/Rectangle 43.png';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../../assest/images/37a39cb7092d94d7297953ad09f2dee5.png'

const DoctorShedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const doctorId = searchParams.get('doctorId');

  useEffect(() => {
    fetchDoctors(doctorId);
    fetchSchedules(doctorId);
  }, [])

  const fetchDoctors = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:8081/doctors/doctor/${doctorId}`);

      if (!response.ok) {
        console.error("Error in frontend");
      }

      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error("Something went wrong!");
    }
  }

  const fetchSchedules = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:8081/schedule/schedules?doctorId=${doctorId}`);
      const data = await response.json();

      if (response.ok) {
        setSchedules(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const style = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100%',
  };

  return (
    <div style={style}>
      <Header />

      <div className='flex px-2 sm:px-20 md:px-20 flex-col sm:flex-col md:flex-row'>
        <div className='mb-10 px-0 sm:px-7 md:px-7 mt-10 sm:w-full md:w-[23%] w-full'>
          <div className='p-5 bg-white flex flex-col items-center justify-center rounded-lg shadow-md gap-4'>
            <img className='w-32 h-32 sm:w-42 sm:h-42 md:w-52 md:h-52 rounded-full object-cover border border-fontDark' src={doctorImage} alt="" />

            <div className='flex flex-col items-center justify-center'>
              <h1 className='text-base font-semibold text-fontDark'>{details.fullName}</h1>
              <h3 className='text-sm'>-{details.qualifications}-</h3>
            </div>

            <button
              className='flex items-center justify-center text-sm text-white uppercase font-light text-left bg-[#97CE4F] py-2 w-[100%] rounded-lg transform transition-transform duration-300 hover:scale-105'
              onClick={() => navigate(`/details?doctorId=${doctorId}`, { state: details })}
            >
              View Profile
            </button>
          </div>
        </div>

        <div className='bg-white my-2 sm:my-5 md:my-10 w-full sm:w-full md:w-[77%] rounded-lg shadow-md pb-7'>
          <div className='bg-fontDark rounded-lg h-16 flex items-center p-5'>
            <h1 className='text-white text-base font-semibold'>{details.qualifications}</h1>
          </div>

          {isLoading ? (
            <p>Loading schedules...</p>
          ) : Array.isArray(schedules) && schedules.length > 0 ? (
            schedules.map((schedule) => {
              const dataObj = new Date(schedule.date);
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              const formattedDate = dataObj.toLocaleDateString(undefined, options); // Format without weekday
              const weekday = dataObj.toLocaleDateString(undefined, { weekday: 'long' }); // Only weekday name

              return (
                <>
                  <div key={schedule.id} className="mt-7 px-7 ">
                    <h1>{weekday}, {formattedDate}</h1>
                    <div className="flex items-center justify-between mt-2 rounded-lg shadow-lg p-2 bg-white border-l-8 border-green">
                      <img src={Logo} alt="" className="w-[7%] pl-2 shadow-md p-2 rounded-lg" />

                      <div className="ml-2">
                        <h1 className="text-xs font-semibold">Amarasingha Medicare</h1>
                        <h1 className="text-xs font-extralight">Colombo</h1>
                      </div>

                      <div className="flex sm:flex-row md:flex-row flex-col gap-4 sm:gap-0 md:gap-0 w-[80%] items-center justify-around">
                        <div className="flex flex-col items-center justify-center">
                          <h1 className="text-xs font-semibold text-blue">{schedule.start_time}</h1>
                          <h1 className="text-xs font-extralight">Starting time</h1>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          <h1 className="text-xs font-semibold text-red">{schedule.end_time}</h1>
                          <h1 className="text-xs font-extralight">Ending time</h1>
                        </div>

                        <div>
                          <h1 className="text-xs font-semibold text-green">Rs {schedule.doctor_fee} + Booking Fee</h1>
                          <h1 className="text-xs font-extralight">Channeling Fee</h1>
                        </div>

                        <div className='flex flex-col gap-2'>
                          <Link to={`/bookingform?scheduleID=${schedule.id}`}>
                            <h1 className="text-xs text-white uppercase text-left bg-[#97CE4F] py-2 px-16 rounded-lg transform transition-transform duration-300 hover:scale-105">Book</h1>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <p className='p-10'>No schedules available.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DoctorShedule