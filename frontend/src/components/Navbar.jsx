import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
  };

  const handleNavLinkClick = () => {
    setShowMenu(false);
  };

  return (
    <div className="relative z-30">
      <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-4 sm:px-8">
        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          className="w-16 sm:w-20 mb-2 cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-5 font-medium">
          <li><NavLink to="/">HOME</NavLink></li>
          <li><NavLink to="/doctors">ALL DOCTORS</NavLink></li>
          <li><NavLink to="/about">ABOUT</NavLink></li>
          <li><NavLink to="/contact">CONTACT</NavLink></li>
        </ul>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/find-appointment')}
            className="bg-primary text-white px-6 py-2 rounded-full font-light hidden md:block hover:scale-105 transition-all duration-300"
          >
            Find Appointments
          </button>

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden cursor-pointer"
            src={assets.menu_icon}
            alt="Menu"
          />
        </div>
      </div>

      {/* Mobile Menu & Backdrop */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        } md:hidden z-40`}
      >
        <div className="flex items-center justify-between px-5 py-6 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <img
            className="w-6 cursor-pointer"
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <ul className="flex flex-col gap-5 p-6 text-base font-medium">
          <li onClick={handleNavLinkClick}>
            <NavLink to="/">Home</NavLink>
          </li>
          <li onClick={handleNavLinkClick}>
            <NavLink to="/doctors">All Doctors</NavLink>
          </li>
          <li onClick={handleNavLinkClick}>
            <NavLink to="/about">About</NavLink>
          </li>
          <li onClick={handleNavLinkClick}>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li onClick={handleNavLinkClick}>
            <NavLink to="/find-appointment">Find Appointments</NavLink>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
