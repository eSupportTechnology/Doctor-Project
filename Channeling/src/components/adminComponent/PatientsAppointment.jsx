import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaEye, FaEdit } from "react-icons/fa";
import { toast } from 'react-toastify';
import { MdDelete, MdRestore } from "react-icons/md";
import { BsFillPrinterFill } from "react-icons/bs";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Modal } from "flowbite-react";
import { IoArrowBackOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";

const PatientsAppointment = ({ onAppointments }) => {
  const [categories, setCategories] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewAppointments, setViewAppointments] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showServiceInput, setShowServiceInput] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [formData, setFormData] = useState({
    appointmentId: selectedId,
    description: '',
    price: ''
  });
  const [details, setDetails] = useState([]);

  const fetchServices = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/service/details?appointmentId=${id}`);
      const data = await response.json();

      if (response.ok) {
        setDetails(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Something went wrong");
    }
  }

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.price) {
      toast.error("All fields are required!");
      return;
    }

    console.log(formData);

    const response = await axios.post('http://localhost:8081/service/create', formData)

    if (response.status === 200) {
      fetchServices(selectedId);
      setShowServiceInput(false);
      toast.success("Service added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const serviceInputRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8081/category/doccategory')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleOpenModel = (id, fee) => {
    setSelectedId(id);
    setFormData({
      ...formData,
      appointmentId: id, // Set the appointmentId when opening the modal
    });
    setSelectedFee(fee);
    fetchServices(id);
    setOpenModal(true);
  }

  function onCloseModal() {
    setOpenModal(false);
  }

  const handlePrintAppointment = (id) => {
    axios.get(`http://localhost:8081/appointment/appointments/print/${id}`, {
      responseType: 'blob', // PDF file download
    })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL); // PDF open 
      })
      .catch((error) => {
        console.error('Error printing appointment:', error);
        toast.error('Error printing appointment.', {
          position: "top-center",
        });
      });
  };


  const handleViewAppointments = (doctorName) => {
    axios
      .get(`http://localhost:8081/appointment/appointments/${doctorName}`)
      .then((response) => {
        if (response.data.length === 0) {
          setAppointments([]);
          setError('No appointments found for this doctor');
          toast.error('No appointments found for this doctor!');
        } else {
          setAppointments(response.data);
          setSelectedDoctor(doctorName);
          setViewAppointments(true);
        }
      })
      .catch((error) => {
        console.log(error.response);
        toast.error('No appointments found for this doctor.', {
          position: "top-center",
        });
      });
  };

  const handleBackToTable = () => {
    setViewAppointments(false);
    setAppointments([]);
    setSelectedDoctor(null);
    setSelectedDate(false);
  };

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

  const columnsDoctors = [
    { name: 'Doctor ID', selector: row => row.id, sortable: true },
    { name: 'Doctor Name', selector: row => row.fullName, sortable: true },
    { name: 'Experience', selector: row => row.experience, sortable: true },
    { name: 'Contact', selector: row => row.contact_number },
    {
      name: '',
      cell: row => (
        <button
          onClick={() => handleViewAppointments(row.fullName)}
          className="flex items-center justify-center align-middle font-semibold gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105"
        >
          <FaEye className='text-sm' />
          View Appointment
        </button>
      ),
    },
  ];

  const columnsAppointments = [
    {
      name: '#', selector: row => row.id, sortable: true, cell: row => (
        <span
          className={`${row.deleted_at ? 'opacity-50' : 'opacity-100'}`}
        >
          {row.id}
        </span>
      ),
    },
    {
      name: 'Patient Name', selector: row => `${row.firstName} ${row.lastName}`, sortable: true, cell: row => (
        <span
          className={`${row.deleted_at ? 'opacity-50' : 'opacity-100'}`}
        >
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      name: 'Time', selector: row => row.timeSlot, sortable: true, cell: row => (
        <span
          className={`${row.deleted_at ? 'opacity-50' : 'opacity-100'}`}
        >
          {row.timeSlot}
        </span>
      ),
    },
    /* {
       name: 'Fee',
       //selector: row => `${row.fee}`, // Assume fee is available in row.fee
      
       sortable: true,
     },*/
    {
      name: 'Fee',
      cell: row => (
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => handleOpenModel(row.id, row.fee)}
            disabled={row.deleted_at !== null} // Disable if canceled
            className={`flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 
              bg-yellow-500 text-white transform transition-transform duration-300 hover:scale-105
              ${row.deleted_at ? 'opacity-50 cursor-not-allowed' : ''}`} // Reduce opacity & disable pointer
          >
            Rs. {row.fee}
          </button>
        </div>
      ),
      sortable: false,
    },
    
    {
      name: 'View',
      cell: row => (
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => handleViewDetails(row)}
            disabled={row.deleted_at !== null} // Disable if canceled
            className={`flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50
               bg-blue text-white transform transition-transform duration-300 hover:scale-105 
               ${row.deleted_at ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Details
          </button>
        </div>
      ),
      sortable: false,
    },

    {
      name: 'Status',
      selector: row => (
        <select
          value={row.status || 'unpaid'} // default to 'unpaid'
          onChange={(e) => handleStatusChange(e, row.id)}
          disabled={row.deleted_at !== null} // Disable if canceled
          style={{
            backgroundColor: row.status === 'paid' ? '#97CE4F' : '#FF4A4A',
            color: 'white',
            padding: '5px 8px', // Adjust padding (top-bottom, left-right)
            borderRadius: '5px', // Border radius for rounded corners
            border: 'none', // Remove default border
            fontSize: '14px', // Adjust font size (optional)
          }}
        >
          <option
            value="unpaid"
            style={{
              backgroundColor: 'red',
              padding: '10px', // Padding inside the option
              borderRadius: '5px', // Border radius for rounded corners in options
            }}
          >
            Unpaid
          </option>
          <option
            value="paid"
            style={{
              backgroundColor: '#0DFF00BD',
              padding: '10px', // Padding inside the option
              borderRadius: '5px', // Border radius for rounded corners in options
            }}
          >
            Paid
          </option>
        </select>
      ),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex items-center justify-center space-x-3">
          {/* Print Button */}
          <button
              onClick={() => handlePrintAppointment(row.id)}
              disabled={row.deleted_at !== null} // Disable if canceled
              className={`flex items-center justify-center align-middle font-semibold gap-1 p-[6px] 
                rounded-md shadow-md shadow-slate-400/50 bg-sky-600 text-white transform transition-transform duration-300 
                hover:scale-105 ${row.deleted_at ? 'opacity-50 cursor-not-allowed' : ''}`} // Reduce opacity if canceled
              >
              <BsFillPrinterFill className='text-sm' />
          </button>

          {/* Cancel OR Restore Button */}
          {row.deleted_at ? (
            // Restore Button (If deleted_at exists)
            <button
              onClick={() => handleRestoreAppointment(row.id)}
              className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 bg-white text-lime-500 transform transition-transform duration-300 hover:scale-105">
              <MdRestore className='text-sm' />
            </button>
          ) : (
            // Cancel Button (If not deleted)
            <button
              onClick={() => handleCancelAppointment(row.id)}
              className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 bg-white text-red transform transition-transform duration-300 hover:scale-105">
              <ImCancelCircle className='text-sm' />
            </button>
          )}
        </div>
      ),
      sortable: false
    },
  ];

  // Cancel Appointment (Soft Delete)
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8081/appointment/appointments/cancel/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Appointment canceled successfully.');
        window.location.reload(); // Reload to reflect changes
      } else {
        alert('Failed to cancel appointment.');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  // Restore Appointment
  const handleRestoreAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8081/appointment/appointments/restore/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Appointment restored successfully.');
        window.location.reload(); // Reload to reflect changes
      } else {
        alert('Failed to restore appointment.');
      }
    } catch (error) {
      console.error('Error restoring appointment:', error);
    }
  };


  const handleViewDetails = (row) => {
    Swal.fire({
      title: `Patient Information`,
      html: `
      <div>
        <h1><strong>Name:</strong> ${row.firstName} ${row.lastName}</h1>
        <p><strong>Age:</strong> ${row.age || 'Not Available'}</p>
        <p><strong>Gender:</strong> ${row.gender || 'Not Available'}</p>
        <p><strong>Contact:</strong> ${row.mobileNo || 'Not Available'}</p>
        <p><strong>NIC Number:</strong> ${row.nic}</p>
        <p><strong>Appointment Time:</strong> ${row.timeSlot}</p>
        <p><strong>Status:</strong> ${row.status || 'Not Available'}</p>
        <div style="display: flex; justify-content: right; margin-top: 15px;">
          <button id="editButton" class="swal2-confirm swal2-styled" style="background-color: #007BFF;">Edit</button>
          <button id="cancelButton" class="swal2-cancel swal2-styled" style="background-color: #d33;">Cancel</button>  
        </div>
      </div>
    `,
      icon: 'info',
      showConfirmButton: false, // Hide default close button
    });

    // Add an event listener to the Edit button
    setTimeout(() => {
      const editButton = document.getElementById("editButton");
      const cancelButton = document.getElementById("cancelButton");

      if (editButton) {
        editButton.addEventListener("click", () => handleEditDetails(row));
      }

      if (cancelButton) {
        cancelButton.addEventListener("click", () => {
          Swal.close(); // Close the Swal popup
        });
      }
    }, 0);
  };


  const handleEditDetails = (row) => {
    Swal.fire({
      title: "Edit Patient Details",
      html: `
      <form id="editForm">
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div style="flex: 1 1 45%;">
            <label style="font-size: 18px;"><strong>First Name:</strong></label>
            <input type="text" id="editFirstName" value="${row.firstName}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/>
          </div> 
          <div style="flex: 1 1 45%;">
            <label style="font-size: 18px;"><strong>Last Name:</strong></label>
            <input type="text" id="editLastName" value="${row.lastName}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div style="flex: 1 1 45%;">
            <label style="font-size: 18px;"><strong>Age:</strong></label>
            <input type="number" id="editAge" value="${row.age || ''}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/>
          </div> 
          <div style="flex: 1 1 45%;">
            <label style="font-size: 18px;"><strong>Gender:</strong></label>
            <input type="text" id="editGender" value="${row.gender || ''}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/> 
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div style="flex: 1 1 45%;">
            <label style="font-size: 18px;"><strong>Contact:</strong></label>
            <input type="text" id="editMobileNo" value="${row.mobileNo || ''}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/>
          </div> 
          <div style="flex: 1 1 45%;">
            <label style="font-size: 18px;"><strong>NIC Number:</strong></label>
            <input type="text" id="editNic" value="${row.nic}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/>  
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div style="flex: 1 1 45%;">
            <label style="font-size: 18px;"><strong>Appointment Time:</strong></label>
            <input type="text" id="editTimeSlot" value="${row.timeSlot}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/>
          </div> 
          <div style="flex: 1 1 45%;">  
            <label style="font-size: 18px;"><strong>Status:</strong></label>
            <input type="text" id="editStatus" value="${row.status || ''}" class="swal2-input" style="width: 70%; font-size: 16px; padding: 8px;"/>
          </div>
        </div>
      </form>
    `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const updatedRow = {
          id: row.id, // Include ID for update
          firstName: document.getElementById("editFirstName").value,
          lastName: document.getElementById("editLastName").value,
          age: parseInt(document.getElementById("editAge").value) || null, // Convert to integer
          gender: document.getElementById("editGender").value,
          mobileNo: document.getElementById("editMobileNo").value,
          nic: document.getElementById("editNic").value,
          timeSlot: document.getElementById("editTimeSlot").value,
          status: document.getElementById("editStatus").value,
        };

        // Send data to the backend
        return fetch(`http://localhost:8081/appointment/appointments/update/${row.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRow),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "Appointment updated successfully") {
              Swal.fire("Success", "Details updated successfully", "success").then(() => {
                window.location.reload(); // Refresh page after successful update
              });
            } else {
              Swal.fire("Error", "Failed to update details", "error");
            }
          })
          .catch((error) => {
            console.error("Error updating details:", error);
            Swal.fire("Error", "Something went wrong", "error");
          });
      }
    });
  };



  // Function to handle status change
  const handleStatusChange = (event, id) => {
    const newStatus = event.target.value;

    // Update the status in the backend (this should be an API call)
    axios
      .put(`http://localhost:8081/appointment/appointments/update-status/${id}`, { status: newStatus })
      .then((response) => {
        toast.success('Status updated successfully', {
          position: "top-center",
        });
        // You can also update the status in local state here
        const updatedAppointments = appointments.map((appointment) => {
          if (appointment.id === id) {
            return { ...appointment, status: newStatus };
          }
          return appointment;
        });
        setAppointments(updatedAppointments);
      })
      .catch((error) => {
        toast.error('Failed to update status', {
          position: "top-center",
        });
      });
  };

  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false); // New state to track table visibility

  const fetchAppointments = async (selectedDate, doctorId) => {
    try {
      console.log("Fetching Appointments for Date:", selectedDate);
      console.log("Doctor ID:", doctorId);
  
      if (!selectedDate) {
        console.error("Error: Selected Date is null or undefined!");
        return;
      }
  
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      console.log("Formatted Date:", formattedDate);
  
      const response = await axios.get(
        `http://localhost:8081/appointment/appointments/filter/${formattedDate}`,
        { params: { doctorId } }
      );
      setAppointments(response.data); // Update appointments state with data
      console.log("Appointments Response:", response.data);
  
      if (response.data.length > 0) {
        setShowTable(true); // Show table if appointments exist
      } else {
        setShowTable(false); // Hide table if no appointments
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments.");
      setAppointments([]); // Clear appointments on error
      setShowTable(false); // Hide table if error occurs
    }
  };
  
  // Function to get doctor ID by name
  const getDoctorIdByName = async (doctorName) => {
    try {
      const encodedName = encodeURIComponent(doctorName);
      const response = await axios.get(`http://localhost:8081/appointment/doctors?name=${encodedName}`);
      return response.data.id;
    } catch (error) {
      console.error("Error fetching doctor ID:", error);
      return null;
    }
  };
  
  const handleDateChange = async (event) => {
    const date = event.target.value;
    console.log("User Selected Date:", date);
  
    if (!date || isNaN(new Date(date))) {
      console.error("Error: Selected Date is null or invalid!");
      return;
    }
  
    setSelectedDate(date);
  
    if (!selectedDoctor) {
      console.error("Error: No doctor selected!");
      return;
    }
  
    const doctorId = await getDoctorIdByName(selectedDoctor);
  
    if (!doctorId) {
      console.error("Error: Doctor ID Not Found!");
      return;
    }
  
    await fetchAppointments(date, doctorId); // Fetch appointments based on the selected date and doctor
  };
  
  
  
  return (
    <div>
      {/* <h1 className="text-[20px] uppercase font-semibold text-left">Check Doctor's Appointment</h1> */}
      {error && <p>Error: {error}</p>}

      {viewAppointments ? (
        <>

          <div className='flex items-center justify-between '>
            <div className='flex gap-4'>
              <button
                onClick={handleBackToTable}
                className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-blue text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105"
              >
            
              <IoArrowBackOutline />
                Back
              </button>
            </div>

            <div>
              <input className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-fontDark text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105" 
              value={selectedDate}
              onChange={handleDateChange}
              type="date" name="" id="" />
            </div>
            
            {loading && <p>Loading appointments...</p>}
            {error && <p>{error}</p>}
      
    
          </div>
          <h2 className='mt-2 text-[20px] text-indigo-900 text-center font-bold'>
            Appointments for <span className='text-[23px] text-indigo-950'> Dr. {selectedDoctor}</span>
          </h2>
      {!showTable && (
          <DataTable
            columns={columnsAppointments}
            data={appointments}
            fixedHeader
            fixedHeaderScrollHeight="80vh"
            className="data-table"
            customStyles={customStyles}
          />
      )}

{showTable && appointments.length > 0 ? (
      <div>
        <h2 className='mt-2 text-[20px] text-indigo-900 text-center font-bold'>{selectedDate}</h2>
        <DataTable
          columns={columnsAppointments}
          data={appointments}
          fixedHeader
          fixedHeaderScrollHeight="80vh"
          className="data-table"
          customStyles={customStyles}
        />
      </div>
    ) : (
      <p></p>
    )}
  

        </>
      ) : (
        categories.map((category) => (
          <div key={category.id}>
            <h1 className="bg-[#4694C8] mt-6 w-fit p-1 rounded-sm text-gray-50 text-lg">
              {category.eng_name}
            </h1>
            <DataTable
              columns={columnsDoctors}
              data={category.Doctors}
              fixedHeader
              fixedHeaderScrollHeight="80vh"
              className="data-table"
              customStyles={customStyles}
            />
          </div>
        ))
      )}

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header className='bg-fontDark' />
        <Modal.Body className='bg-white'>
          <div className="space-y-6">
            <h3 className="mb-6 text-xl font-medium text-gray-900">Add <span className='text-red'>New</span> Service</h3>
          </div>
          <div className='w-full'>
            <div className="flex items-center justify-between w-full p-3 border rounded-xl border-blue">
              <h1>Doctor Fee</h1>

              <div className='flex items-center justify-center gap-3'>
                <h1 className='font-semibold text-red'>Rs {selectedFee}</h1>
                <button className="flex items-center justify-center align-middle font-semibold gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
                  <FaEdit className='text-sm' />
                </button>

                <button className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-red text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
                  <MdDelete className='text-sm' />
                </button>
              </div>
            </div>

            {details.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between w-full p-3 mt-2 border rounded-xl border-blue"
              >
                <h1>{service.description}</h1>
                <div className='flex items-center justify-center gap-3'>
                  <h1 className='font-semibold text-red'>Rs {service.price}</h1>
                  <button className="flex items-center justify-center align-middle font-semibold gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
                    <FaEdit className='text-sm' />
                  </button>

                  <button className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-red text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
                    <MdDelete className='text-sm' />
                  </button>
                </div>
              </div>
            ))}

            <div className='flex items-center justify-center w-full p-3'>
              <button onClick={() => setShowServiceInput(true)} className="flex items-center justify-center align-middle font-semibold gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-blue text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">Add Service</button>
            </div>

            {showServiceInput && (
              <div ref={serviceInputRef} className="w-full p-3 my-2 border rounded-xl border-green">
                <form onSubmit={handleSubmit}>
                  <div className='flex items-center justify-between gap-2'>
                    <input placeholder='Enter Service' name='description' id='description' value={formData.description} onChange={handleChanges} type="text" className='w-[70%] h-8 rounded-md border border-gray-400 p-2' />
                    <input placeholder='Fee' type="text" value={formData.price} name='price' id='price' onChange={handleChanges} className='w-[30%] h-8 rounded-md border border-gray-400 p-2' />
                  </div>

                  <div className='flex items-center justify-end w-full mt-2'>
                    <button type='submit' className="w-[28%] flex text-sm font-light items-center justify-center align-middle gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">Submit</button>
                  </div>
                </form>
              </div>
            )}

            <div className="flex items-center justify-between w-full p-3 border rounded-xl border-red">
              <h1 className='font-semibold'>Total Appointment Fee</h1>
              <h1 className='font-semibold underline text-red underline-offset-2 decoration-double'>Rs {selectedFee + details.reduce((total, service) => total + service.price, 0)}</h1>
            </div>
          </div>
        </Modal.Body>
      </Modal>
         
    </div>
  );
};

export default PatientsAppointment;