import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="px-4 sm:px-8 md:px-10 mt-20">
      <div className="grid gap-10 md:grid-cols-3 text-sm text-gray-700">
        {/* Left Section */}
        <div>
          <img className="w-16 sm:w-20 mb-4" src={assets.logo} alt="Company Logo" />
          <p className="leading-6 text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-xl font-semibold mb-4">Company</p>
          <ul className="flex flex-col gap-2">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/doctors">All Doctors</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-xl font-semibold mb-4">Get in Touch</p>
          <ul className="flex flex-col gap-2">
            <li>📞 +91-9876543210</li>
            <li>📧 nims@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="mt-10 border-t pt-5 text-center text-xs text-gray-500">
        © 2025 NIMS – All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
