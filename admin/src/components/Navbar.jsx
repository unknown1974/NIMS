import React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { assets } from '../assets/assets.js'

const Navbar = () => {
    const {token, setAToken} =useContext(AdminContext)
    const {dToken, setDToken} =useContext(DoctorContext)
    
    const navigate=useNavigate()

    const logout=()=>{
        navigate('/')
        token && setAToken('')
        token && localStorage.removeItem('token')
        dToken && setDToken('')
        dToken && localStorage.removeItem('dToken')
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-25 sm:w-40 cursor-pointer' src={assets.dashboard_icon} alt="" />
            <p className='border px-2.5 py-1 font-medium rounded-full border-gray-500 text-gray-600'>{token ? 'Admin':'Doctor'}</p>
        </div>
        <button onClick={logout} className='bg-blue-400 text-white text-sm px-10 py-2 rounded-full hover:cursor-pointer'>LogOut</button>
    </div>
  )
}

export default Navbar