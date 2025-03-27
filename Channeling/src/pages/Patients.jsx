import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from "axios";
import PatientMiddleware from './PatientMiddleware';

//images
import profilebg from '../img/PatientsProfileBg.jpg';
import profile from '../img/PatientsProfile.jpeg';
import doctor from '../img/doctorIcon.png';
import card from '../img/creditCard.png';
import userIcon from "../img/user.png";


const Patients = () => {
  const createEmptyRow = () => ({
    date: "",
    fbs: "",
    ppbs: "",
    rds: "",
    weight: "",
    height: "",
    bmi: "",
    hba1c: "",
    lipidProfile: "",
    tc: "",
    tg: "",
    ldl: "",
    hdl: "",
    serumCreatinine: "",
    urea: "",
    sgpt: "",
    sgot: "",
    bp: "",
    creativeProtein: "",
  });

  const [rows, setRows] = useState(() => Array.from({ length: 10 }, () => createEmptyRow()));
  const [editingCell, setEditingCell] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const addRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const handleDoubleClick = (rowIndex, key) => {
    setEditingCell({ rowIndex, key });
    setInputValue(rows[rowIndex][key]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // const updateRowData = async (rowIndex, updatedRow) => {
  //   try {
  //     const response = await axios.post("/demo/demo", {
  //       rowIndex,
  //       updatedRow,
  //     });

  //     console.log("Row data updated successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error updating row data:", error.response?.data || error.message);
  //   }
  // };

  const handleInputBlur = async () => {
    if (editingCell) {
      const updatedRows = [...rows];
      updatedRows[editingCell.rowIndex][editingCell.key] = inputValue;

      // Update state
      // setRows(updatedRows);

      // Send updated row to the backend
      // await updateRowData(editingCell.rowIndex, updatedRows[editingCell.rowIndex]);

      setEditingCell(null);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const renderCell = (row, rowIndex, key) => {
    if (editingCell && editingCell.rowIndex === rowIndex && editingCell.key === key) {
      return (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          className="w-full h-[30px] px-1 text-left"
          placeholder="Enter value"
          autoFocus
        />
      );
    }
    return (
      <td
        className="border-2 h-[30px] border-[#D4D4D4] text-center cursor-pointer"
        onDoubleClick={() => handleDoubleClick(rowIndex, key)}
      >
        {row[key]}
      </td>
    );
  };

  const [profileDetails, setProfileDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile details after login
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const token = localStorage.getItem("patientAuthToken");

        if (!token) {
          console.error("No token found. User may not be logged in.");
          setError("No token found. Please log in again.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8081/patient/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        setProfileDetails(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setError("Failed to load profile details.");
        setIsLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "N/A"; // without date of birth display N/A
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Subtract the age, if the national date is not the same as the current date
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  return (
    <PatientMiddleware>
      <div>
        <Header />
        <div className="grid w-full h-auto grid-cols-1 mt-2 md:grid-cols-7">
          {/* Left Side */}
          <div className="col-span-1 md:col-span-2 border-2 border-[#98DED9] m-2 md:ml-3 md:mt-3">
            {/* profile */}
            {profileDetails && (
              <div className="bg-violet-50 w-full h-auto border-b-2 border-b-[#98DED9]">
                <img src={profilebg}
                  alt="profile_background" className="w-full h-[229px] object-cover " />
                <div className="pb-2">
                  <img src={profileDetails.profileImage ? `http://localhost:8081${profileDetails.profileImage}` : userIcon}
                    alt="Profile_image" className="object-cover w-32 h-32 mx-auto -mt-16 rounded-full shadow-lg" />
                  <h2 className="uppercase text-center mt-2 font-bold text-[25px] text-[#161D6F]">
                    {profileDetails.firstName} {profileDetails.lastName}
                  </h2>
                  <h4 className="uppercase text-center -mt-2 font-bold text-[20px] text-[#7465B9]">{calculateAge(profileDetails.dob)} years old</h4>
                </div>

              </div>)}

            {/* health status */}
            <div className="p-2 mt-2">
              <p className="py-3 mx-2 font-bold text-[20px] text-[#50C594] bg-[#EDF8F3] text-center rounded-3xl border-1 border-[#E7F7F0]">Healthy</p>
              <div className="flex flex-col justify-center mt-3 text-center xl:flex-row xl:gap-20">
                <p className="text-[18px] text-[#8895A8] font-bold m-0">Blood <p className="text-black text-[18px] font-medium">B +</p></p>
                <p className="text-[18px] text-[#8895A8] font-bold m-0">Height <p className="text-black text-[18px] font-medium">175cm</p></p>
                <p className="text-[18px] text-[#8895A8] font-bold m-0">Weight <p className="text-black text-[18px] font-medium">64kg</p></p>
              </div>
            </div>
            {/* Doctors */}
            <div className="m-3">
              <h1 className="text-[20px] font-bold">Doctors:</h1>
              <div className="grid grid-cols-3 gap-2 mt-4 xl:flex xl:flex-row lg:gap-2">
                <img src={doctor} alt="doctors" className="object-cover rounded-full shadow-md w-14 h-14" />
                <img src={doctor} alt="doctors" className="object-cover rounded-full shadow-md w-14 h-14" />
                <img src={doctor} alt="doctors" className="object-cover rounded-full shadow-md w-14 h-14" />
                <img src={doctor} alt="doctors" className="object-cover rounded-full shadow-md w-14 h-14" />
                <img src={doctor} alt="doctors" className="object-cover rounded-full shadow-md w-14 h-14" />
                <button className="text-gray-400">See more +</button>
              </div>
            </div>
            {/* Payments */}
            {/*<div className="m-3 mt-5">
                    <h1 className="text-[20px] font-bold">Payments:</h1>
                    <div className="my-4 grid grid-cols-[auto_1fr] items-center gap-x-2">
                      <img src={card} alt="card" className="object-cover w-16 h-12" />
                      <div>
                        <p className="text-[18px] m-0 ">Mastercard <span className="ml-2 text-center">•••• 4584</span></p>
                        <p className="text-gray-400 text-[16px] m-0">Expires <span>12/24</span></p>
                      </div>
                    </div>
                    <div className="my-4 grid grid-cols-[auto_1fr] items-center gap-x-2">
                      <img src={card} alt="card" className="object-cover w-16 h-12" />
                      <div>
                        <p className="text-[18px] m-0 ">Discover <span className="ml-2 text-center">•••• 5796</span></p>
                        <p className="text-gray-400 text-[16px] m-0">Expires <span>12/24</span></p>
                      </div>
                    </div>
                  </div>*/}
          </div>

          {/* Right Side */}
          <div className="col-span-1 md:col-span-5">

            {/* back button */}
            {/* <div className="col-span-1 ml-2">
                    <h1>back button</h1>
                  </div> */}

            {/* main part */}
            <div className="xsm:m-2 md:mt-3 xsm:border-2 xsm:border-[#C0C2C2] sm:ml-2 sm:border-t-2 sm:border-t-[#C0C2C2] sm:border-l-2 sm:border-l-[#98DED9]">
              <div className="p-2">
                <h1 className="text-[18px] font-bold mx-7 my-4">ඔබගේ දියවැඩියා තත්වය සම්බන්ධයෙන් නිරතුරුව අවධියෙන් සිටීම දියවැඩියාව නිසා හටගන්නා සංකූලතා අවම කරයි. ඒ සඳහා පහත කාල වකවානු තුලදී අදාල පරීක්ෂණ සිදුකරගැනීම අප විසින් අනුමත කරමු.</h1>
              </div>

              <div className="mt-2">
                <h1 className="font-bold text-[18px] bg-[#97CE4F] p-3 text-center w-fit border-y-2 border-r-2 border-black rounded-r-lg">සතිපතා පරීක්ෂණ</h1>
                <p className="text-[14px] font-semibold mx-7 my-4">නිවසේදී අහඹු රුධිර සීනි පරීක්ෂාව - මේ සඳහා ඔබගේ රුධිර සීනි පරීක්ෂණය භාවිතා කල හැකිය.</p>
              </div>

              <div className="mt-2">
                <h1 className="font-bold text-[18px] bg-[#97CE4F] p-3 text-center w-fit border-y-2 border-r-2 border-black rounded-r-lg">මාසික පරීක්ෂණ</h1>
                <p className="text-[14px] font-semibold mx-7 my-4">ඔබගේ FBS පරීක්ෂාව / PPBS පරීක්ෂාව හෝ RBS පරීක්ෂාව පයශීෂණාගාරයකින් කර ගත යුතුය. FBS පරීක්ෂාව පැය 08ක කාලයක් නිරාහාරව සිටිය යුතුය. නිරාහාර කාලාන්තරය තුළ වතුර වීදුරුවක් තොලගැම අනුමත කරමු.</p>
              </div>

              <div className="mt-2 mb-4">
                <h1 className="font-bold text-[18px] bg-[#97CE4F] p-3 text-center w-fit border-y-2 border-r-2 border-black rounded-r-lg">මාස 03කට වරක්</h1>
                <p className="text-[14px] font-semibold mx-7 mt-4 mb-1">HbA1c පරීක්ෂාව (මෙම පරීක්ෂාව සඳහා නිරාහාරව සිට පැමිණීම අවශ්‍ය නොවේ).</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">මුත්‍රා පරීක්ෂාව (Urea).</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">සීරම් ක්‍රියැටින් පරීක්ෂාව (Serum Creatinine).</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">පාද සත්කාරය හා අවශ්‍ය ඕනෑම පරීක්ෂාවක් සිදු කල යුතුය.</p>
              </div>

              <div className="mt-2 mb-4">
                <h1 className="font-bold text-[18px] bg-[#97CE4F] p-3 text-center w-fit border-y-2 border-r-2 border-black rounded-r-lg">මාස 03කට වරක්</h1>
                <p className="text-[14px] font-semibold mx-7 mt-4 mb-1">පුර්ණ අක්ෂි පරීක්ෂාව.</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">වකුගඩු පරීක්ෂාව.</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">සම්පූර්ණ මුත්‍රා පරීක්ෂාව.</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">X- කිරණ පරීක්ෂාව කොළොස්ට්‍රෝල් පරීක්ෂාව (මේ සඳහා පැය 12ක කාලයක් නිරාහාරව පැමිණිය යුතුය).</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">සම්පූර්ණ පාද පරීක්ෂාව.</p>
                <p className="text-[14px] font-semibold mx-7 mb-1">දන්ත පරීක්ෂාව.</p>
              </div>
              {/* Goles for Patients */}
              {/* part 01 */}
              <div className="mt-2 mb-4">
                <h1 className="font-bold text-[18px] bg-[#97CE4F] p-3 text-center m-0">ඔබ විසින් පහත ඉලක්කයන් සපුරා ගැනීම සඳහා වෙහෙස විය යුතුය.</h1>
                <div className="grid w-full h-auto grid-cols-1 p-0 m-0 md:grid-cols-5">
                  {/* Left column */}
                  <div className="col-span-2 lg:border-r-2 lg:border-r-[#98DED9] p-4">
                    <table className="text-[14px] w-full mt-3">
                      <tbody>
                        <tr>
                          <td className="py-2 font-semibold">FBS</td>
                          <td className="font-medium text-center ">-</td>
                          <td className="text-left font-medium text-[#777f86]">&nbsp;&nbsp;70 - 110 mg/dl</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold">PPBS</td>
                          <td className="font-medium text-center">-</td>
                          <td className="text-left font-medium text-[#777f86]">&nbsp;&nbsp;100 - 140 mg/dl</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold">Total Cholesterol</td>
                          <td className="font-medium text-center">-</td>
                          <td className="text-left font-medium text-[#777f86]">&nbsp;&nbsp;&lt;200 mg/dl</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold">Triglyceride</td>
                          <td className="font-medium text-center">-</td>
                          <td className="text-left font-medium text-[#777f86]">&nbsp;&nbsp;&lt;150 mg/dl</td>
                        </tr>
                        <tr>
                          <td className="flex justify-start py-2 font-semibold">HDL Cholesterol</td>
                          <td className="font-medium text-justify">-</td>
                          <td className="text-left font-medium text-[#777f86]">
                            &nbsp;&nbsp;&gt;40 mg/dl<br />
                            &nbsp;&nbsp;&gt;50 mg/dl
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold">LDL Cholesterol</td>
                          <td className="font-medium text-center">-</td>
                          <td className="text-left font-medium text-[#777f86]">&nbsp;&nbsp;&lt;80 mg/dl</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold">Blood Urea</td>
                          <td className="font-medium text-center">-</td>
                          <td className="text-left font-medium text-[#777f86]">&nbsp;&nbsp;&lt;40 mg/dl</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold">Serum Creatinine</td>
                          <td className="font-medium text-center">-</td>
                          <td className="text-left font-medium text-[#777f86]">&nbsp;&nbsp;&lt;1.2 mg/dl</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Right column */}
                  <div className="col-span-1 p-4 md:col-span-3">
                    <table className="w-full text-[14px] mt-3">
                      <tbody>
                        <tr>
                          <td className="py-2 pr-4 font-semibold text-left">HbA1c</td>
                          <td className="py-2 pr-4 text-left font-medium text-[#777f86]">&lt;5.6%</td>
                          <td className="py-2  text-left font-medium text-[#777f86]">Normal Value</td>
                          <td className="py-2 text-left font-medium text-[#777f86]">අනුමත අගය</td>
                        </tr>
                        <tr className="text-[#777f86]">
                          <td className="py-2 pr-4"></td>
                          <td className="py-2 pr-4 font-medium text-left">5.6% - 7%</td>
                          <td className="py-2 font-medium text-left">Good Control</td>
                          <td className="py-2 font-medium text-left">පාලනය හොඳයි</td>
                        </tr>
                        <tr className="text-[#777f86]">
                          <td className="py-2 pr-4"></td>
                          <td className="py-2 pr-4 font-medium text-left">7.0% - 8%</td>
                          <td className="py-2 font-medium text-left">Fair Control</td>
                          <td className="py-2 font-medium text-left">පාලනය සාමන්‍යයි</td>
                        </tr>
                        <tr className="text-[#777f86]">
                          <td className="py-2 pr-4"></td>
                          <td className="py-2 pr-4 font-medium text-left">8.0% - 10%</td>
                          <td className="py-2 font-medium text-left">Unsatisfactory Control</td>
                          <td className="py-2 font-medium text-left">පාලනය සෑහීමට පත් නොවේ</td>
                        </tr>
                        <tr className="text-[#777f86]">
                          <td className="py-2 pr-4"></td>
                          <td className="py-2 pr-4 font-medium text-left">&gt;10%</td>
                          <td className="py-2 font-medium text-left">Poor Control</td>
                          <td className="py-2 font-medium text-left">පාලනය අධිකවම අඩුයි</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <h3 className="font-bold text-[18px] bg-[#97CE4F] p-3 text-center m-0">ඉහත අගයන් ඔබගේ මඟපෙන්වීම සඳහා සකසන ලද සාමන්‍ය අගයන් ය.</h3>
              </div>
              {/* part 02 */}
              {/* <div className="mt-2 mb-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        </div>
                      </div> */}
            </div>
          </div>
          {/* Lower Side */}
          <div className="m-2 overflow-x-auto md:col-span-7 md:mx-5 md:my-3">
            <form action="" className="mb-3">
              {/* Patient Details Table */}
              <table className="text-[14px] border-[3px] border-black w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-2 border-[#D4D4D4] text-centerp-4 font-semibold" rowSpan="2">දිනය <span className="font-medium text-gray-500">(Date)</span></th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">FBS</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">PPBS</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">RDS</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">බර <span className="font-medium text-gray-500">(Kg)</span></th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">උස <span className="font-medium text-gray-500">(Cm)</span></th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">BMI</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">HbA1c</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">Lipid Profile</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" colSpan="4">Urine Micro Albumin</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">Serum Creatinine</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">Urea</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">SGPT</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">SGOT</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">BP</th>
                    <th className="border-2 border-[#D4D4D4] text-center p-4 font-semibold" rowSpan="2">Creative Protien</th>

                  </tr>
                  <tr>
                    <th className="p-0 font-semibold border-2 border-[#D4D4D4]">TC</th>
                    <th className="p-0 font-semibold border-2 border-[#D4D4D4]">TG</th>
                    <th className="p-0 font-semibold border-2 border-[#D4D4D4]">LDL</th>
                    <th className="p-0 font-semibold border-2 border-[#D4D4D4]">HDL</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(row).map((key) => renderCell(row, rowIndex, key))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-2 text-center" colSpan="23">
                      <button
                        type="button"
                        onClick={addRow}
                        className="text-[#FF0000] font-semibold text-2xl"
                      >
                        ADD ROW +
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>


        <Footer />

      </div></PatientMiddleware>
  );
};

export default Patients;