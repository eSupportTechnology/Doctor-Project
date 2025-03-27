import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Bg from '../assest/images/Bg.jpg';
import Formbg from '../assest/images/bgf.jpg';


const Bookingform = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    mobileNo: '',
    title: 'Mr.',
    firstName: '',
    lastName: '',
    gender: '',
    ongoingNumber: 'no',
    age: '',
    nic: '',
    dateOfBirth: { day: '', month: '', year: '' }
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('dateOfBirth.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dateOfBirth: { ...prev.dateOfBirth, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerate = () => {
    console.log('Generating patient details...');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form...', formData);
  };
  

  return (
    <div class="min-h-screen h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${Bg})` }}>
      <Header />
      
      <main className="container mx-auto px-14 py-8">
        {/* Back Button */}
        <div className="mb-10">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center px-4 py-2 rounded transition-colors -ml-12" 
          style={{ backgroundColor: '#000080', color: '#FFFFFF' }} // Blue background and white text
        >
          <span className="mr-2">←</span> <b> Back </b>
        </button>

  
        </div>

        {/* Main Title */}
        <h1 className="text-3xl font-bold text-center text-[#000080] mb-12 -mt-14">
          Making Health Care Better Together
        </h1>

        {/* Forms Container */}
        <div className="grid md:grid-cols-2 gap-16">

          {/* --------------------------- Unregistered Patients Form ----------------------------------- */}

          <div className="bg-white rounded-lg shadow-lg bg-cover bg-center" style={{ backgroundImage: `url(${Formbg})` }}>
            {/* Form Header */}
            <div className="text-center p-4 border-b"> 
              <h1 className="text-2xl text-[#000080]">FOR UNREGISTERED PATIENTS</h1>
              <p className="text-[#000080] mt-1">ලියාපදිංචි නොවූ රෝගීන් සදහා</p>
              <h2 className="text-xl font-semibold mt-2">Doctor Appointment Request Form</h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill the form below and we will get back soon to you for<br />
                more updates and plan your appointment.
              </p>
            </div>


            {/* Sinhala Instructions */}
            <div className="bg-blue-50 p-4 text-sm">
              <p className="w-full text-center whitespace-normal">
                ඔබට ලියාපදිංචි නොවී <span className="font-medium text-[#af26d1]">Appointment</span> එකක් වෙන් කරගැනීමට අවශ්‍යනම් මෙම පෝරමය පුරවා <span className="font-medium text-[#ff0000]">Submit Button</span> එක ඔබන්න. ඔබ අප වෙත අලුතෙන් හෝගී ලියාපදිංචි වීමටත් දැනටමත් ලියාපදිංචි නොවී ආසාදනයක්, මෙම අතර සිදුව ඇත්නම් පුරවා <span className="font-medium text-[#ff0000]">Submit & Register Button</span> එක ඔබන්න.
              </p>
            </div>

            {/* Form Content */}
            <div className=" p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">
                      Patient ID
                      <span className="block text-sm text-gray-600">(රෝගී අංකය/හැදුනුම් අංකය.)</span>
                    </label>
                    <input
                      type="text"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">
                      Patient Mobile No:
                      <span className="block text-sm text-gray-600">(දුරකථන අංකය)</span>
                    </label>
                    <input
                      type="tel"
                      name="mobileNo"
                      placeholder="(000) 000-0000"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  {/* Name Fields */}
                  <div className="col-span-2">
                    <label className="block mb-1">
                      Name
                      <span className="block text-sm text-gray-600">(නම, මුල් නම සහ අග නම විස්තරය් ඇතුලත් කරන්න.)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <select className="w-full border rounded p-2 mb-2">
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
                        <input 
                          type="text" 
                          placeholder="First Name" 
                          className="w-full border rounded p-2" 
                        />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Last Name" 
                        className="w-full border rounded p-2 mt-12" 
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block mb-1">
                      Gender
                      <span className="block text-sm text-gray-600">(ස්ත්‍රී / පුරුෂ භාවය.)</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Please Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="none">Not willing to Disclose</option>
                    </select>
                  </div>

                  {/* Ongoing Number */}
                <div className="relative mt-3 ">
                  <div className="absolute left-1/3 transform -translate-x-1/2">
                    <label className="block mb-4">Ongoing Number</label>
                    <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input 
                      type="radio"
                      name="ongoing" 
                      className="mr-2" 
                      /> 
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input 
                      type="radio" 
                      name="ongoing" 
                      className="mr-2" defaultChecked 
                      />
                      No
                    </label>
                  </div>
                  </div>
                </div>

                  {/* Age  */}
                  <div>
                    <label className="block mb-1">
                      Age
                      <span className="block text-sm text-gray-600">(වයස.)</span>
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-half p-2 border border-gray-300 rounded"
                    />
                  </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 mt-10">
                  <button
                    type="submit"
                    className="bg-[#98cb4c] text-white px-8 py-2 rounded hover:bg-[#87b43f] transition-colors"
                  >
                    Submit
                  </button>
                  </div>
                  

                  <div className="bg-blue-50 p-4 text-sm">
                    <p className="w-full text-center whitespace-normal">
                      ඔබට ලියාපදිංචි නොවී <span className="text-purple-600">Appointment</span> එකක් වෙන් කරගැනීමට අවශ්‍යනම් මෙම පෝරමය පුරවා <span className="text-red-600">Submit Button</span> එක ඔබන්න. ඔබ අප වෙත අලුතෙන් හෝගී ලියාපදිංචි වීමටත් දැනටමත් ලියාපදිංචි නොවී ආසාදනයක්, මෙම අතර සිදුව ඇත්නම් පුරවා <span className="text-red-600">Submit & Register Button</span> එක ඔබන්න.
                    </p>
                  </div>


                  {/* NIC */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-1">
                        NIC
                        <span className="block text-sm text-gray-600">(ජාතික හැදුනුම්පත් අංකය.)</span>
                      </label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div >
                      <label className="block mb-1">
                        Date of Birth
                        <span className="block text-sm text-gray-600">(උපන් දිනය.)</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          placeholder="DD"
                          name="dateOfBirth.day"
                          value={formData.dateOfBirth.day}
                          onChange={handleChange}
                          className="p-2 border border-gray-300 rounded text-center"
                        />
                        <input
                          placeholder="MM"
                          name="dateOfBirth.month"
                          value={formData.dateOfBirth.month}
                          onChange={handleChange}
                          className="p-2 border border-gray-300 rounded text-center"
                        />
                        <input
                          placeholder="YY"
                          name="dateOfBirth.year"
                          value={formData.dateOfBirth.year}
                          onChange={handleChange}
                          className="p-2 border border-gray-300 rounded text-center"
                        />
                      </div>
                    </div>
                  </div>

                  
                    {/* Submit Buttons */}
                    <div className="flex flex-col items-center gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsRegistered(true)}
                      className="bg-[#98cb4c] text-white px-8 py-2 rounded hover:bg-[#87b43f] transition-colors mt-4 mb-4"
                    >
                      Submit & Register
                    </button>
                  </div>
                  
                </form>
              </div>
            </div>


          {/* -------------------------- Registered Patients Form --------------------------------- */}

          <div className="bg-white rounded-lg shadow-lg bg-cover bg-center min-h-screen flex flex-col  "  style={{ backgroundImage: `url(${Formbg})` , maxHeight: '130vh'}}>
            {/* Form Header */}
            <div className="text-center p-4 border-b">
              <h1 className="text-2xl text-[#000080]">FOR ALREADY REGISTERED PATIENTS</h1>
              <p className="text-[#000080] mt-1">දැනටමත් ලියාපදිංචි වූ අයවී රෝගීන් සදහා</p>
              <h2 className="text-xl font-semibold mt-2">Doctor Appointment Request Form</h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill the form below and we will get back soon to you for<br />
                more updates and plan your appointment.
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form className=" space-y-4">
                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">
                      Patient ID
                      <span className="block text-sm text-gray-600">(රෝගී හැදුනුම්පත් අංකය.)</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full border rounded p-2" 
                    />
                  </div>

                  <div>
                    <label className="block mb-1">
                      Patient Mobile No:
                      <span className="block text-sm text-gray-600">(දුරකථන අංකය)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(000) 000-0000"
                      className="w-full border rounded p-2" 
                    />
                  </div>
                </div>

                {/* Instructions with better spacing */}
                <div className="text-sm text-center my-6 p-4 bg-blue-50 rounded">
                  <p>
                    ඔබ අප වෙත අතීතයේදී රෝගී ලියාපදිංචියෙන් දැනටමත් ලියාපදිංචි වී ඇත්නම්,
                    <span className="font-medium text-[#af26d1]"> රෝගී හැදුනුම්පත් අංකය සහ රෝගී අංකය </span>
                    සදහා <span className="font-medium text-[#ff0000]">Generate</span> බොත්තම ඔබන්න, එවිට ඔබ,විස්තර
                    සදහා <span className="font-medium text-[#ff0000]">Generate</span> වේ. ඊට කොපසුව නිවරදී නම්
                    <span className="font-medium text-[#af26d1]"> Submit Button </span> එක ඔබන්නෙන් පසුවම තහවුරු කර ගන්න.
                  </p>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center mb-6">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7A29C6'} // Darker purple on hover
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8836e0'}
                    className="px-8 py-2 rounded transition-colors"
                    style={{ backgroundColor: '#8836e0', color: '#FFFFFF' }} // Purple background and white text
                  >
                    Generate
                  </button>
                </div>


                {/* Name Section */}
                <div>
                  <label className="block mb-1">Name</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border rounded p-2 mb-2"
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
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <input
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border rounded p-2" 
                      />
                      <input
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Please Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="none">Not willing to Disclose</option>
                    </select>
                  </div>

                    {/*  Ongoing Number */}
                  <div className="relative mt-1 ">
                    <div className="absolute left-1/3 transform -translate-x-1/2">
                      <label className="block mb-3">Ongoing Number</label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center">
                          <input 
                          type="radio" 
                          name="ongoing2" 
                          className="mr-2" 
                          /> 
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input 
                          type="radio" 
                          name="ongoing2" 
                          className="mr-2" defaultChecked 
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div> 

                {/* Age and Submit Button */}
                <div className="flex justify-between items-end">
                  <div className="w-1/3">
                    <label className="block mb-1">Age</label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mb-6 mt-4">
                  <button
                    type="button"
                    className="bg-[#98cb4c] text-white px-8 py-2 rounded hover:bg-[#87b43f] transition-colors"
                  >
                    Submit
                  </button>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Bookingform;