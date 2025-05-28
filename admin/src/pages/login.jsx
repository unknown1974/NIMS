import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext.jsx';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {assets} from "../assets/assets.js"

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  

  const onsubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password },{ headers: { 'Content-Type': 'application/json' } });
        if (data.success) {
          setAToken(data.token);
          localStorage.setItem('token', data.token);
          toast.success("Logged in successfully!");
          navigate('/admin-dashboard')
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password },{ headers: { 'Content-Type': 'application/json' } });
        if (data.success) {
          setDToken(data.token);
          localStorage.setItem('dToken', data.token);
          toast.success("Logged in successfully!");
          navigate('/doctor-dashboard')
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.form
        onSubmit={onsubmitHandler}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 p-8 w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          <span className="text-primary">{state}</span> Login
        </h2>

        <div className="w-full">
          <label className="text-sm font-medium">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-primary focus:ring-2 focus:ring-primary transition"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <label className="text-sm font-medium">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-primary focus:ring-2 focus:ring-primary transition"
            type="password"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-blue-400 text-white w-full p-3 rounded-lg text-base font-medium transition hover:opacity-90"
        >
          Login
        </motion.button>

        <p className="text-center text-sm mt-2">
          {
            state === 'Admin' ?
              <>Doctor Login? <span className="text-blue-400 underline cursor-pointer" onClick={() => setState('Doctor')}>Click here</span></> :
              <>Admin Login? <span className="text-blue-400 underline cursor-pointer" onClick={() => setState('Admin')}>Click here</span></>
          }
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
