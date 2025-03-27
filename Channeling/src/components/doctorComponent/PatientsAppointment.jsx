import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../CSS/Calander.css";
import img from '../../img/doctorPatientsProfile.png';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

//icons
import { AiFillCaretDown } from "react-icons/ai";
import { BsPrinter, BsCheckCircle, BsXCircle  } from "react-icons/bs";
import { BiX } from "react-icons/bi";



const PatientsAppointment = () => {


  const appointments = [
    { id: "01", name: "Emily Johnson", age: 24, gender: "Female", pNumber: "0112323234", date: "2024-11-19", time: "11:00:00", fee: "1500/=", status: "Paid", img: img, department:"PAEDIATRICIAN"  },
    {id: "02", name: "Michael Smith", age: 20, gender: "Male", pNumber: "0112323234", date: "2024-11-19", time: "13:00:00", fee: "1500/=", status: "Paid", img: img, department:"PAEDIATRICIAN" },
    {id: "03", name: "Sophia Martinez", age: 30, gender: "Female", pNumber: "0112323234", date: "2024-11-19", time: "09:10:00", fee: "1500/=", status: "Paid", img: img, department:"PAEDIATRICIAN" },
    {id: "04",name: "David Lee", age: 28, gender: "Male", pNumber: "0112323234", date: "2024-11-19", time: "16:30:00", fee: "1500/=",status: "Unpaid", img: img, department:"PAEDIATRICIAN" },
    {id: "05", name: "Isabella Brown", age: 40, pNumber: "0112323234", gender: "Female", date: "2024-11-19", time: "11:20:00", fee: "1500/=", status: "Paid", img: img, department:"PAEDIATRICIAN" },
    {id: "06", name: "Christopher Garcia", age: 21, gender: "Male", pNumber: "0112323234", date: "2024-11-19", time: "08:40:00", fee: "1500/=", status: "Paid", img: img, department:"PAEDIATRICIAN" },
    {id: "07", name: "Olivia Wilson", age: 32, gender: "Female", pNumber: "0112323234", date: "2024-11-19", time: "05:12:00",fee: "1500/=",status: "Unpaid", img: img, department:"PAEDIATRICIAN" },
    {id: "07", name: "Olivia Wilson", age: 32, gender: "Female", pNumber: "0112323234", date: "2024-11-19", time: "05:12:00",fee: "1500/=",status: "NoBook", img: img, department:"PAEDIATRICIAN" },
  ];

  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [editableDetails, setEditableDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarVisible(false);
  };

  // Open popup to view details
  const handleDetails = (appointment) => {
    setSelectedDetails(appointment);
    setEditableDetails(appointment);
    setModalVisible(true);
  };

  // Toggle editing mode for details
  const toggleEditDetails = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle input changes for editable fields
  const handleInputChange = (field, value) => {
    setEditableDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  // Validate form fields
  const validateFields = () => {
    const errors = {};
    if (!editableDetails.age) errors.age = "Age is required";
    if (!editableDetails.gender) errors.gender = "Gender is required";
    if (!editableDetails.pNumber) errors.pNumber = "Phone number is required";
    if (!editableDetails.date) errors.date = "Date is required";
    if (!editableDetails.time) errors.time = "Time is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save edited details
  const saveDetails = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      toast.error('Please fill in all the fields.',
          {
              style: {
                  borderRadius: '6px',
                  background: '#EBF8F7FF',
                  color: '#000000FF',
              },
          }
      );
      return;
    }else {
      setSelectedDetails(editableDetails);
      setModalVisible(false);
      setIsEditing(false);

      toast.success('Details updated successfully.',
          {
              style: {
                borderRadius: '6px',
                background: '#EBF8F7FF',
                color: '#000000FF',
            },
          }
      );
    }
  };

  // Accept appointment popup
  const handleAccept = (appointment) => { 
      Swal.fire({
        title: '<h2 class="text-[#003C01]">Accept Appointment</h2>',
        html: `<div class="border-dashed border-t-2 border-black text-[16px] text-[#6A6A6A] m-0">
                Great Doctor! If You Need Your Family Member To Get Immediate Assistance, Emergency Treatment.
              </div>
              `,
        iconHtml: '<i class="fas fa-check-circle text-[#3AF93C] text-[80px] p-2 rounded-full"></i>',
        confirmButtonText: '<span class="text-[#4F8C00]">Accept</span>',
        confirmButtonColor: '#B6F662',
        showCloseButton: true,
        width: '550px',
      }).then((result) => {
        if (result.isConfirmed) {
          // // Update the appointment status to 'Accepted'
          // setAppointments((prevAppointments) =>
          //   prevAppointments.map((a) =>
          //     a.id === appointment.id ? { ...a, status: 'Accepted' } : a
          //   )
          // );
          Swal.fire('Accepted!', 'The appointment has been accepted.', 'success');
        }
      });
  };

  // Reject appointment popup
  const handleReject = (appointment) => { 
      Swal.fire({
        title: '<h2 class="text-[#510000]">Cancel Appointment</h2>',
        html: `<div class="border-dashed border-t-2 border-black text-[16px] m-0 text-[#6A6A6A]">
                Great doctor! if you need your family member to get immediate assistance, emergency treatment.
              </div>
              `,
        iconHtml: '<i class="fas fa-times-circle text-[#FF0000] text-[80px]  p-2 rounded-full"></i>',
        confirmButtonText: '<span class="text-[#510000]">Cancel</span>',
        confirmButtonColor: '#FF0000',
        showCloseButton: true,
        width: '550px',
      }).then((result) => {
        if (result.isConfirmed) {
          // // Update the appointment status to 'Accepted'
          // setAppointments((prevAppointments) =>
          //   prevAppointments.map((a) =>
          //     a.id === appointment.id ? { ...a, status: 'Cancel' } : a
          //   )
          // );
          Swal.fire('Canceled!', 'The appointment has been Canceled.', 'error');
        }
      });
  };
  

  // Format date
  const formatDate = (date) => {
    if (!date) return null;
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const ordinal = (n) =>
      n > 3 && n < 21
        ? "th"
        : { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th";
    return `${day}${ordinal(day)} ${month} ${year}`;
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")}${period}`;
  };


  return (

    <div className="bg-transparent border-2 border-[#C0C2C2] md:border-0 md:border-transparent  p-2 md:p-0">
      {/* top container */}
      <div className="items-center justify-between mt-2 space-y-3 md:flex md:space-x-3 md:space-y-0">
        <div className="space-y-2 md:flex md:space-x-3 md:space-y-0">
          <h1 className="text-[20px] uppercase font-semibold text-left">Appointment</h1>
          <button className="bg-[#00FF03] mr-2 md:mr-0 w-auto px-2 h-auto py-1 lg:py-0 lg:h-8 text-black rounded text-center font-medium">Make Appointment</button>
          <button className="bg-[#0004FF] w-auto px-2 h-auto py-1 lg:py-0 lg:h-8 text-white rounded text-center font-medium">Add Patient </button>
        </div>
        {/* calendar search */}
        <div className="relative">
          <button  onClick={() => setIsCalendarVisible(!isCalendarVisible)} className="flex items-center justify-between h-12 px-3 font-medium text-black transition-all duration-200 bg-white border border-gray-300 rounded min-w-28 hover:from-blue-600 hover:to-blue-800">
            <span>{selectedDate ? selectedDate.toLocaleDateString() : "DATE"}</span><AiFillCaretDown className="text-xl" />
          </button>
          {isCalendarVisible && (
          <div className="absolute z-50 top-14 md:right-0 xsm:left-0">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              calendarClassName="custom-calendar"
            />
          </div>
            )}
        </div>
      </div>
      {/* bottom container (table) */}
      <div className="pb-3 mt-5 overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border-x-2 border-t-2 border-[#C0C2C2]">
          <thead>
            <tr className="font-semibold text-left text-black">
              <th className="px-4 py-5 ">#</th>
              <th className="w-[100%] md:w-auto px-4 py-5 uppercase">Name</th>
              <th className="px-4 py-5 uppercase">Time</th>
              <th className="px-4 py-5 uppercase">Fee</th>
              <th className="px-4 py-5 uppercase">View</th>
              <th className="px-4 py-5 uppercase">Status</th>
              <th className="px-4 py-5 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-[#ffffff1c] text-center border-t-2 border-[#C0C2C2]">
                <td className="px-4 py-5">{appointment.id ? appointment.id : "00"}</td>
                <td className="w-[250px] xl:w-[230px] px-4 py-5 flex items-center space-x-2">
                  <img src={appointment.img} alt={appointment.name} className="w-12 h-12 rounded-full" />
                  <span className="ml-10 text-left uppercase md:ml-0">{appointment.name ? appointment.name : "Name"}</span>
                </td>
                <td className="px-4 py-5 text-left">{appointment.time ? formatTime(appointment.time) : "00.00 XX"}</td>
                <td className="px-4 py-5 text-left">{appointment.fee ? appointment.fee : "0000/="}</td>
                <td className="px-4 py-5 text-left">
                    <button  onClick={() => handleDetails(appointment)} className={`${appointment.status === 'Paid' ? 'bg-[#006401] hover:bg-[#288e2a] border-[#00FF01]' : 'bg-[#244dc7d8] hover:bg-[#244dc7b6] border-[#0B2F9F]' } border-2 text-left text-white px-2 py-1 rounded-md `}>Details</button>
                </td>
                <td className="px-4 py-5 text-left">
                  {appointment.status === "Paid" ? (
                    <span className="bg-[#0DFF00] text-black px-6 py-1 border-1 border-[#288e2a] rounded-md">Paid</span>
                  ) : appointment.status === "Unpaid" ? (
                    <span className="bg-[#FF0000] text-black px-3 py-1 border-1 border-[#4C0000] rounded-md">Unpaid</span>
                  ) : (
                    <span className="bg-[#EEFF00] text-black px-2 py-1 border-1 border-[#d7e630] rounded-md">No Book</span>
                  ) }
                </td>
                <td className="flex items-center justify-center px-4 py-5 space-x-2 text-left">
                  <button className={`bg-white hover:bg-[#f3f3f3] p-2 rounded-full shadow-md`} title="Approve">
                    <BsPrinter className="text-xl text-[#0B2F9F]" />
                  </button>
                  <button onClick={() => handleAccept(appointment)} className={`${appointment.status === 'Paid' ? 'bg-[#3AF93C] hover:bg-[#6eff70] text-black' : 'bg-white text-[#3AF93C] hover:bg-[#f3f3f3]'} rounded-full shadow-md`} title="View">
                    <BsCheckCircle className="m-2 text-xl" />
                  </button>
                  <button onClick={() => handleReject(appointment)} className={`${appointment.status === 'Paid' ? 'bg-white hover:bg-[#f3f3f3] text-[#FF0000]' : 'bg-[#FF0000] text-black hover:bg-[#FF4747]'} rounded-full shadow-md`} title="Delete">
                    <BsXCircle className="m-2 text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="text-center bg-[#C7C7C7] uppercase w-[843px] xl:w-full border-dashed  border-2 border-[#666565] py-8">
              <p className="text-[#656565] font-semibold">Add new patient list</p>
        </button>
      </div>
      {/* details popup */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out transform bg-gray-900 bg-opacity-60">
            <div className="w-full max-w-xl m-3 scale-100 bg-white rounded-lg shadow-2xl">
                <div className="flex items-center px-3 py-2 justify-between border-b-[1px] border-black">
                  <h2 className="text-lg font-semibold text-black">Appointment Details </h2>
                  <button onClick={() => {setModalVisible(false); setIsEditing(false);}} className="text-black hover:text-gray-600">
                      <BiX className="text-2xl" />
                  </button>
                </div>
                {/* Appointment Details */}
                <form onSubmit={saveDetails} encType="multipart/form-data">
                  <div className="border-dashed border-b-[1px] border-black py-2">
                      <img  src={selectedDetails?.img || img } alt="PrfileImage" className="items-center w-24 h-24 mx-auto mt-4 rounded-full"/>
                      {isEditing ? (
                          <span>
                            <p className="text-[#0B2F9F] py-3 text-center">Full Name:  
                              <input
                                type="text"
                                value={editableDetails.name || ""}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="ml-2 bg-[#ececec] w-[30%] text-black px-2 py-1 border rounded"
                                placeholder="Full Name"
                              />
                            </p>
                            {formErrors.age && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                            )}
                           
                          </span>
                        ) : (
                          <h2 className="text-xl font-semibold text-center uppercase">{editableDetails.name || "Name"}</h2>
                        )}
                      
                  </div>
                  
                  <div className="flex flex-wrap justify-between px-3 py-1">
                    <div className="w-1/2 px-2">
                      <p className="text-[#0B2F9F] py-3">Age: 
                        {isEditing ? (
                          <span>
                            <input
                              type="number"
                              value={editableDetails.age || ""}
                              onChange={(e) => handleInputChange("age", e.target.value)}
                              className="bg-[#ececec] w-[100%] text-black px-2 py-1 border rounded"
                              placeholder="Age"
                            />
                            {formErrors.age && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.age}</p>
                            )}
                          </span>
                        ) : (
                          <span className="text-black"> {editableDetails.age || "N/A"} Years Old</span>
                        )}
                      </p>
                      <p className="text-[#0B2F9F] py-3">Gender: 
                        {isEditing ? (
                          <span>
                            <select 
                              value={editableDetails.gender || ""}  
                              onChange={(e) => handleInputChange("gender", e.target.value)} 
                              className="bg-[#ececec] w-[100%] text-black px-2 py-1 border rounded"
                              style={{color: editableDetails.gender === "" ? "#9ca0ab" : editableDetails.gender ? "#000000FF" : "#9ca0ab"  }}>
                              <option value="" disabled>Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                           </select>
                            {formErrors.gender && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
                            )}
                        </span>
                        ) : (
                          <span className="text-black"> {editableDetails.gender || "Not Specified"}</span>
                        )
                      }
                      </p>
                      <p className="text-[#0B2F9F] py-3">Phone Number: 
                        {isEditing ? (
                          <span>
                            <input 
                              type="text"
                              value={editableDetails.pNumber || ""}
                              onChange={(e) => handleInputChange("pNumber", e.target.value)}
                              className="bg-[#ececec] w-[100%] text-black px-2 py-1 border rounded"
                              placeholder="Phone Number" />
                            {formErrors.pNumber && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.pNumber}</p>
                            )}
                          </span>
                        ) : (
                          <span className="text-black"> {editableDetails.pNumber || "Not Provided"}</span>
                        )}
                      </p>
                    </div>
                    <div className="w-1/2 px-8">
                      <p className="text-[#0B2F9F] py-3">Date: 
                        {isEditing ? (
                          <span>
                            <input 
                              type="date"
                              value={editableDetails.date || ""}
                              onChange={(e) => handleInputChange("date", e.target.value)}
                              className="bg-[#ececec] w-[100%] text-black px-2 py-1 border rounded"
                              style={{ color: editableDetails.date ? "#000000FF" : "#9ca0ab" }}
                              />
                              {formErrors.date && (
                                <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                              )}
                          </span>
                        ) : (
                          <span className="text-black"> {editableDetails.date ? formatDate(editableDetails.date) : "YYYY-MM-DD"}</span>
                        )}
                      </p>
                      <p className="text-[#0B2F9F] py-2">Time: 
                      {isEditing ? (
                        <span>
                          <input 
                            type="time"
                            value={editableDetails.time || ""}
                            onChange={(e) => handleInputChange("time", e.target.value)}
                            className="bg-[#ececec] w-[100%] text-black px-2 py-1 border rounded"
                            style={{ color: editableDetails.time ? "#000000FF" : "#9ca0ab" }} />
                            {formErrors.date && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                            )}
                        </span>
                        ) : (
                          <span className="text-black"> {editableDetails.time ? formatTime(editableDetails.time) : "HH:MM AM/PM"}</span>
                        )}
                      </p>
                      <p className="text-[#0B2F9F] py-4">Department: 
                        {isEditing ? (
                          <input 
                          type="text"
                          value={editableDetails.department || ""}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          className="bg-[#ececec] w-[100%] text-[#70737a] px-2 py-1 border rounded" 
                          placeholder="Department"
                          disabled />
                        ) : (
                          <span className="text-black"> {editableDetails.department || "Not Assigned"}</span>
                        )}
                      </p>
                    </div>
                  </div>
                    {isEditing ? (
                      <div className="flex justify-end px-6 py-3 space-x-4">
                        <input value="Submit" type="submit" className="px-4 py-1 bg-[#0B2F9F] text-white rounded hover:bg-[#3352b1] transition duration-200 shadow-md" />
                        <button  type="button" onClick={() => setIsEditing(false)} className="px-4 py-1 bg-[#97CE4F] text-white rounded hover:bg-[#aae859] transition duration-200 shadow-md">Back</button> 
                      </div>

                    ) : (
                      <div className="flex justify-end px-6 py-3 space-x-4">
                        <button type="button" onClick={toggleEditDetails} className="px-4 py-1 bg-[#0B2F9F] text-white rounded hover:bg-[#3352b1] transition duration-200 shadow-md"> Edit </button>
                        <button type="button" onClick={() => setModalVisible(false)} className="px-4 py-1 bg-[#97CE4F] text-white rounded hover:bg-[#aae859] transition duration-200 shadow-md">Ok</button>
                      </div>
                    )}
                </form>
            </div>
        </div>
      )}
       <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default PatientsAppointment;