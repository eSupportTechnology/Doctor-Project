import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Logo from './assest/images/37a39cb7092d94d7297953ad09f2dee5.png';
import DoctorLogin from "./pages/Authentication/DoctorLogin";
import PatientLogin from "./pages/Authentication/PatientLogin";
import Register from './pages/Authentication/Register';
import Signin from './pages/Authentication/Signin';
import StaffLogin from "./pages/Authentication/StaffLogin";
import AdminLogin from "./pages/Authentication/AdminLogin";
import Bookingform from "./pages/Bookings/Bookingform";
import Doctors from "./pages/Doctors/Doctors";
import DoctorShedule from "./pages/Doctors/DoctorShedule";
import Main from './pages/Index';
import Patients from "./pages/Patients";
import Pharmacy from "./pages/Pharmacy";
import ProductDetails from "./pages/ProductDetails";
import Staff from "./pages/Staff/Staff";
import ScheduleTime from './pages/Doctors/ScheduleTime';
import ProtectedRoute from './ProtectedRoute';
import Success from './pages/Bookings/Success';
import Details from './pages/Doctors/Details';


import Admin from './pages/admin/Admin';


function App() {
  return (
    <div className="App">
        <ToastContainer autoClose={3000} />
        <Helmet>
          <title>Amarasingha Medicare</title>
          <link rel="icon" href={Logo} type="image/png" />
        </Helmet>

        <BrowserRouter>
          <Routes>
            {/* Home Page, SignIn & SignUp Pages */}
            <Route path="/" element={<Main/>}></Route>
            <Route path="/signin" element={<Signin/>}></Route>
            <Route path="/AdminLogin" element={<AdminLogin/>}></Route>
            <Route path="/StaffLogin" element={<StaffLogin/>}></Route>
            <Route path="/patientLogin" element={<PatientLogin/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/DoctorLogin" element={<DoctorLogin/>}></Route>

            {/* Patient Routes */}
            <Route path="/patients" element={<Patients/>}></Route>
            <Route path="/bookingform" element={<Bookingform/>}></Route>
            <Route path="/success" element={<Success/>}></Route>

            {/* Doctors Routes */}
            <Route path="/doctors" element={<Doctors/>}></Route>
            <Route path="/doctorShedule" element={<DoctorShedule/>}></Route>
            <Route path="/scheduletime" element={<ScheduleTime/>}></Route>
            <Route path="/details" element={<Details/>}></Route>

            {/* Staff Routes */}
            <Route path="/staff" element={<Staff/>}></Route>

            {/* Pharmacy Items */}
            <Route path="/pharmacy" element={<Pharmacy/>}></Route>
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}></Route>
            
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
