import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [token, setAToken] = useState(localStorage.getItem('token') || '');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [loading, setLoading] = useState(false);  // <-- New loading state
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setDoctors(data.doctors);
        
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId },  { headers:{Authorization: `Bearer ${token}` }} );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers:  { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setAppointments(data.appointments);
        
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers:  { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      setLoading(true);  // Start loading
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: {  Authorization: `Bearer ${token}` } });
      if (data.success) {
        setDashData(data.dashData);
        
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const value = {
    token, setAToken,
    backendUrl, doctors,
    getAllDoctors, changeAvailability,
    appointments, setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData, getDashData,
    loading,  // <-- Provide loading to context consumers
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
