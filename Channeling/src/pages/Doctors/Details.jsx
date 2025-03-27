import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Star, GraduationCap, Building2, ClipboardCheck, BadgeCheck, FileText } from 'lucide-react';

import bg from "../../assest/images/c2.jpg";

const Details = () => {
  const location = useLocation();
  const doctor = location.state || {}; // Get passed doctor data

  return (
    <div style={{ backgroundImage: `url(${bg})` }} className="min-h-screen bg-cover bg-center bg-no-repeat">
      {/* Overlay */}
      <div className="min-h-screen bg-white/40">
        <Header />
        <div className=" justify-items-center mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 -mt-1 flex flex-col items-center text-center sticky top-8 transition-all duration-300 hover:shadow-xl">
                
                {/* Doctor's Image */}
                <img 
                  src={doctor.profileImage ? `http://localhost:8081/${doctor.profileImage}` : "default-image.jpg"} 
                  alt={doctor.fullName} 
                  className="w-64 h-64 object-cover rounded-full mx-auto border-4 border-blue-400"
                />

                {/* Doctor's Name & Position */}
                <h2 className="text-2xl font-semibold mt-4 text-gray-800"> {doctor.fullName || "Doctor Name"}</h2>
                <p className="text-gray-700 text-lg mb-3">{doctor.qualifications || "Specialization"}</p>

                {/* Button */}
                <button className="w-full bg-green hover:bg-blue-700 text-white py-3 px-4 mb-1 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg font-medium">
                  Channel Now
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-3 max-w-full md:max-w-4xl ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Star, title: "Other Specializations", content: "NA", color: "green" },
                  { icon: GraduationCap, title: "Qualifications", content: "NA", color: "green" },
                  { icon: BadgeCheck, title: "Experience", content: "NA", color: "green" },
                  { icon: ClipboardCheck, title: "Registration", content: "D13273", color: "blue" },
                  { icon: Building2, title: "Practising Government Hospitals", content: "NA", color: "blue" },
                  { icon: FileText, title: "Special Note", content: "Cardiologist", color: "blue" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${item.color === 'green' ? 'bg-lime-100' : 'bg-lime-100'}`}>
                        <item.icon 
                          className={`w-6 h-6 ${item.color === 'green' ? 'text-green-500' : 'text-blue-700'}`} 
                        />
                      </div>
                      <h3 className="text-gray-800 font-semibold text-lg">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 text-m pl-12">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Details;
