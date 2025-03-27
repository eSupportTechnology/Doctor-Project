import React from 'react';

//images
import PatientImg from '../../img/doctorPatientsProfile.png';

const PatientListDetails =[
  {PatientImage: "", PatientID: "12939201332134", PatientName: "Stacy Mitchell",  AppointmentTime: "9:15 AM", AppointmentDate: "30"},
  {PatientImage: "", PatientID: "12939201332135", PatientName: "Stacy Mitchell",  AppointmentTime: "9:15 AM", AppointmentDate: "30"},
  {PatientImage: "", PatientID: "12939201332136", PatientName: "Stacy Mitchell",  AppointmentTime: "9:15 AM", AppointmentDate: "30"},
  {PatientImage: "", PatientID: "12939201332137", PatientName: "Stacy Mitchell",  AppointmentTime: "9:15 AM", AppointmentDate: "30"},
  {PatientImage: "", PatientID: "12939201332138", PatientName: "Stacy Mitchell",  AppointmentTime: "9:15 AM", AppointmentDate: "30"},
  {PatientImage: "", PatientID: "12939201332139", PatientName: "Stacy Mitchell",  AppointmentTime: "9:15 AM", AppointmentDate: "30"},
  {PatientImage: "", PatientID: "12939201332140", PatientName: "Stacy Mitchell",  AppointmentTime: "9:15 AM", AppointmentDate: "30"},
];

const PatientList = () => {
  return (
    // Main container
    <div className="py-4 px-5">
       <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Patient Appointment List</h2>
          <select name="date" className="text-[#828282] text-lg">
            <option value="Today">Today</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>  
       </div>
       <div className="overflow-y-auto h-[510px] mt-1 pr-1">
       {PatientListDetails && PatientListDetails.length > 0 ? (
        PatientListDetails.map((PatientDetails) => (
          <div key={PatientDetails.PatientID} className="flex justify-between items-center w-full my-5">
            <div className="flex items-center">
              <img src={PatientDetails.PatientImage || PatientImg} alt="PatientImage" className="w-12 h-12 rounded-full mr-2"/>
              <div>
                <p className="text-lg font-medium">{PatientDetails.PatientName}</p>
                <p className="text-[14px] text-[#0000FF]">ID: {PatientDetails.PatientID}</p>
              </div>
            </div>
            <p className="text-[14px] text-center py-2 px-3 rounded-lg text-[#0000FF] bg-[#D6D6FF]">{PatientDetails.AppointmentTime}</p>
          </div>
        ))): (
          <div className="flex justify-center items-center h-full">
            <p className="text-lg text-[#828282]">No Appointments Found</p>
          </div>
        )} 
        </div>
    </div>
  );
};

export default PatientList;