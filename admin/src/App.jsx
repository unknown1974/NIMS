import React, { useContext } from 'react'
import './index.css'
import Login from './pages/login.jsx'
import { AdminContext } from './context/AdminContext.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import AllAppointments from './pages/Admin/AllAppointments.jsx'
import AddDoctor from './pages/Admin/AddDoctor.jsx'
import DoctorsList from './pages/Admin/DoctorsList.jsx'
import Sidebar from './components/Sidebar.jsx'
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx'
import DoctorAppiontments from './pages/Doctor/DoctorAppiontments.jsx'
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx'
import { DoctorContext } from './context/DoctorContext.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'  // make sure to import Routes and Route

const App = () => {
  const { token } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return token || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        {/* <div className="flex-1 p-4"> */}
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/admin-dashboard" /> : dToken ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/login" />
            }
          />

          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppiontments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
        {/* </div> */}
      </div>
    </div>
  ) : (
    <Login />

  )
}

export default App
