import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12 '>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>The National Incident Management System (NIMS) is a standardized framework created to help government agencies, private organizations, and others work together effectively during emergencies. It provides a consistent approach through components like the Incident Command System (ICS) and emphasizes coordination, communication, and resource management. Flexible and scalable, NIMS strengthens preparedness and response efforts, ensuring a more organized and effective reaction to incidents of any size.</p>
          <p>NIMS is a flexible and scalable system that can be applied to emergencies of any size, from local incidents to national disasters. It promotes preparedness through training and planning, and fosters cooperation among organizations to ensure an organized, effective response that protects lives, property, and communities.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>The vision of NIMS is to create a unified, coordinated approach to emergency management across all sectors. It aims to enhance the nation's ability to prepare for, respond to, and recover from all types of incidents.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into yours busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professional in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and remainders to help you stay on top of your health.</p>
        </div>
      </div>
        
    </div>
  )
}

export default About