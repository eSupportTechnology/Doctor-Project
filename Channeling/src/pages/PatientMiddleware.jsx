import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientMiddleware = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("patientAuthToken");
    if (!token) {
      navigate("/patientLogin"); // Redirect to login page if not logged in
    }
  }, [navigate]);

  return <>{children}</>;
};

export default PatientMiddleware;
