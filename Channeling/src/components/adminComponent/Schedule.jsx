import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profile from '../../img/doctor.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { FaPhoneAlt } from "react-icons/fa";
import { Modal } from "flowbite-react";
import Logo from '../../assest/images/37a39cb7092d94d7297953ad09f2dee5.png'

const ScheduleEdit = ({ doctor, onCancel }) => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    scheduleID: '',
    start_time: '',
    end_time: '',
    doctor_fee: '',
    patients: '',
  });
  const [formData, setFormData] = useState({
    doctor_id: doctor.id || '',
    available_from: '',
    available_to: '',
    week_day: '',
    start_time: '',
    end_time: '',
    doctor_fee: '',
    patients: '',
  });

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const onCloseEditModal = () => {
    setEditModel(false);
  };

  const handleChancel = () => {
    setFormData({
      doctor_id: doctor.id || '',
      available_from: '',
      available_to: '',
      week_day: '',
      start_time: '',
      end_time: '',
      doctor_fee: ''
    });

    setOpenModal(false);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctor_id || !formData.available_from || !formData.available_to || !formData.week_day || !formData.start_time || !formData.end_time || !formData.doctor_fee || !formData.patients) {
      toast.error("All fields are required!");
      return;
    }

    const fromDate = new Date(formData.available_from);
    const toDate = new Date(formData.available_to);
    if (fromDate >= toDate) {
      toast.error("The 'Available From' date must be earlier than the 'Available To' date!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/schedule/add', {
        ...formData,
        doctor_id: parseInt(formData.doctor_id, 10),
      });

      if (response.status === 200) {
        toast.success("Schedule added successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setFormData({
          doctor_id: '',
          available_from: '',
          available_to: '',
          week_day: '',
          start_time: '',
          end_time: '',
          doctor_fee: '',
          patients: ''
        });

        fetchSchedules();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error('Error adding schedule:', error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChanges = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });

    setSelectedSchedule((prev) => ({
      ...prev,
      [name]: name === 'patients' ? parseInt(value, 10) || '' : value,
    }));
  }

  const fetchSchedules = async () => {
    try {
      const doctorId = doctor.id;
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

  const handleDelete = (id) => () => deleteSchedule(id);

  const deleteSchedule = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/schedule/delete?scheduleID=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Something went wrong!');
      }

      const data = await response.json();
      console.log("Schedule deleted:", data);
      toast.success("Schedule deleted successfully!");

      fetchSchedules();
    } catch (error) {
      console.error("Something went wrong :", error);
      toast.error("Please try again later!");
    }
  };

  const handleEdit = (schedule) => {
    setEditModel(true);
    setSelectedSchedule(schedule);
  };

  const handleSubmitEdit = async (e) =>{
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8081/schedule/update`, {
        ...editFormData,
        patients: parseInt(editFormData.patients, 10),
      });

      if (response.status === 200) {
        toast.success("Schedule added successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setEditFormData({
          scheduleID: '',
          start_time: '',
          end_time: '',
          doctor_fee: '',
          patients: '',
          patients: '',
        });

        fetchSchedules();
        setEditModel(false);
      }
    } catch (error) {
      toast.error("Something went wrong huuu");
      console.error("Please try again: ", error);
    }
  }

  const handleEditCancel = () => {
    setEditModel(false);
    setEditFormData({
      available_date: "",
      start_time: "",
      end_time: "",
      doctor_fee: "",
      patients: ""
    });
  }

  useEffect(() => {
  if (selectedSchedule) {
    setEditFormData({
      scheduleID: selectedSchedule.id,
      start_time: selectedSchedule.start_time,
      end_time: selectedSchedule.end_time,
      doctor_fee: selectedSchedule.doctor_fee,
      patients: selectedSchedule.patients,
    });
  }
}, [selectedSchedule]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <>
      <Toaster />
      {/* Top Doctor Details Section */}
      <div>
        <div className='w-fit flex items-center justify-center gap-10'>
          <img className='object-cover w-36 h-36 sm:w-52 sm:h-52 mx-auto rounded-full shadow-lg' src={profile} alt="" />

          <div className='leading-10'>
            <h1 className='sm:text-2xl md:text-lg text-sm font-bold text-fontDark'>Dr {doctor.fullName}</h1>
            <h1 className='sm:text-xl md:text-sm text-xs flex gap-2 items-center font-semibold text-fontDark'><FaPhoneAlt className='text-green sm:text-xl md:text-sm text-xs ' /> {doctor.contact_number}</h1>
          </div>
        </div>
      </div>

      {/* Schedule and Back buttons Section*/}
      <div className='flex items-center justify-start mt-5  gap-3'>
        <button className='text-sm text-white uppercase font-light text-left bg-blue p-2 rounded-lg transform transition-transform duration-300 hover:scale-105' onClick={onCancel}>Back</button>
        <button className='text-sm text-white uppercase font-light text-left bg-[#97CE4F] p-2 rounded-lg transform transition-transform duration-300 hover:scale-105' onClick={() => setOpenModal(true)}>Add Schedule</button>
      </div>

      {/* View all scheduled time periods */}
      <div>
        {isLoading ? (
          <p>Loading schedules...</p>
        ) : Array.isArray(schedules) && schedules.length > 0 ? (
          schedules.map((schedule) => {
            const dataObj = new Date(schedule.date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dataObj.toLocaleDateString(undefined, options); // Format without weekday
            const weekday = dataObj.toLocaleDateString(undefined, { weekday: 'long' }); // Only weekday name

            return (
              <div key={schedule.id} className="mt-8">
                <h1>{weekday}, {formattedDate}</h1>
                <div className="flex items-center justify-between mt-2 rounded-lg shadow-lg p-2 bg-white border-l-8 border-green">
                  <img src={Logo} alt="" className="w-[7%] pl-2 shadow-md p-2 rounded-lg" />

                  <div className="ml-2">
                    <h1 className="text-xs font-semibold">Amarasingha Medicare</h1>
                    <h1 className="text-xs font-extralight">Colombo</h1>
                    <h1 className="text-xs">{doctor.qualifications || 'Not available'}</h1>
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

                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-xs font-semibold">{schedule.patients}</h1>
                      <h1 className="text-xs font-extralight">Patients</h1>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <button onClick={() => handleEdit(schedule)} className="text-xs text-white uppercase text-left bg-[#97CE4F] py-2 px-16 rounded-lg transform transition-transform duration-300 hover:scale-105">
                        Edit Schedule
                      </button>

                      <button onClick={handleDelete(schedule.id)} className="text-xs text-white uppercase text-left bg-red py-2 px-16 rounded-lg transform transition-transform duration-300 hover:scale-105">
                        Delete Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No schedules available.</p>
        )}
      </div>

      {/* Pop up Modal Section */}
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header className='bg-white' />
        <Modal.Body className='bg-white'>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900">Add <span className='text-red'>New</span> Doctor Schedule</h3>
            <form onSubmit={handleSubmit}>
              <div className='flex'>
                <input type="hidden" name="doctor_id" id='doctor_id' value={formData.doctor_id} />
                <div>
                  <label htmlFor="" className='text-xs'>Available from</label>
                  <input type="date" id='available_from' name='available_from' value={formData.available_from} onChange={handleChanges} className='w-[95%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' required />
                </div>

                <div>
                  <label htmlFor="" className='text-xs'>Available to</label>
                  <input type="date" id='available_to' name='available_to' value={formData.available_to} onChange={handleChanges} className='w-[100%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' required />
                </div>
              </div>

              <div className='mt-5 flex flex-col'>
                <label htmlFor="" className='text-xs'>Day of week</label>
                <select name="week_day" id="week_day" value={formData.week_day} onChange={handleChanges} className='w-[100%] h-9 bg-[#d8dad8] rounded-md pl-3 mt-2 text-xs'>
                  <option value="" disabled>Select day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>

              <div className='flex mt-5'>
                <div className='w-[50%]'>
                  <label htmlFor="" className='text-xs'>Start time</label>
                  <input type="time" id='start_time' name='start_time' value={formData.start_time} onChange={handleChanges} className='w-[95%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' required />
                </div>

                <div className='w-[50%]'>
                  <label htmlFor="" className='text-xs'>End time</label>
                  <input type="time" id='end_time' name='end_time' value={formData.end_time} onChange={handleChanges} className='w-[100%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' required />
                </div>
              </div>

              <div className='flex mt-5'>
                <div className='w-[50%]'>
                  <label htmlFor="" className='text-xs'>Doctor fee (Rs)</label>
                  <input type="text" id='doctor_fee' name='doctor_fee' value={formData.doctor_fee} onChange={handleChanges} className='w-[95%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' required />
                </div>
                <div className='w-[50%]'>
                  <label htmlFor="" className='text-xs'>Number of patients</label>
                  <input type="text" id='patients' name='patients' value={formData.patients} onChange={handleChanges} className='w-[100%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' required />
                </div>
              </div>

              <div className='bg-red p-2 rounded-md my-5'>
                <p className='text-xs text-white'>warning ! This will be effected to the whole time period that you added.</p>
              </div>

              <div className='flex justify-end items-center h-10 mt-5 gap-3'>
                <button onClick={handleChancel} className='text-[16px] text-white uppercase font-semibold text-left bg-red p-2 rounded-lg transform transition-transform duration-300 hover:scale-105'>Cancel</button>
                <button type='submit' className='text-[16px] text-white uppercase font-semibold text-left bg-[#97CE4F] p-2 rounded-lg transform transition-transform duration-300 hover:scale-105'>Create</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>


      <Modal show={editModel} size="md" onClose={onCloseEditModal} popup>
        <Modal.Header className='bg-white' />
        <Modal.Body className='bg-white'>
          <div className="space-y-6">
            {selectedSchedule && (
              <>
                <h3 className="text-xl font-medium text-gray-900"><span className='text-red'>Edit</span> Doctor Schedule</h3>
                <form onSubmit={handleSubmitEdit}>
                  <div className='flex'>
                    <div>
                      <label htmlFor="" className='text-xs'>Available Date : <span className='text-red'>{selectedSchedule.date ? formatDate(selectedSchedule.date) : ""}</span></label>
                    </div>
                  </div>

                  <input type="hidden" value={selectedSchedule.id} id='scheduleID' name='scheduleID'/>

                  <div className='flex mt-2'>
                    <div className='w-[50%]'>
                      <label htmlFor="" className='text-xs'>Start time</label>
                      <input type="time" id='start_time' name='start_time' value={editFormData.start_time} onChange={handleEditChanges} className='w-[95%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' />
                    </div>

                    <div className='w-[50%]'>
                      <label htmlFor="" className='text-xs'>End time</label>
                      <input type="time" id='end_time' name='end_time' value={editFormData.end_time} onChange={handleEditChanges} className='w-[100%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' />
                    </div>
                  </div>

                  <div className='flex mt-5'>
                    <div className='w-[50%]'>
                      <label htmlFor="" className='text-xs'>Doctor fee (Rs)</label>
                      <input type="text" id='doctor_fee' name='doctor_fee' value={editFormData.doctor_fee} onChange={handleEditChanges} className='w-[95%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' />
                    </div>

                    <div className='w-[50%]'>
                      <label htmlFor="" className='text-xs'>Patients</label>
                      <input type="text" id='patients' name='patients' value={editFormData.patients} onChange={handleEditChanges} className='w-[100%] h-9 bg-[#d8dad8] rounded-md p-3 text-xs' />
                    </div>
                  </div>

                  <div className='flex justify-end items-center h-10 mt-5 gap-3'>
                    <button onClick={handleEditCancel} className='text-[16px] text-white uppercase font-semibold text-left bg-red p-2 rounded-lg transform transition-transform duration-300 hover:scale-105'>Cancel</button>
                    <button type='submit' className='text-[16px] text-white uppercase font-semibold text-left bg-[#97CE4F] p-2 rounded-lg transform transition-transform duration-300 hover:scale-105'>Save</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ScheduleEdit;
