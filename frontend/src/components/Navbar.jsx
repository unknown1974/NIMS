
import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';

const Navbar = () => {
  const navigate = useNavigate();
  const {token, setToken} = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }
  

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      {/* Logo */}
      <img 
        onClick={() => navigate('/')} 
        className='w-16 sm:w-20 mb-2 cursor-pointer' 
        src={assets.logo} 
        alt="Logo" 
      />

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <li className='py-1'>
          <NavLink to='/'>HOME</NavLink>
        </li>
        <li className='py-1'>
          <NavLink to='/doctors'>ALL DOCTORS</NavLink>
        </li>
        <li className='py-1'>
          <NavLink to='/about'>ABOUT</NavLink>
        </li>
        <li className='py-1'>
          <NavLink to='/contact'>CONTACT</NavLink>
        </li>
      </ul>

      {/* Profile / Login Button / Mobile Menu */}
      <div className='flex items-center gap-4'>
        
          <button 
            onClick={() => navigate('/find-appointment')} 
            className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'
          >
            Find Appointments
          </button>
        
        {/* Mobile Menu Icon */}
        <img 
          onClick={() => setShowMenu(true)} 
          className='w-6 md:hidden' 
          src={assets.menu_icon} 
          alt="Menu" 
        />

        {/* Mobile Menu */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="Logo" />
            <img 
              className='w-7 cursor-pointer' 
              onClick={() => setShowMenu(false)} 
              src={assets.cross_icon} 
              alt="Close" 
            />
          </div>
          <ul className='flex flex-col items-center gap-6 mt-5 px-5 font-medium text-lg'>
            <li onClick={() => setShowMenu(false)}>
              <NavLink  to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
            </li>
            <li onClick={() => setShowMenu(false)}>
              <NavLink  to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
            </li>
            <li onClick={() => setShowMenu(false)}>
              <NavLink to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
            </li>
            <li onClick={() => setShowMenu(false)}>
              <NavLink  to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
            </li>
            <li onClick={() => setShowMenu(false)}>
              <NavLink  to='/find-appointment'><p className='px-4 py-2 rounded inline-block'>Find Appointments</p></NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
