import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { AiFillCaretDown } from "react-icons/ai";
import { BsPrinter, BsCheckCircle, BsXCircle } from "react-icons/bs";
import img from '../img/doctorPatientsProfile.png';
import { IoIosCloseCircle,IoMdClose } from "react-icons/io";

export default function Invoice() {

  const appointments = [
    { id: "01", name: "Emily Johnson", time: "11:00AM", fee: "1500/=", status: "Paid", img: img},
    {id: "02", name: "Michael Smith", time: "13:00PM", fee: "1500/=", status: "Paid", img: img},
    {id: "03", name: "Sophia Martinez", time: "09:10AM", fee: "1500/=", status: "Paid", img: img},
    {id: "04",name: "David Lee", time: "16:30PM", fee: "1500/=",status: "Unpaid", img: img},
    {id: "05", name: "Isabella Brown", time: "11:20AM", fee: "1500/=", status: "Paid", img: img},
    {id: "06", name: "Christopher Garcia", time: "08:40AM", fee: "1500/=", status: "Paid", img: img},
    {id: "07", name: "Olivia Wilson", time: "05:12PM",fee: "1500/=",status: "Unpaid", img: img},
    {id: "08", name: "Olivia Wilson", time: "05:12PM",fee: "1500/=",status: "NoBook", img: img},
  ]; 
  
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
      setIsCalendarVisible(false); 
    };
   

    const formatTime = (time) => time
    const handleDetails = (appointment) => {
      alert(`Viewing details for ${appointment.name}`);
    };

   const [isFeePopupOpen, setIsFeePopupOpen] = useState(false);

    const handleOpenFeePopup = (appointment) => {
      setSelectedAppointment(appointment);
    setIsFeePopupOpen(true);
    };

    const handleClosePopup = () => {
    setIsFeePopupOpen(false);
    };

  

    const [rows, setRows] = useState([
      { description: "Doctor Fee", amount: 1000 },
      { description: "Channeling Fee", amount: 1000 },
    ]);
  
    const handleAddRow = () => {
      setRows([...rows, { description: "", amount: 0 }]);
    };
  
    const handleRemoveRow = (index) => {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    };
  
    const handleInputChange = (index, field, value) => {
      const updatedRows = [...rows];
      updatedRows[index][field] = value;
      setRows(updatedRows);
    };
  
    const calculateTotal = () => {
      return rows.reduce((total, row) => total + Number(row.amount || 0), 0);
    };

  return (
    <div>

<div className="items-center justify-between mt-2 space-y-3 md:flex md:space-x-3 md:space-y-0">
        <div className="space-y-2 md:flex md:space-x-3 md:space-y-0">
          <h1 className="text-[20px] uppercase font-semibold text-left">invoice list&nbsp;&nbsp;&nbsp;</h1>
          <button
          className="bg-[#00FF03] mr-2 md:mr-0 w-auto px-2 h-auto py-1 lg:py-0 lg:h-8 text-black rounded text-center font-medium">
            Make Invoice</button> 
        </div>
        
        <div className='flex '>
            <button className='flex w-[110px] h-[30px] bg-[#5478BD] hover:bg-[#3a5894] text-white border-[1px] border-[#161D6F] rounded pl-4 py-[1px] mt-2 xl:ml-[400px]'>
            Services<AiFillCaretDown className="mt-1 text-xl" /></button>
            <div className='flex'>
            <button className='bg-[#FF0000B2] hover:bg-rose-700 w-[80px] h-[40px] ml-[15px] pr-3 rounded border-[1px] rounded-tr-[26px] rounded-br-[26px] text-[#510000] border-[#510000]'>
            Print </button>
            <BsPrinter className="absolute text-xl bg-white text-[#510000] h-[35px] w-[35px] p-[5px] rounded-full ml-[75px] mt-[2px]" />
            </div>  
        </div>  
        
        {/* calendar search */}
        <div className="relative">
          <button  onClick={() => setIsCalendarVisible(!isCalendarVisible)}
           className="flex items-center justify-between h-12 px-3 font-medium text-black transition-all duration-200 bg-white border border-gray-300 rounded min-w-28 hover:from-blue-600 hover:to-blue-800">
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
    
      <div className="pb-3 mt-5 overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border-x-2 border-y-2 border-[#C0C2C2] border-l-[#98DED9]">
          <thead>
            <tr className="font-semibold text-left text-black">
              <th className="px-4 py-5">#</th>
              <th className="w-[30%] px-4 py-5 uppercase">Name</th>
              <th className="px-4 py-5 uppercase">Time</th>
              <th className="px-4 py-5 uppercase">Fee</th>
              <th className="px-4 py-5 uppercase">Status</th>
              <th className="px-4 py-5 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="hover:bg-emerald-50 text-center border-t-2 border-[#C0C2C2]"
              >
                <td className="px-4 py-5">{appointment.id}</td>
                <td className="w-[250px] px-4 py-5 flex items-center space-x-2">
                  <img
                    src={appointment.img}
                    alt={appointment.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="ml-10 text-left uppercase">
                    {appointment.name}
                  </span>
                </td>
                <td className="px-4 py-5 text-left">
                  {formatTime(appointment.time)}
                </td>
                <td className="px-4 py-5 text-left hover:scale-[105%] transition-all duration-200"><span className='px-2 py-1 rounded cursor-pointer bg-green' 
                onClick={() => handleOpenFeePopup(appointment)}>{appointment.fee}</span></td>
                
                <td className="px-4 py-5 text-left">
                  {appointment.status === "Paid" ? (
                    <span className="bg-[#0DFF00] text-black px-6 py-1 border-[#056700] border-[1px] rounded-md">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-[#FF0000] text-black px-3 py-1 rounded-md border-[#4C0000] border-[1px]">
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="flex items-center justify-center px-4 py-5 space-x-2 text-left">
                 
                  <button
                    className={`${
                      appointment.status === "Paid"
                        ? "bg-[#3AF93C] hover:bg-[#6eff70] text-black"
                        : "bg-white text-[#3AF93C] hover:bg-[#f3f3f3]"
                    } rounded-full shadow-md`}
                    title="View"
                  >
                    <BsCheckCircle className="m-2 text-xl" />
                  </button>
                  <button
                    className={`${
                      appointment.status === "Paid"
                        ? "bg-white hover:bg-[#f3f3f3] text-[#FF0000]"
                        : "bg-[#FF0000] text-black hover:bg-[#FF4747]"
                    } rounded-full shadow-md`}
                    title="Delete"
                  >
                    <BsXCircle className="m-2 text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
 
      </div>

    {/*patient fee popup */}
      {isFeePopupOpen && (
       
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-[90%] md:w-[500px]">
            <div>
              <IoMdClose
                className="hover:text-red text-gray-300 text-[20px] cursor-pointer xl:ml-[430px] ml-[320px]"
               onClick={handleClosePopup}
              />
              <h2 className="mb-4 text-lg font-bold">
                Invoice: {selectedAppointment?.name || 'n/a'}
              </h2>
            </div>
            <table className="w-full border border-[#161D6F]">
              <thead>
                <tr className="bg-[#A7AEFF] border-2 border-[#161D6F]">
                  <th className="px-1 py-2">Description</th>
                  <th className="px-4 py-2 border-l-2 border-[#161D6F]">
                    Amount
                  </th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-[#D9D9D980] border-2">
                {rows.map((row, index) => (
                  <tr key={index} className="border-2 border-[#161D6F]">
                    <td className="px-4 py-2 border-r-2 border-[#161D6F]">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleInputChange(index, "description", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={row.amount}
                        onChange={(e) =>
                          handleInputChange(index, "amount", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <IoIosCloseCircle
                        className="cursor-pointer text-red"
                        onClick={() => handleRemoveRow(index)}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="border-2 border-[#161D6F] text-[#161D6F] font-bold">
                  <td className="px-4 py-2 border-r-2 border-[#161D6F]">Total</td>
                  <td className="px-4 py-2">{calculateTotal()}/=</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-start mt-4 space-x-2">
              <button
                onClick={handleAddRow}
                className="px-4 py-1 text-white rounded bg-[#0F22FF]"
              >
                Add Row
              </button>
              <button className="px-4 py-1 text-white rounded bg-[#020FA8]">
                Save
              </button>
              <button className="px-4 py-1 text-white rounded bg-[#010972]">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
}
