import toast, { Toaster } from 'react-hot-toast';  
import React, { useState, useEffect } from "react";
import userIcon from "../../img/user.png";
import birthdayIcon from "../../img/birthday.png";
import phoneIcon from "../../img/phone.png";
import addressIcon from "../../img/address.png";
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
  const [profileDetails, setProfileDetails] = useState(null);
  const [newProfileDetails, setNewProfileDetails] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/doctor/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfileDetails(data);
          setNewProfileDetails(data);
        } else {
          toast.error(data.message || "Error fetching profile", {
            position: "top-center",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfileDetails();
  }, []);

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
  const handleSaveChanges = async () => {
    const updatedProfileDetails = {
      gender: newProfileDetails.gender || "",
      birthday: newProfileDetails.birthday || "",
      contact_number: newProfileDetails.contact_number || "",
      address: newProfileDetails.address || "",
    };
  
    try {
      const response = await fetch("http://localhost:8081/api/doctor/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfileDetails),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          duration: 3000,
        });
        setProfileDetails(updatedProfileDetails);
        setIsEditModalOpen(false); 
      } else {
        toast.error(data.message || "Error updating profile", {
          position: "top-center",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        position: "top-center",
        duration: 3000,
      });
    }
  };
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };
  const handleUpdatePrivacySettings = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("All fields are required!", { position: "top-center", duration: 3000 });
      return;
    }
  
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match!", { position: "top-center", duration: 3000 });
      return;
    }
  
    if (passwords.currentPassword === passwords.newPassword) {
      toast.error("Enter New password .", { position: "top-center", duration: 3000 });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8081/api/doctor/change-password", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwords),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Password updated successfully!", {
          position: "top-center",
          duration: 3000,
        });
        localStorage.removeItem("token");
        setIsPasswordModalOpen(false);  
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });  
      } else {
        toast.error(data.message || "Error updating password", { position: "top-center", duration: 3000 });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password", { position: "top-center", duration: 3000 });
    }
  };
  
  

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  if (!profileDetails) return <div>Loading...</div>;

  return (
    <div className="mt-0">
      <Toaster />
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
          <button onClick={() => setIsCalendarVisible(!isCalendarVisible)} className="bg-white min-w-28 h-12 text-black rounded border border-gray-300 font-medium flex justify-between items-center px-3 hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
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
          <h3 className="text-xl font-bold text-gray-800 mt-10 mb-4">Complete Your Profile</h3>
          <span className="text-gray-500 ml-auto " style={{ marginLeft: "51%" }}>86%</span>
          <div className="w-1/2 bg-gray-200 rounded-full h-2.5 mt-2 ml-10">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "86%", backgroundColor: "#161D6F" }}></div>
          </div>
        </div>

       {/* Profile Details */}
       <main className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-10">Profile Details</h3>
          <div className="ml-10 space-y-4">
            {[{ icon: userIcon, label: "Gender", value: profileDetails.gender },
              { icon: birthdayIcon, label: "Birthday", value: profileDetails.birthday },
              { icon: phoneIcon, label: "Contact Number", value: profileDetails.contact_number },
              { icon: addressIcon, label: "Address", value: profileDetails.address }].map(
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
          {[{ label: "Email", value: profileDetails.email },
            { label: "Password", value: "••••••••" }].map(({ label, value }) => (
              <div key={label} className="flex items-center">
                <label className="text-black text-base w-40">{label}</label>
                <p className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 w-1/2 text-gray-600">
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
            <div className="border-b border-black border-dashed mb-5">
              <h3 className="text-xl font-bold mb-4">Edit Profile Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="w-40 text-[#161D6F]">Gender</label>
                <select
                  name="gender"
                  value={newProfileDetails.gender}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[#161D6F] mb-1">Birthday</label>
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
                <label className="text-[#161D6F] mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contact_number"
                  value={newProfileDetails.contact_number}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                  placeholder="Enter contact number"
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
            </div>
            <div className="flex justify-end mt-6">
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
            <div className="border-b border-black border-dashed mb-5">
              <h3 className="text-xl font-bold mb-4">Change Password</h3>
            </div>
            <div className="space-y-4">
            <div className="flex flex-col">
            <label className="text-[#161D6F] mb-1">Email</label>
            <p className="border border-gray-300 rounded-lg px-3 py-2 w-full text-gray-600">
              {profileDetails.email}  {/* Display the doctor's email here */}
            </p>
          </div>

              <div className="flex flex-col">
                <label className="text-[#161D6F] mb-1">Current Password</label>
                <div className="relative">
                <input
                  type={passwordVisibility.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange} // Add this line
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
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange} // Add this line
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
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange} // Add this line
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10"
                  placeholder="Confirm new password"
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
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePrivacySettings}
                className="px-4 py-2 bg-[#161D6F] text-white rounded"
              >
                Save Changes
              </button>
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
