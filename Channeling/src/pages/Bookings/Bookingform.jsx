import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSearchParams, useNavigate  } from 'react-router-dom';

//Images
import Background from '../../assest/images/Background.png';
import Formbg from '../../assest/images/bgf.jpg';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Bookingform = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeForm, setActiveForm] = useState('unregistered');
  const [showUnregisteredTable, setShowUnregisteredTable] = useState(false);
  const [showRegisteredTable, setShowRegisteredTable] = useState(false);
  const [scheduleSheet, setScheduleSheet] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const tableRef = useRef(null);
  const scheduleID = searchParams.get('scheduleID');

  const [formData, setFormData] = useState({
    scheduleID: scheduleID,
    mobileNo: '',
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    ongoingNumber: 'no',
    age: '',
    nic: '',
    dateOfBirth: '',
    email: '',
    password: '',
    address: '',
    username: '',
    slotNumber: '',
    timeSlot: ''
  });

  const [regFormData, setRegFormData] = useState({
    scheduleID: scheduleID,
    patientId: '',
    mobileNo: '',
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    ongoingNumber: '',
    age: '',
    nic: '',
    slotNumber: '',
    timeSlot: ''
  });

  const [patientFormData, setPatientFormData] = useState({
    patientID: '',
    mobileNo: ''
  })

  const fetchScheduleSheets = async (scheduleID) => {
    try {
      const response = await fetch(`http://localhost:8081/schedule/getSheets?scheduleID=${scheduleID}`);
      const data = await response.json();

      console.log("API Response Data:", data);

      if (response.ok && Array.isArray(data) && data.length > 0) {
        const firstEntry = data[0]?.[0];
        console.log("First Entry:", firstEntry);

        const rawSheets = firstEntry?.sheets;
        console.log("Raw Sheets Field:", rawSheets);

        if (rawSheets) {
          const parsedSheets = JSON.parse(rawSheets);
          console.log("Parsed Sheets:", parsedSheets);
          setScheduleSheet(parsedSheets);
        } else {
          console.error("Sheets field is empty or invalid.");
          setScheduleSheet([]);
        }
      } else {
        console.error("Invalid API response structure or no data available.");
        setScheduleSheet([]);
      }
    } catch (error) {
      console.error("Sheets fetching error:", error);
      setScheduleSheet([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setShowUnregisteredTable(false);
        setShowRegisteredTable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchScheduleSheets(scheduleID);
  }, [scheduleID]);

  const handleYesSelection = () => {
    setShowUnregisteredTable(false);

    const lowestAvailableSheet = scheduleSheet.find((sheets) => sheets.status === "available");
    if (lowestAvailableSheet) {
      setSelectedSheet(lowestAvailableSheet.slotNumber);
      setSelectedTime(lowestAvailableSheet.timeSlot);

      setFormData((prevData) => ({
        ...prevData,
        slotNumber: lowestAvailableSheet.slotNumber,
        timeSlot: lowestAvailableSheet.timeSlot,
      }));

      console.log("Lowest available sheet selected:", lowestAvailableSheet.slotNumber);
    } else {
      console.log("No available sheets.");
    }
  }

  const RegisterHandleYesSelection = () => {
    setShowRegisteredTable(false);

    const lowestAvailableSheet = scheduleSheet.find((sheets) => sheets.status === "available");
    if (lowestAvailableSheet) {
      setSelectedSheet(lowestAvailableSheet.slotNumber);
      setSelectedTime(lowestAvailableSheet.timeSlot);

      setRegFormData((prevData) => ({
        ...prevData,
        slotNumber: lowestAvailableSheet.slotNumber,
        timeSlot: lowestAvailableSheet.timeSlot,
      }));

      console.log("Lowest available sheet selected:", lowestAvailableSheet.slotNumber);
    } else {
      console.log("No available sheets.");
    }
  }

  const handleNoSelection = () => {
    setShowUnregisteredTable(true);
    setSelectedSheet(null);
    setSelectedTime(null);
  };

  const RegisterHandleNoSelection = () => {
    setShowRegisteredTable(true);
    setSelectedSheet(null);
    setSelectedTime(null);
  };

  const handleSheetSelection = (sheet, time) => {
    setSelectedSheet(sheet);
    setSelectedTime(time);
    setFormData((prevData) => ({
      ...prevData,
      slotNumber: sheet,
      timeSlot: time
    }));
    console.log(`Selected Slot: ${sheet}, Time Slot: ${time}`);
  };

  const RegisterHandleSheetSelection = (sheet, time) => {
    setSelectedSheet(sheet);
    setSelectedTime(time);
    setRegFormData((prevData) => ({
      ...prevData,
      slotNumber: sheet,
      timeSlot: time
    }));
    console.log(`Selected Slot: ${sheet}, Time Slot: ${time}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registerHandleChange = (e) => {
    const { name, value } = e.target;
    setRegFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateHandleChange = (e) => {
    const { name, value } = e.target;
    setPatientFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleGenerate = async (e) => {
    e.preventDefault();
    console.log('Generating patient details...');

    if (!patientFormData.patientID && !patientFormData.mobileNo) {
      toast.error('Please enter either Patient ID or Mobile Number');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8081/patient/generate`, {
        patientID: patientFormData.patientID,
        mobileNo: patientFormData.mobileNo,
      });

      if (response.data.success) {
        const patientData = response.data.data;

        const age = calculateAge(patientData.dob);

        setRegFormData((prevState) => ({
          ...prevState,
          patientId: patientData.id || '', // Map patient ID
          mobileNo: patientData.phone || '', // Map mobile number
          firstName: patientData.firstName || '',
          lastName: patientData.lastName || '',
          gender: patientData.gender || '',
          ongoingNumber: patientData.ongoingNumber || '', // Add fields as per API response
          age: age || '', // Assuming age is in response
          nic: patientData.nic || '',
          slotNumber: '', // Leave empty if unrelated to patient details
          timeSlot: '', // Leave empty if unrelated to patient details
        }));

        toast.success('Patient details successfully loaded!');
      } else {
        toast.error(response.data.message || 'Patient not found');
      }
    } catch (error) {
      console.error('Error in generating data:', error);
      toast.error('Failed to fetch patient details. Please try again.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form...', formData);

    if (!formData.nic || !formData.mobileNo || !formData.title || !formData.firstName || !formData.lastName || !formData.gender || !formData.slotNumber || !formData.timeSlot || !formData.age) {
      toast.error("Please fill all details!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/appointment/create', formData);

      if (response.status === 200) {
        toast.success("Appointment submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        fetchScheduleSheets(scheduleID);

        setFormData({
          nic: '',
          mobileNo: '',
          title: '',
          firstName: '',
          lastName: '',
          gender: '',
          slotNumber: '',
          timeSlot: '',
          age: ''
        });

        navigate('/success', {
          state: { scheduleID: formData.scheduleID ,slotNumber: formData.slotNumber, timeSlot: formData.timeSlot },
        });

        console.log('Registered successfully:', response.data);
      } else if (response.status === 300) {
        toast.error("Your Appointment is already submitted");
      } else {
        toast.error("Something went wrong!");
      }

    } catch (error) {
      console.error('Data Passing error', error);
      toast.error("Please try again later!");
    }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form...', regFormData);

    if (!regFormData.nic || !regFormData.mobileNo || !regFormData.firstName || !regFormData.lastName || !regFormData.gender || !regFormData.slotNumber || !regFormData.timeSlot || !regFormData.age) {
      toast.error("Please fill all details!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/appointment/create', regFormData);

      if (response.status === 200) {
        toast.success("Appointment submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        fetchScheduleSheets(scheduleID);

        setRegFormData({
          nic: '',
          mobileNo: '',
          title: '',
          firstName: '',
          lastName: '',
          gender: '',
          slotNumber: '',
          timeSlot: '',
          age: ''
        });

        navigate('/success', {
          state: { scheduleID: regFormData.scheduleID ,slotNumber: regFormData.slotNumber, timeSlot: regFormData.timeSlot },
        });

        console.log('Registered successfully:', response.data);
      } else if (response.status === 300) {
        toast.error("Your Appointment is already submitted");
      } else {
        toast.error("Something went wrong!");
      }

    } catch (error) {
      console.error('Data Passing error', error);
      toast.error("Please try again later!");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form... My name', formData);

    if (!formData.nic || !formData.mobileNo || !formData.title || !formData.firstName || !formData.lastName || !formData.gender || !formData.slotNumber || !formData.timeSlot || !formData.age || !formData.dateOfBirth || !formData.email || !formData.password || !formData.address || !formData.username) {
      toast.error("Please fill all details!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/appointment/submitRegister', formData);

      if (response.status === 200) {
        toast.success("Appointment submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        fetchScheduleSheets(scheduleID);

        setFormData({
          nic: '',
          mobileNo: '',
          title: '',
          firstName: '',
          lastName: '',
          gender: '',
          slotNumber: '',
          timeSlot: '',
          age: '',
          password: '',
          email: '',
          address: '',
          dateOfBirth: '',
          username: ''
        });

        navigate('/success', {
          state: { scheduleID: formData.scheduleID ,slotNumber: formData.slotNumber, timeSlot: formData.timeSlot },
        });

        console.log('Submitted and registered successfully:', response.data);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error('Data Passing error', error);
      toast.error("Please try again later!");
    }
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob); // Convert string to Date object
    const today = new Date(); // Current date

    let age = today.getFullYear() - birthDate.getFullYear(); // Calculate year difference

    // Adjust age if the birthday hasn't occurred yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <Toaster />
      <Header />
      <div className="flex-1 min-h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}>

        <main className="mx-auto px-4 py-8">

          <h1 className="text-2xl sm:text-3xl md:text-[40px] text-center font-[Montserrat] text-[#161D6F] mb-6 md:mb-10 mt-4 md:mt-5">
            Making Health Care Better Together
          </h1>

          {/* Mobile Form Selection */}
          <div className="md:hidden flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${activeForm === 'unregistered' ? 'bg-[#161D6F] text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveForm('unregistered')}
            >
              Unregistered
            </button>
            <button
              className={`px-4 py-2 rounded ${activeForm === 'registered' ? 'bg-[#161D6F] text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveForm('registered')}
            >
              Registered
            </button>
          </div>

          {/* Forms Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-12 lg:gap-28 max-w-[1200px] mx-auto overflow-x-auto  ">

            {/* --------------------------- Unregistered Patients Form ----------------------------------- */}

            {(activeForm === 'unregistered' || window.innerWidth >= 768) && (
              <div className="bg-white min-w-[350px] rounded-[2px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-cover bg-center"
                style={{ backgroundImage: `url(${Formbg})` }}>
                {/* Form Header */}
                <div className="text-center -mt-22 p-4 border-b-2 border-[#161D6F]">
                  <h1 className="text-[30px] font-[Calibri] text-[#161D6F]">FOR UNREGISTERED PATIENTS</h1>
                  <p className="text-[#161D6F] font-bold text-[15px] font-[FMEmanee] mt-1">ලියාපදිංචි නොවූ රෝගීන් සදහා</p>
                  <h2 className="text-[25px] font-[Calibri] mt-15">Doctor Appointment Request Form</h2>
                  <p className="text-[16px] font-[Calibri] text-black font-medium mt-15">
                    Fill the form below and we will get back soon to you for<br />
                    more updates and plan your appointment.
                  </p>
                </div>


                {/* Sinhala Instructions */}
                <div className="bg-blue-50 p-4 ">
                  <p className="w-full text-[#010003] font-[FMEmanee] text-center font-semibold whitespace-normal text-[11.3px]">
                    ඔබට ලියාපදිංචි නොවී <span className=" text-[15px] font-[Calibri] font-medium text-[#7C0AFF]">Appointment</span> එකක් වෙන් කරගැනීමට අවශ්‍යනම් මෙම පෝරමය පුරවා <span className="text-[15px] font-[Calibri] font-medium text-[#FF0000]">Submit Button</span> එක ඔබන්න. ඔබ අප වෙත අලුතෙන් හෝගී ලියාපදිංචි වීමටත් දැනටමත් ලියාපදිංචි නොවී ආසාදනයක්, මෙම අතර සිදුව ඇත්නම් පුරවා <span className="text-[15px] font-[Calibri] font-medium text-[#FF0000]">Submit & Register Button</span> එක ඔබන්න.
                  </p>
                </div>

                {/* Form Content */}
                <div className=" p-6">
                  <div className="space-y-4 z-0">
                    {/* Patient Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-1 -mt-4 font-[Calibri] text-[20px] text-[#010003] ">
                          NIC Number
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">(හැදුනුම්පත් අංකය.)</span>
                        </label>
                        <input
                          type="text"
                          name="nic"
                          value={formData.nic}
                          onChange={handleChange}
                          className="border-[0.5px] w-full sm:w-[208px] rounded-[2px] p-1"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 mt-5 sm:-mt-4 font-[Calibri] text-[20px]">
                          Patient Mobile No:
                          <span className="block text-[12px] text-[#010003] font-[FMEmanee] font-semibold">(දුරකථන අංකය)</span>
                        </label>
                        <input
                          type="tel"
                          name="mobileNo"
                          placeholder="(000) 000-0000"
                          value={formData.mobileNo}
                          onChange={handleChange}
                          className="border-[0.5px] w-full sm:w-[208px] rounded-[2px] p-1"
                        />
                      </div>

                      {/* Name Fields */}
                      <div className="col-span-2">
                        <label className="block mb-1 -mt-4 font-[Calibri]  text-[20px]">
                          Name
                          <span className="block text-[12px] text-[#010003] font-[FMEmanee] font-semibold">(නම, මුල් නම සහ අග නම විස්තරය් ඇතුලත් කරන්න.)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <select name='title' id='title' value={formData.title} onChange={handleChange} className="w-full border-[0.5px] sm:w-[208px] h-[35px] rounded-[2px] p-1">
                              <option value="" disabled>Select Option</option>
                              <option value="Mr">Mr.</option>
                              <option value="Mrs">Mrs.</option>
                              <option value="Mast">Mast.</option>
                              <option value="Miss">Miss.</option>
                              <option value="Dr">Dr.</option>
                              <option value="Prof">Prof.</option>
                              <option value="Rev">Rev.</option>
                              <option value="Baby">Baby.</option>
                              <option value="Sis">Sis.</option>
                              <option value="Ms">Ms.</option>
                              <option value="Hon">Hon.</option>
                              <option value="Rev. Sr">Rev. Sr.</option>
                              <option value="Ven">Ven.</option>
                              <option value="Rev. Fr">Rev. Fr.</option>
                            </select>
                            <input
                              type="text"
                              name='firstName'
                              id='firstName'
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="First Name"
                              className="border-[0.5px] w-full sm:w-[208px] sm:h-9 mt-2 rounded-[2px] p-1"
                            />
                          </div>
                          <input
                            type="text"
                            name='lastName'
                            id='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="border-[0.5px] w-full sm:w-[208px] sm:h-9 mt-10 rounded-[2px] p-1"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block mb-1 -mt-3 text-[20px] font-[Calibri] ">
                          Gender
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">(ස්ත්‍රී / පුරුෂ භාවය.)</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="border-[0.5px] w-[145px] sm:w-[208px] rounded-[2px] p-1 "
                        >
                          <option value="">Please Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="none">Not willing to Disclose</option>
                        </select>
                      </div>

                      {/* Ongoing Number */}
                      <div className="w-full">
                        <div className="relative">
                          <div className="relative mt-6 sm:mt-3 flex items-start gap-4">
                            <div className="relative left-28 sm:left-20  transform -translate-x-1/2">
                              <label className="absolute -ml-2 sm:-ml-9 w-[140px] h-[24px] font-[Calibri] font-normal text-[20px] -mt-1 ">Ongoing Number
                                {/* <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">Select automatically - Yes <br />Select manually - No</span> */}
                              </label>
                              <div className="flex gap-3 sm:gap-4 mt-4 ml-4 sm:-ml-6">
                                <label className="items-center mt-6 font-[Calibri] text-[16px]">
                                  <input
                                    type="radio"
                                    name="ongoing"
                                    value="yes"
                                    className="mr-2"
                                    onChange={handleYesSelection}
                                  />
                                  Yes
                                </label>
                                <label className="flex items-center mt-6 font-[Calibri] text-[16px]">
                                  <input
                                    type="radio"
                                    name="ongoing"
                                    value="no"
                                    className="mr-2 w-[15px] h-[15px] bg-[#D9D9D9] border border-black rounded-full"
                                    onChange={handleNoSelection}
                                  />
                                  No
                                </label>
                              </div>
                            </div>
                          </div>

                          {showUnregisteredTable && (
                            <div ref={tableRef} className="absolute w-[280px] sm:w-[328px] mx-auto -ml-16 sm:-ml-8 z-50">
                              <div className="bg-gradient-to-b from-[#ffffff] to-[#FFFFFF] p-0 drop-shadow-[-6px_6px_4px_rgba(0,0,0,0.25)]">
                                {Array.isArray(scheduleSheet) && scheduleSheet.length > 0 ? (
                                  <table className="w-full border-collapse text-xs">
                                    <thead>
                                      <tr className="border-b border-gray-900">
                                        <th className="py-1 px-1 text-center font-medium text-[#ffffff] border-r border-black w-1/5 bg-fontDark">Sheets No:</th>
                                        <th className="py-1 px-1 text-center font-medium text-[#ffffff] border-r border-black w-1/3 bg-fontDark">Time Slot</th>
                                        <th className="py-1 px-1 text-center font-medium text-[#ffffff] border-r border-black w-1/5 bg-fontDark">Availability</th>
                                        <th className="w-3/5 pl-2 bg-fontDark">
                                          <div className="text-[12px] text-[#ffffff] font-light text-left bg-fontDark">
                                            දැනට පවතින වේලාවන්‌ අනුව ඔබ කැමති අංකයකට ටික් කරන්න.
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {scheduleSheet.map((sheets, index) => (
                                        <tr key={index} className={index !== scheduleSheet.length - 1 ? "border-none" : ""}>
                                          <td className="py-1 px-2 text-xs border-r border-gray-900 text-center w-1/5">{sheets.slotNumber}</td>
                                          <td className="py-1 px-2 text-xs border-r border-gray-900 text-center w-1/5">{sheets.timeSlot}</td>
                                          <td className="py-1 px-2 text-xs border-r border-gray-900 text-center w-1/5">{sheets.status}</td>
                                          <td className="py-1 px-2">
                                            <div className="flex justify-center">
                                              <div className="h-4 border border-black rounded-sm flex items-center justify-center w-4">
                                                <button
                                                  className={`h-4 border rounded-sm px-2 ${selectedSheet === sheets.slotNumber
                                                    ? "bg-blue text-white"
                                                    : sheets.status === "available"
                                                      ? "bg-green text-white"
                                                      : "bg-red text-white opacity-60 cursor-not-allowed"
                                                    }`}
                                                  disabled={sheets.status === "booked"}
                                                  onClick={() =>
                                                    handleSheetSelection(sheets.slotNumber, sheets.timeSlot)
                                                  }
                                                >
                                                  Select
                                                </button>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p>No data available</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Age  */}
                      <div className="flex justify-between items-end">
                        <div>
                          <label className="block mb-1 text-[20px] font-[Calibri] -mt-4  "> Age
                            <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold mb-2">(වයස.)</span>
                          </label>
                          <input
                            type="text"
                            name='age'
                            id='age'
                            value={formData.age}
                            onChange={handleChange}
                            className=" -mt-9 border-[0.5px] w-[104px] rounded-[2px] p-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <button
                        className="bg-[#97CE4F] sm:-mt-12 text-[19px] font-[Calibri] font-medium text-black px-4 py-1.5 rounded hover:bg-[#87b43f] transition-colors "
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>


                    <div className="-ml-4 -mr-4 leading-[16px] tracking-[0.7px] ">
                      <p className="w-full font-[FMEmanee] text-[10px] text-black font-extrabold text-left whitespace-normal">
                        ඔබ අපගේ රෝගී දත්ත ගබඩාව වෙත තමාගෙ වෛද්‍ය වාඊතා <span className="text-[13px] font-[Calibri] font-normal "> (Medical Report) </span> ඵකතු කර ජාල ගත කිරීමට කැමති නම්‌ පමණක්‌
                        <span className="text-[13px] font-[Calibri] font-normal "> NIC or Date of Birth </span>
                        එකතු කරන්න මෙවිට ඔබගේ සියලු වෛද්‍ය වාර්තා චායාරූප ආකාරයට ඔබට යොමු කර ගත හැකි අතර එම තොරතුරු වෛද්‍යවරයා වෙත<span className="text-[13px] font-[Calibri] font-normal "> Online </span>ආකාරයට පෙන්විය හැකිය.
                      </p>
                    </div>


                    {/* NIC */}
                    <div className="grid grid-cols-2 gap-5">
                      <div >
                        <label className="block mb-1 text-[20px] font-[Calibri] -mt-1 ">
                          User Name
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">(පරිශීලක නාමය.)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type='text'
                            name='username'
                            id='username'
                            value={formData.username}
                            onChange={handleChange}
                            className=" relative mt-[18px] sm:mt-0 w-[145px] sm:w-[208px] h-[34px]  border-[0.5px] rounded-[2px] p-2 "
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div >
                        <label className="block mb-1 text-[20px] font-[Calibri] -mt-1 ">
                          Date of Birth
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">(උපන් දිනය.)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type='date'
                            name='dateOfBirth'
                            id='dateOfBirth'
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="relative mt-[18px] sm:mt-0 w-[145px] sm:w-[208px] h-[34px]  border-[0.5px] rounded-[2px] p-2 "
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-[20px] font-[Calibri] -mt-1 ">
                          Email Address
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">(විද්යුත් තැපෑල.)</span>
                        </label>
                        <input
                          type="text"
                          placeholder='example@gmail.com'
                          name="email"
                          id='email'
                          value={formData.email}
                          onChange={handleChange}
                          className="border-[0.5px] w-[145px] sm:w-[208px] rounded-[2px] p-1 "
                        />
                      </div>

                      {/* Date of Birth */}
                      <div >
                        <label className="block mb-1 text-[20px] font-[Calibri] -mt-1 ">
                          Password
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">(රහස් මුරපදය.)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type='password'
                            name='password'
                            id='password'
                            value={formData.password}
                            onChange={handleChange}
                            className="relative mt-[18px] sm:mt-0 w-[145px] sm:w-[208px] h-[34px]  border-[0.5px] rounded-[2px] p-2 "
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-[20px] font-[Calibri] -mt-1 ">
                          Home Address
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">(නිවසෙහි ලිපිනය.)</span>
                        </label>
                        <textarea
                          name='address'
                          id='address'
                          className='w-[145px] sm:w-[208px] rounded-[2px] p-1 border-[0.5px]'
                          onChange={handleChange}>
                        </textarea>
                      </div>
                    </div>


                    {/* Submit Buttons */}
                    <div className="flex flex-col items-center gap-4">
                      <button
                        type="submit"
                        // onClick={() => setIsRegistered(true)}
                        onClick={handleRegisterSubmit}
                        className="bg-[#97CE4F] text-[19px] font-[Calibri] font-medium text-black px-3 py-2 rounded hover:bg-[#87b43f] transition-colors mt-2 "
                      >
                        Submit & Register
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}


            {/* -------------------------- Registered Patients Form --------------------------------- */}

            {(activeForm === 'registered' || window.innerWidth >= 768) && (
              <div className="bg-white min-w-[350px] rounded-[2px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-cover bg-center h-auto sm:h-[820px] "
                style={{ backgroundImage: `url(${Formbg})` }}>
                {/* Form Header */}
                <div className="text-center -mt-22 p-4 border-b-2 border-[#161D6F]">
                  <h1 className="text-[30px] font-[Calibri] text-[#161D6F]">FOR ALREADY REGISTERED PATIENTS</h1>
                  <p className="text-[#161D6F] font-bold text-[15px] font-[FMEmanee] mt-1">දැනටමත් ලියාපදිංචි වූ අයවී රෝගීන් සදහා</p>
                  <h2 className="text-[25px] font-[Calibri] mt-15">Doctor Appointment Request Form</h2>
                  <p className="text-[16px] font-[Calibri] text-black font-medium mt-15">
                    Fill the form below and we will get back soon to you for<br />
                    more updates and plan your appointment.
                  </p>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Patient Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block mb-1 font-[Calibri] text-lg sm:text-[20px] text-[#010003]">
                          Patient ID
                          <span className="block text-[12px] text-[#000000] font-[FMEmanee] font-semibold">
                            (රෝගී හැදුනුම්පත් අංකය.)
                          </span>
                        </label>
                        <input
                          type="text"
                          id='patientID'
                          name='patientID'
                          value={patientFormData.patientID}
                          onChange={generateHandleChange}
                          className="border-[0.5px] w-full sm:w-[208px] rounded-[2px] p-1"
                        />
                      </div>

                      <div>
                        <label className="block mt-[5px] font-[Calibri] text-lg sm:text-[20px]">
                          Patient NIC No:
                          <span className="block text-[12px] text-[#010003] font-[FMEmanee] font-semibold">
                            (ජාතික හැදුනුම්පත් අංකය)
                          </span>
                        </label>
                        <input
                          type="tel"
                          id='mobileNo'
                          name='mobileNo'
                          onChange={generateHandleChange}
                          value={patientFormData.mobileNo}
                          className="border-[0.5px] w-full sm:w-[208px] rounded-[2px] p-1"
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="w-full text-[#010003] font-[FMEmanee] text-center font-semibold text-[11px] sm:text-[11.3px] px-2">
                      <p>
                        ඔබ අප වෙබ් අඩවියේ රෝගී ලියාපදිංචියේ දැනටමත්‌ ලියාපදිංචි වී ඇත්නමි,
                        <span className="font-semibold text-[#7C0AFF]"> රෝගී හැඳුනුම්පත්‌ අංකය</span> සහ <span className="font-semibold text-[#7C0AFF]"> රෝගී අංකය </span>
                        යොදා <span className="text-[15px] font-[Calibri] font-medium text-[#FF0000]">Generate</span> බොත්තම ඔබන්න, එවිට නම,වයස
                        ආදිය <span className="text-[15px] font-[Calibri] font-medium text-[#FF0000]">Generate</span> වේ. එම තොරතුරැ නිවැරැදි නම්
                        <span className="text-[15px] font-[Calibri] font-medium text-[#7C0AFF]"> Submit Button </span> එක යෙදීමෙන්‌ හමුවීම තහවුරු කර ගන්න.
                      </p>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <button
                        type="button"
                        onClick={handleGenerate}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7A29C6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C0AFF'}
                        className="px-3 py-1 font-[Calibri] text-lg sm:text-[20px] rounded transition-colors"
                        style={{ backgroundColor: '#7C0AFF', color: '#FFFFFF' }}
                      >
                        Generate
                      </button>
                    </div>

                    {/* Name Section */}
                    <div>
                      <label className="block mb-1 font-[Calibri] text-lg sm:text-[20px]">Name</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                          name="title"
                          id='title'
                          value={regFormData.title}
                          onChange={registerHandleChange}
                          className="font-[Calibri] text-[15px] border-[0.5px] w-full sm:w-[208px] h-[35px] rounded-[2px] p-1"
                          required
                        >
                          <option>Mr.</option>
                          <option>Mrs.</option>
                          <option>Mast.</option>
                          <option>Miss.</option>
                          <option>Dr.</option>
                          <option>Dr (Ms).</option>
                          <option>Dr (Mrs).</option>
                          <option>Prof.</option>
                          <option>Prof (Ms).</option>
                          <option>Prof (Mrs).</option>
                          <option>Rev.</option>
                          <option>Baby.</option>
                          <option>Sis.</option>
                          <option>Ms.</option>
                          <option>Hon.</option>
                          <option>Rev. Sr.</option>
                          <option>Ven.</option>
                          <option>Rev. Fr.</option>
                        </select>
                        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            name="firstName"
                            id="firstName"
                            placeholder="First Name"
                            value={regFormData.firstName}
                            onChange={registerHandleChange}
                            readOnly
                            className="border-[0.5px] w-full sm:w-[208px] h-[35px] rounded-[2px] p-1 text-[15px] opacity-60"
                          />
                          <input
                            name="lastName"
                            id='lastName'
                            placeholder="Last Name"
                            value={regFormData.lastName}
                            onChange={registerHandleChange}
                            readOnly
                            className="border-[0.5px] w-full sm:w-[208px] h-[35px] rounded-[2px] p-1 text-[15px] opacity-60"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block mb-1 text-lg sm:text-[20px] font-[Calibri]">Gender</label>
                        <select
                          name="gender"
                          id='gender'
                          value={regFormData.gender}
                          readOnly
                          className="border-[0.5px] w-full sm:w-[208px] h-[35px] rounded-[2px] p-1 opacity-60"
                        >
                          <option value="">Please Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="none">Not willing to Disclose</option>
                        </select>
                      </div>

                      {/* Ongoing Number */}
                      <div className="w-full">
                        <div className="relative">
                          <label className="block text-lg sm:text-[20px] font-[Calibri] mb-2">Ongoing Number</label>
                          <div className="flex gap-4 sm:ml-3">
                            <label className="flex items-center font-[Calibri] text-[16px]">
                              <input
                                type="radio"
                                name="ongoing"
                                value="yes"
                                className="mr-2"
                                defaultChecked
                                onChange={RegisterHandleYesSelection}
                              />
                              Yes
                            </label>
                            <label className="flex items-center font-[Calibri] text-[16px]">
                              <input
                                type="radio"
                                name="ongoing"
                                value="no"
                                className="mr-2"
                                onChange={RegisterHandleNoSelection}
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table (when shown) */}
                    {showRegisteredTable && (
                      <div ref={tableRef} className="absolute w-[280px] sm:w-[328px] mx-auto -ml-16 sm:-ml-8 z-50">
                        <div className="bg-gradient-to-b from-[#ffffff] to-[#FFFFFF] p-0 drop-shadow-[-6px_6px_4px_rgba(0,0,0,0.25)]">
                          {Array.isArray(scheduleSheet) && scheduleSheet.length > 0 ? (
                            <table className="w-full border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-gray-900">
                                  <th className="py-1 px-1 text-center font-medium text-[#ffffff] border-r border-black w-1/5 bg-fontDark">Sheets No:</th>
                                  <th className="py-1 px-1 text-center font-medium text-[#ffffff] border-r border-black w-1/3 bg-fontDark">Time Slot</th>
                                  <th className="py-1 px-1 text-center font-medium text-[#ffffff] border-r border-black w-1/5 bg-fontDark">Availability</th>
                                  <th className="w-3/5 pl-2 bg-fontDark">
                                    <div className="text-[12px] text-[#ffffff] font-light text-left bg-fontDark">
                                      දැනට පවතින වේලාවන්‌ අනුව ඔබ කැමති අංකයකට ටික් කරන්න.
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {scheduleSheet.map((sheets, index) => (
                                  <tr key={index} className={index !== scheduleSheet.length - 1 ? "border-none" : ""}>
                                    <td className="py-1 px-2 text-xs border-r border-gray-900 text-center w-1/5">{sheets.slotNumber}</td>
                                    <td className="py-1 px-2 text-xs border-r border-gray-900 text-center w-1/5">{sheets.timeSlot}</td>
                                    <td className="py-1 px-2 text-xs border-r border-gray-900 text-center w-1/5">{sheets.status}</td>
                                    <td className="py-1 px-2">
                                      <div className="flex justify-center">
                                        <div className="h-4 border border-black rounded-sm flex items-center justify-center w-4">
                                          <button
                                            className={`h-4 border rounded-sm px-2 ${selectedSheet === sheets.slotNumber
                                              ? "bg-blue text-white"
                                              : sheets.status === "available"
                                                ? "bg-green text-white"
                                                : "bg-red text-white opacity-60 cursor-not-allowed"
                                              }`}
                                            disabled={sheets.status === "booked"}
                                            onClick={() =>
                                              RegisterHandleSheetSelection(sheets.slotNumber, sheets.timeSlot)
                                            }
                                          >
                                            Select
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p>No data available</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Age and Submit Button */}
                    <div className="relative flex-col sm:flex-row justify-between items-center gap-4">
                      <div>
                        <label className="block mb-1 text-lg sm:text-[20px] font-[Calibri]">Age</label>
                        <input
                          type="text"
                          id='age'
                          name='age'
                          value={regFormData.age}
                          onChange={registerHandleChange}
                          readOnly
                          className="border-[0.5px] w-[104px] rounded-[2px] p-1 opacity-60"
                        />
                      </div>
                      <div className="relative flex-col items-center text-center">
                        <button
                          type="submit"
                          onClick={handleGenerateSubmit}
                          className="bg-[#97CE4F] -mt-3 text-[19px] font-[Calibri] font-medium text-black px-3 py-1.5 rounded hover:bg-[#87b43f] transition-colors "
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
      < Footer />
    </div>
  );
};

export default Bookingform;