import React, { useState } from "react";
import userIcon from "../../img/user.png";
import birthdayIcon from "../../img/birthday.png";
import phoneIcon from "../../img/phone.png";
import addressIcon from "../../img/address.png";
import bloodIcon from "../../img/blood.png";
import { AiFillCaretDown } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../CSS/Calander.css";

const ProfileSettings = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    gender: "Female",
    birthday: "1993-02-10",
    phoneNumber: "(+94) 77 123 4567",
    address: "Kottawa, Colombo 03",
    bloodGroup: "B+",
  });

  const [newProfileDetails, setNewProfileDetails] = useState({ ...profileDetails });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setNewProfileDetails((prevDetails) => ({
      ...prevDetails,
      birthday: date.toISOString().split("T")[0],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfileDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    setProfileDetails(newProfileDetails);
    setIsEditModalOpen(false);
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="mt-0">
      {/* Header Section */}
      <div className="flex justify-between items-center px-4 mt-0 bg-100">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-[#161D6F] text-white rounded flex items-center"
        >
          <i className="fas fa-chevron-left text-white text-lg mr-2"></i>
          Back
        </button>

        {/* calendar search */}
        <div className="relative">
          <button  onClick={() => setIsCalendarVisible(!isCalendarVisible)} className="bg-white min-w-28 h-12 text-black rounded border border-gray-300 font-medium flex justify-between items-center px-3 hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
            <span>{selectedDate ? selectedDate.toLocaleDateString() : "DATE"}</span><AiFillCaretDown className="text-xl" />
          </button>
          {isCalendarVisible && (
          <div className="absolute top-14 md:right-0 xsm:left-0 z-50">
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

      {/* Profile Section */}
      <div className="border-t-2 mt-3">
        <div className="w-full max-w-4xl rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 mt-10 mb-4">
            Complete Your Profile
          </h3>
          <span
        className="text-gray-500 ml-auto "
        style={{ marginLeft: "51%" }}
          >
        86%
      </span>
          <div className="w-1/2 bg-gray-200 rounded-full h-2.5 mt-2 ml-10">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "86%", backgroundColor: "#161D6F" }}
            >
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <main className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-10">
            Profile Details
          </h3>
          <div className="ml-10 space-y-4">
            {[{ icon: userIcon, label: "Gender", value: profileDetails.gender },
              { icon: birthdayIcon, label: "Birthday", value: profileDetails.birthday },
              { icon: phoneIcon, label: "Phone Number", value: profileDetails.phoneNumber },
              { icon: addressIcon, label: "Address", value: profileDetails.address },
              { icon: bloodIcon, label: "Blood Group", value: profileDetails.bloodGroup }].map(
                ({ icon, label, value }) => (
                  <div key={label} className="flex items-center">
                    <img src={icon} alt={label} className="w-6 h-6 mr-3" />
                    <label className="text-black text-base w-40">{label}</label>
                    <p className="text-gray-600">{value}</p>
                  </div>
                )
              )}
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-10 ml-10 bg-[#161D6F] w-auto px-4 py-2 text-white rounded font-medium hover:bg-blue-600 transition"
          >
            Edit
          </button>
        </main>
      </div>

      {/* Privacy Settings Section */}
      <div className="mt-20">
        <h4 className="text-lg font-bold text-gray-800 mb-10">Privacy Settings</h4>
        <div className="ml-10 space-y-4">
          {[{ label: "Email", value: "Rasikadissanayaka@mail.com" },
            { label: "Password", value: "••••••••" }].map(({ label, value }) => (
              <div key={label} className="flex items-center">
                <label className="text-black text-base w-40">{label}</label>
                <p className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 w-1/4 text-gray-600">
                  {value}
                </p>
              </div>
            ))}
        </div>
      </div>
    
      <div className="mt-10 ml-10">
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="bg-[#161D6F] px-4 py-2 text-white rounded font-medium hover:bg-blue-600 transition"
        >
          Change Password
        </button>
      </div>

      {/* Profile Details Edit popup */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-1/3 p-6 relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-2 right-4 text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <div className=" border-b border-black border-dashed mb-5">
            <h3 className="text-xl font-bold mb-4">Edit Profile Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
              <label className="w-40 text-[#161D6F]">Gender</label>
                <select
                  name="gender"
                  value={profileDetails.gender}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[#161D6F]  mb-1">Birthday</label>
                <DatePicker
                  selected={new Date(newProfileDetails.birthday)}
                  onChange={(date) =>
                    setNewProfileDetails((prevDetails) => ({
                      ...prevDetails,
                      birthday: date.toISOString().split("T")[0],
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[#161D6F] mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={newProfileDetails.phoneNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[#161D6F] mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newProfileDetails.address}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                  placeholder="Enter address"
                />
              </div>
              <div className="flex flex-col">
              <label className="w-40 text-[#161D6F]">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={profileDetails.bloodGroup}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full  "
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6" >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-[#161D6F] text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password popup */}
        {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-1/3 p-6 relative">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-2 right-4 text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
          <div className=" border-b border-black border-dashed mb-5">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            </div>
            <div className="space-y-4">

                <div className="flex flex-col">
                  <label className="text-[#161D6F] mb-1">Email</label>
                  <input
                    type="email"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    placeholder="Enter your email"
                  />
                </div>
              <div className="flex flex-col">
                <label className="text-[#161D6F] mb-1">Current Password</label>
                 <div className="relative">
                <input
                  type={passwordVisibility.currentPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10" 
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500" 
                  type="button"
                >
                  {passwordVisibility.currentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[#161D6F] mb-1">New Password</label>
                <div className="relative">
                <input
                  type={passwordVisibility.newPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10" 
                  placeholder="Enter new password"
                />
                <button
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500" 
                  type="button"
                >
                  {passwordVisibility.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[#161D6F] mb-1">Confirm Password</label>
                 <div className="relative">
                <input
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10" 
                  placeholder="Enter confirm password"
                />
                <button
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500" 
                  type="button"
                >
                  {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              </div>

              <div className="flex justify-end mt-8 space-x-2">
              <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="bg-gray-300 px-4 py-2 text-gray-800 rounded"
            >
              Cancel
            </button>
              <button
              onClick={() => alert("Password changed")}
              className="bg-[#161D6F] px-4 py-2 text-white rounded"
            >
              Change Password
            </button>
            </div>
            
            </div>
          </div>
        </div>
      )}
      {/* Account Notifications  Section*/}
      <div className="mt-10 mb-2 border-b-2">
        <h4 className="text-lg font-bold text-gray-800 mb-10">Account Notifications</h4>
        <div className="ml-10 space-y-4 mb-10">
          {[{ label: "When Someone Mentions Me", id: "mentions" },
            { label: "When Someone Follows Me", id: "follows" },
            { label: "When Someone Shares My Activity", id: "shares" },
            { label: "When Someone Messages Me", id: "messages" }].map(
            ({ label, id }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  name={id}
                  className="mr-3 accent-[#161D6F]"
                />
                <label htmlFor={id} className="text-black">
                  {label}
                </label>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;