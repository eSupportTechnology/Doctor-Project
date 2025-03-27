import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { Modal } from "flowbite-react";
import toast, { Toaster } from 'react-hot-toast';

const ViewInvoice = ({ doctor, onCancelInvoice }) => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    appointmentId: selectedId,
    description: '',
    price: ''
  });
  const [details, setDetails] = useState([]);
  const [services, setServices] = useState([]);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchOnlyServices = async (id) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const filteredData = selectedDate
    ? data.filter((row) => formatDate(row.created_at) === selectedDate)
    : data;

    useEffect(() => {
      // Reset selected rows whenever the selected date changes
      setSelectedRows([]);
    }, [selectedDate]);

  const filteredServiceData = selectedDate
    ? services.filter((row) => formatDate(row.created_at) === selectedDate)
    : services;

  const fetchServices = (id) => {
    axios
      .get(`http://localhost:8081/service/doctor/services?doctorID=${id}`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError(error);
      });
  };

  const handleCheckboxChange = (id, price, checked) => {
    setSelectedRows(prevSelected => {
      if (checked) {
        return [...prevSelected, { id, price }];
      } else {
        return prevSelected.filter(item => item.id !== id);
      }
    });
  };

  const calculateTotalPrice = () => {
    return selectedRows.reduce((total, row) => total + row.price, 0);
  };

  const serviceInputRef = useRef(null);

  const fetchInvoices = (id) => {
    axios
      .get(`http://localhost:8081/appointment/doctor?doctorID=${id}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        setError(error);
      })
  };

  useEffect(() => {
    fetchInvoices(doctor.id);
    fetchServices(doctor.id);
  }, []);

  const handleOpenModel = () => {
    setOpenModal(true);
  }

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const columns = [
    { name: 'Id', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.firstName + " " + row.lastName, sortable: true },
    { name: 'Time Slot', selector: row => row.timeSlot, sortable: true },
    { name: 'Date', selector: row => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(row.created_at)), sortable: true },
    {
      name: 'Fee',
      cell: row => (
        <div className="flex space-x-3 justify-center items-center">
          <button
            className="flex items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-blue text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105"
          >
            Rs {row.fee}
          </button>
        </div>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex space-x-3 justify-center items-center">
          <button className="flex items-center justify-center align-middle font-semibold gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
            <FaEdit className='text-sm' />
          </button>

          <button className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-red text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
            <MdDelete className='text-sm' />
          </button>
        </div>
      ),
    },
  ];

  const totalFee = filteredData.reduce((sum, row) => sum + (row.fee || 0), 0);

  const ServiceColumns = [
    { name: "Appointment Id", selector: (row) => row.appointment.id, sortable: true },
    { name: "Name", selector: (row) => row.description, sortable: true },
    { name: "Patient Name", selector: (row) => row.appointment.firstName + " " + row.appointment.lastName, sortable: true },
    {
      name: "Date",
      selector: (row) => new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(row.created_at)),
      sortable: true
    },
    {
      name: "Price",
      cell: (row) => (
        <button
          className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1 outline-slate-500 gap-1 bg-blue text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105"
        >
          Rs {row.price}
        </button>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex space-x-3 justify-center items-center">
          <input
            type="checkbox"
            name="selection"
            className="accent-green"
            onChange={(e) => handleCheckboxChange(row.id, row.price, e.target.checked)}
          />
        </div>
      ),
    },
  ];

  function onCloseModal() {
    setOpenModal(false);
  }

  const calculateTotalFees = (doctorFee, price) => {
    const totalInvoice = doctorFee + price;

    setTotalInvoice(totalInvoice);

    handleOpenModel(true);
  }

  return (
    <div>
      <Toaster />
      <div className='flex items-center justify-between '>
        <div className='flex gap-4 flex-col md:flex-row sm:flex-row'>
          <button onClick={onCancelInvoice} className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-blue text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
            <IoArrowBackOutline />
            Back
          </button>

          <button className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
            Other Services
          </button>

          <button onClick={() => calculateTotalFees(totalFee, calculateTotalPrice())} className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-red text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
            Calculate Final Cost
          </button>
        </div>

        <div>
          <input
            type="date"
            className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-fontDark text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h1 className="text-sm bg-[#42455f] w-fit py-1 px-3 text-white uppercase font-light text-left">Invoices According to the Doctor's Appointment</h1>
        <DataTable
          columns={columns}
          data={filteredData}
          fixedHeader
          fixedHeaderScrollHeight="80vh"
          className="data-table"
          customStyles={customStyles}
        // pagination
        />
        <div className="flex w-full items-center justify-end text-lg font-semibold">
          <h1 className='p-3 bg-green'>Total Fee: Rs {totalFee}</h1>
        </div>
      </div>

      <div className='mt-6'>
        <h1 className="text-sm bg-[#42455f] w-fit py-1 px-3 text-white uppercase font-light text-left">Invoices According to the services</h1>
        <DataTable
          columns={ServiceColumns}
          data={filteredServiceData}
          fixedHeader
          fixedHeaderScrollHeight="80vh"
          className="data-table"
          customStyles={customStyles}
        />
        <div className="flex w-full items-center justify-end text-lg font-semibold">
          <h1 className='p-3 bg-green'>Total Cost: Rs {calculateTotalPrice()}</h1>
        </div>
      </div>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header className='bg-fontDark' />
        <Modal.Body className='bg-white'>
          <div className="space-y-6">
            <h3 className="text-xl mb-6 font-medium text-gray-900">Total Invoice on: <span className='text-red'>New</span></h3>
          </div>
          <div className='w-full'>
            <div className="w-full p-3 rounded-xl border-blue border flex items-center justify-between">
              <h1>Payment</h1>
              <h1>Rs {totalInvoice}</h1>
            </div>

            <div className='flex mt-3 justify-center items-center gap-3'>
              <button className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">Add to database</button>
              <button className="flex px-3 mb-4 items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-gray-600 text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">Print</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ViewInvoice