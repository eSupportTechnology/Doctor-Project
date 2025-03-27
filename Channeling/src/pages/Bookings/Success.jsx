import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import doctorImage from '../../img/doctor.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Logo from '../../assest/images/37a39cb7092d94d7297953ad09f2dee5.png';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DoctorLogin = () => {
    const location = useLocation();
    const [details, setDetails] = useState({});
    const { scheduleID, slotNumber, timeSlot } = location.state || {};

    const fetchDetails = async (scheduleID) => {
        try {
            const response = await axios.get(`http://localhost:8081/schedule/doctors?scheduleID=${scheduleID}`);
            const doctorData = response.data[0]?.[0];
            setDetails(doctorData);
        } catch (error) {
            console.error('Error in getting data!', error);
            toast.error('Failed to fetch doctor details!');
        }
    };

    const downloadReceipt = async () => {
        // Create a container for the receipt
        const receiptContainer = document.createElement("div");
        receiptContainer.style.position = "absolute";
        receiptContainer.style.top = "-9999px"; // Hide the container off-screen
    
        receiptContainer.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px; max-width: 600px; margin: auto;">
                <!-- Header Section with Logo -->
                <div style="width: 100%, display:flex, justify-content:center, align-items:center ,text-align: center; margin-bottom: 20px;">
                    <img src="${Logo}" alt="Logo" style="width: 100px; margin-bottom: 10px;">
                    <h2 style="color: #444;">Appointment Receipt</h2>
                </div>
    
                <!-- Appointment Details -->
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                    <h3 style="margin: 0; font-size: 18px; color: #333;">Doctor Details</h3>
                    <p style="margin: 5px 0;">Doctor Name: <strong>${details?.fullName || 'N/A'}</strong></p>
                    <p style="margin: 5px 0;">Appointment Date: <strong>${new Date(details?.date).toLocaleDateString('en-GB') || 'N/A'}</strong></p>
                </div>
    
                <!-- Patient Details -->
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                    <h3 style="margin: 0; font-size: 18px; color: #333;">Patient Details</h3>
                    <p style="margin: 5px 0;">Patient Number: <strong>${slotNumber || 'N/A'}</strong></p>
                    <p style="margin: 5px 0;">Time Slot: <strong>${timeSlot || 'N/A'}</strong></p>
                </div>
    
                <!-- Footer Section -->
                <div style="text-align: center; margin-top: 30px;">
                    <p style="font-size: 14px; color: #666;">Thank you for booking your appointment!</p>
                    <p style="font-size: 14px; color: #666;">Please arrive at least 5 minutes early for your scheduled time.</p>
                </div>
            </div>
        `;
    
        // Append the container to the body
        document.body.appendChild(receiptContainer);
    
        // Capture the receipt as an image
        const canvas = await html2canvas(receiptContainer, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
    
        // Create a new PDF
        const pdf = new jsPDF("p", "mm", "a4");
    
        // Set the dimensions for the image in the PDF
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
        // Save the PDF
        pdf.save("Appointment_Receipt.pdf");
    
        document.body.removeChild(receiptContainer);
    };
    

    useEffect(() => {
        if (scheduleID) {
            fetchDetails(scheduleID);
        }
    }, [scheduleID]);

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            <Toaster />
            {/* Background Image with Full Screen Cover */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${doctorImage})`, // Use the imported image
                }}
            ></div>

            {/* Gradient Overlay on Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#98DED9] via-[#EEECFC] to-[#EEECFC] opacity-60 z-10"></div>

            {/* Header Component */}
            <div className="relative z-20">
                <Header />
            </div>

            {/* Main Content Section */}
            <div className="flex justify-center items-center flex-grow gap-7 relative z-20 p-4 sm:p-8">
                <div className='bg-white bg-opacity-50 w-[95%] sm:w-[60%] md:w-[40%]  p-8 rounded-lg'>
                    <div className='w-full flex justify-center items-center'>
                        <img className='md:w-[12%] w-[30%] sm:w-[25%] p-1 bg-white rounded-[50%] bg-cover bg-center bg-no-repeat inset-0' src={Logo} alt="" />
                    </div>

                    <div className=' mt-5 border-b-2 border-black'>
                        <h1 className='text-center mb-4'>ඔබගේ වෙලාව වෙන්කර ගැනීම සාර්ථකයි. ඔබගේ දුරකතනයට sms පණිවිඩයක් මාර්ගයේ දැනුවත්කිරීම සුදුවනු ඇත.</h1>
                        <h1 className='text-center mb-4'>Your appointment has been successfully booked. You will receive an SMS on your phone notifying you of the route.</h1>
                    </div>

                    <div className='border-b-2 border-black'>
                        <h1 className='text-center my-4'>Appointment Details</h1>
                    </div>

                    <div className='flex justify-center items-center mt-4 flex-col'>
                        <h1>Doctor Name - <span className='text-red font-semibold'>{details ? details.fullName : 'Loading...'}</span></h1>
                        <h1>Date - <span className='text-red font-semibold'>{details ? new Date(details.date).toLocaleDateString('en-GB') : 'Loading...'}</span></h1>
                        <h1>Patient No - <span className='text-red font-semibold'>{slotNumber}</span></h1>
                        <h1>Time Slot - <span className='text-red font-semibold'>{timeSlot}</span></h1>
                    </div>

                    <div className='w-full flex justify-center items-center mt-5'>
                        <button
                            onClick={downloadReceipt}
                            className='text-[16px] text-white uppercase font-semibold text-left bg-[#4489C0] p-2 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:bg-[#285d88]'
                        >
                            Download Receipt
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <div className="relative z-20 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default DoctorLogin;
