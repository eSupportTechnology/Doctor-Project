import React, { useState,useEffect } from "react";
import userIcon from "../../img/user.png";
import birthdayIcon from "../../img/birthday.png";
import phoneIcon from "../../img/phone.png";
import addressIcon from "../../img/address.png";
import { AiFillCaretDown } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../CSS/Calander.css";
import axios from "axios";
import Swal from 'sweetalert2';


const ProfileSettings = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);


  const [profileDetails, setProfileDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile details after login
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const token = localStorage.getItem("staffAuthToken"); // Retrieve token from localStorage
        const response = await axios.get("http://localhost:8081/staff/me", {
          headers: {
            Authorization:` Bearer ${token}`, // Add Authorization header
          },
        });
        setProfileDetails(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load profile details.");
        setIsLoading(false);
      }
    };
    fetchProfileDetails();
  }, []);

/*const handleSaveChanges = async () => {
  try {
      const token = localStorage.getItem("authToken");

      // Assuming profileDetails has an 'id' field (e.g., from the /me endpoint response)
      const staffId = profileDetails.id;

      // Perform the update request
      await axios.put(
          `http://localhost:8081/staff/update/${staffId}`,  // Corrected URL with template literal
          newProfileDetails,
          {
              headers: {
                  Authorization: `Bearer ${token}`, // Corrected Authorization header
              },
          }
      );

      // Update the local profile state directly after successful update
      setProfileDetails(newProfileDetails); // Update local profile with new details
      setIsEditModalOpen(false); // Close the edit modal
      
      
  } catch (err) {
      console.error("Error saving changes:", err);
      setError("Failed to save changes.");
  }
};*/

