import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StaffMiddleware = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("staffAuthToken");
    if (!token) {
      navigate("/StaffLogin"); // Redirect to login page if not logged in
    }
  }, [navigate]);

  return <>{children}</>;
};

export default StaffMiddleware;
