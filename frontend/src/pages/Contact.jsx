import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="px-4 md:px-20">
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px] object-cover rounded-md shadow-md"
          src={assets.contact_image}
          alt="Contact Us"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-500">
            Panjagutta
            <br />
            Hyderabad, Telangana, India
            <br/>
            500087
          </p>
          <p className="text-gray-500">
            📞Tel: +91-9876543210
            <br />
            📧Email: nims@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600">CAREERS AT NIMS</p>
          <p className="text-gray-500">Learn more about our teams and job openings.</p>
          <button className="border border-black px-8 py-4 text-sm rounded-md 
            hover:bg-black hover:text-white transition-all duration-500 ease-in-out">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
