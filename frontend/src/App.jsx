import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import ScrollToTop from './components/ScrollToTop'
import About from './pages/About'
import Contact from './pages/Contact'


import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BoookAppointment from './pages/BoookAppointment'
import FindAppointments from './pages/FindAppointments'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        
        
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path ='/appointment/bookAppointment' element={<BoookAppointment/>}/>
        <Route path = '/find-appointment' element={<FindAppointments/>}/>
      </Routes>
      <Footer />
      
    </div>
  )
}

export default App