const handleSaveChanges = async () => {
  try {
    const token = localStorage.getItem("staffAuthToken");

    const staffId = profileDetails.id;
    await axios.put(
      `http://localhost:8081/staff/update/${staffId}`,
      newProfileDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      title: "Success!",
      text: "Profile updated successfully.",
      icon: "success",
      timer: 2000,
    }).then(() => {
      // Reload the page
      window.location.reload();
    });
  } catch (err) {
    console.error("Error saving changes:", err);
    setError("Failed to save changes.");
  }
};

  const [newProfileDetails, setNewProfileDetails] = useState({ ...profileDetails });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setNewProfileDetails((prevDetails) => ({
      ...prevDetails,
      birthday: date.toISOString().split("T")[0],
    }));
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setNewProfileDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

    const [passwordDetails, setPasswordDetails] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  
    const [passwordVisibility, setPasswordVisibility] = useState({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  
    //const [error, setError] = useState("");  // Error state added
    const [successMessage, setSuccessMessage] = useState("");
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPasswordDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };
  
    const togglePasswordVisibility = (field) => {
      setPasswordVisibility((prevState) => ({
        ...prevState,
        [field]: !prevState[field],
      }));
    };


    const handlePasswordChange = async () => {
      const { currentPassword, newPassword, confirmPassword } = passwordDetails;
    
      // Validate that the new password and confirm password match
      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Passwords do not match',
          text: 'Please ensure the new password and confirm password match.',
        });
        return;
      }
    
      // Validate current password and new password
      if (!currentPassword || !newPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Fields',
          text: 'Please provide both current and new password.',
        });
        return;
      }
    
      try {
        const token = localStorage.getItem("staffAuthToken");
        const response = await axios.put(`http://localhost:8081/staff/updatePassword`, {
          currentPassword,
          newPassword
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Password changed successfully!',
            text: 'You can now use your new password.',
          });
          setIsPasswordModalOpen(false); // Close the modal
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error changing password',
          text: error.response?.data?.error || 'Something went wrong.',
        });
      }
    };
    
  
  return (
    <div className="mt-0">
      {/* Header Section */}

     
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && profileDetails && (
    <div>
   
    <div className="flex items-center justify-between px-4 mt-0 bg-100">
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-[#161D6F] text-white rounded flex items-center"
      >
        <i className="mr-2 text-lg text-white fas fa-chevron-left"></i>
        Back
      </button>
      
      {/* Calendar Search */}
      <div className="relative">
        <button onClick={() => setIsCalendarVisible(!isCalendarVisible)} className="flex items-center justify-between h-12 px-3 font-medium text-black transition-all duration-200 bg-white border border-gray-300 rounded min-w-28 hover:from-blue-600 hover:to-blue-800">
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

    {/* Profile Section */}
    <div className="mt-3 border-t-2">
      <div className="w-full max-w-4xl rounded-lg">
        <h3 className="mt-10 mb-4 text-xl font-bold text-gray-800">Complete Your Profile</h3>
        <span className="ml-auto text-gray-500 " style={{ marginLeft: "51%" }}>86%</span>
        <div className="w-1/2 bg-gray-200 rounded-full h-2.5 mt-2 ml-10">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "86%", backgroundColor: "#161D6F" }}></div>
        </div>
      </div>

      {/* Profile Details */}
      <main className="mt-10">
        <h3 className="mb-10 text-xl font-bold text-gray-800">Profile Details</h3>
        <div className="ml-10 space-y-4">
          {/* Display profile details only if profileDetails is not null */}
          {profileDetails && (
  <>
            {[
              { icon: userIcon, label: "Gender", value: profileDetails.gender },
              { icon: birthdayIcon, label: "Birthday", value: new Date(profileDetails.dob).toLocaleDateString('en-GB') }, // Format Date
              { icon: phoneIcon, label: "Phone Number", value: profileDetails.contactNumber },
              { icon: addressIcon, label: "Address", value: profileDetails.address }
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center mb-3">
                    <img src={icon} alt={label} className="w-6 h-6 mr-3" />
                    <label className="w-40 text-base text-black">{label}</label>
                    <p className="text-gray-600">{value}</p>
                </div>
            ))}


          </>
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
  </div>
)}


      {/* Privacy Settings Section */}
      <div className="mt-20">
        <h4 className="mb-10 text-lg font-bold text-gray-800">Privacy Settings</h4> {profileDetails && (
        <div className="ml-10 space-y-4">
          {[{ label: "Email", value: profileDetails.email },
            { label: "Password", value: "••••••••" }].map(({ label, value }) => (
              <div key={label} className="flex items-center">
                <label className="w-24 text-base text-black xl:w-40">{label}</label>
                <p className="px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg w-[200px] xl:w-1/3">
                  {value}
                </p>
              </div>
            ))}
        </div>)}
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-1/3 p-6 bg-white rounded-lg">
      <button
        onClick={() => setIsEditModalOpen(false)}
        className="absolute text-2xl font-bold text-gray-700 top-2 right-4"
      >
        &times;
      </button>
      <div className="mb-5 border-b border-black border-dashed ">
        <h3 className="mb-4 text-xl font-bold">Edit Profile Details</h3>
      </div>
      <div className="space-y-4">
        {/* Gender Dropdown */}
        <div className="flex flex-col">
          <label className="w-40 text-[#161D6F]">Gender</label>
          <select
            name="gender"
            value={newProfileDetails.gender}
            onChange={handleInputChanges}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled selected>Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        {/* Birthday DatePicker */}
        <div className="flex flex-col">
          <label className="text-[#161D6F]  mb-1">Birthday</label>
          <input
            type="date"
            name="dob"
            value={newProfileDetails.dob}
            onChange={handleInputChanges}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

        </div>

        {/* Phone Number Input */}
        <div className="flex flex-col">
          <label className="text-[#161D6F] mb-1">Phone Number</label>
          <input
            type="text"
            name="contactNumber"
            value={newProfileDetails.contactNumber}
            onChange={handleInputChanges}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter phone number"
          />
        </div>

        {/* Address Input */}
        <div className="flex flex-col">
          <label className="text-[#161D6F] mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={newProfileDetails.address}
            onChange={handleInputChanges}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter address"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="px-4 py-2 mr-2 text-gray-800 bg-gray-300 rounded"
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-1/3 p-6 bg-white rounded-lg">
      <button
        onClick={() => setIsPasswordModalOpen(false)}
        className="absolute text-2xl font-bold text-gray-700 top-2 right-4"
      >
        &times;
      </button>
      <div className="mb-5 border-b border-black border-dashed">
        <h3 className="mb-4 text-xl font-bold">Change Password</h3>
      </div>
      <div className="space-y-4">
        {/* Current Password Input */}
        <div className="flex flex-col">
          <label className="text-[#161D6F] mb-1">Current Password</label>
          <div className="relative">
            <input
              type={passwordVisibility.currentPassword ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
              placeholder="Enter current password"
              name="currentPassword"
              value={passwordDetails.currentPassword}
              onChange={handleInputChange}
            />
            <button
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="absolute inset-y-0 flex items-center text-gray-500 right-2"
              type="button"
            >
              {passwordVisibility.currentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* New Password Input */}
        <div className="flex flex-col">
          <label className="text-[#161D6F] mb-1">New Password</label>
          <div className="relative">
            <input
              type={passwordVisibility.newPassword ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
              placeholder="Enter new password"
              name="newPassword"
              value={passwordDetails.newPassword}
              onChange={handleInputChange}
            />
            <button
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute inset-y-0 flex items-center text-gray-500 right-2"
              type="button"
            >
              {passwordVisibility.newPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Confirm New Password Input */}
        <div className="flex flex-col">
          <label className="text-[#161D6F] mb-1">Confirm New Password</label>
          <div className="relative">
            <input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
              placeholder="Enter confirm password"
              name="confirmPassword"
              value={passwordDetails.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute inset-y-0 flex items-center text-gray-500 right-2"
              type="button"
            >
              {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-8 space-x-2">
          <button
            onClick={() => setIsPasswordModalOpen(false)}
            className="px-4 py-2 text-gray-800 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordChange}
            className="bg-[#161D6F] px-4 py-2 text-white rounded"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        
         {/*{isPasswordModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-1/3 p-6 bg-white rounded-lg">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute text-2xl font-bold text-gray-700 top-2 right-4"
              >
                &times;
              </button>
            <div className="mb-5 border-b border-black border-dashed ">
              <h3 className="mb-4 text-xl font-bold">Change Password</h3>
              </div>
              <div className="space-y-4">
  
                  <div className="flex flex-col">
                    <label className="text-[#161D6F] mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter your email"
                    />
                  </div>
                <div className="flex flex-col">
                  <label className="text-[#161D6F] mb-1">Current Password</label>
                   <div className="relative">
                  <input
                    type={passwordVisibility.currentPassword ? "text" : "password"}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg" 
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    className="absolute inset-y-0 flex items-center text-gray-500 right-2" 
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg" 
                    placeholder="Enter new password"
                  />
                  <button
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute inset-y-0 flex items-center text-gray-500 right-2" 
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg" 
                    placeholder="Enter confirm password"
                  />
                  <button
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute inset-y-0 flex items-center text-gray-500 right-2" 
                    type="button"
                  >
                    {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                </div>
  
                <div className="flex justify-end mt-8 space-x-2">
                <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 text-gray-800 bg-gray-300 rounded"
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
        
      )}*/}
      {/* Account Notifications  Section*/}
      <div className="mt-10 mb-2 border-b-2">
        <h4 className="mb-10 text-lg font-bold text-gray-800">Account Notifications</h4>
        <div className="mb-10 ml-10 space-y-4">
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