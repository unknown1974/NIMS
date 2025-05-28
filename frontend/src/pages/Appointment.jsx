import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/Appcontext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [loading, setLoading] = useState(true);
  

  // ---------------------- UTILITIES ------------------------

  const formatDate = (date) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}_${month}_${year}`
  }

  const isSlotAvailable = (slotsBooked, slotDate, slotTime) => {
    return !(slotsBooked[slotDate]?.includes(slotTime))
  }

  const generateSlotsForDay = (baseDate, slotsBooked) => {
    let currentDate = new Date(baseDate)
    const endTime = new Date(baseDate)
    endTime.setHours(21, 0, 0, 0)

    const today = new Date()
    if (today.toDateString() === baseDate.toDateString()) {
      currentDate.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10)
      currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0)
    } else {
      currentDate.setHours(10)
      currentDate.setMinutes(0)
    }

    const timeSlots = []
    const slotDateStr = formatDate(baseDate)

    while (currentDate < endTime) {
      const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const available = isSlotAvailable(slotsBooked, slotDateStr, formattedTime)

      if (available) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30)
    }

    return timeSlots
  }

  const getAvailableSlots = () => {
    if (!docInfo) return

    const slotsBooked = docInfo.slots_booked || {}
    const today = new Date()
    const weekSlots = []

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const daySlots = generateSlotsForDay(currentDate, slotsBooked)
      weekSlots.push(daySlots)
    }

    setDocSlots(weekSlots)
  }

  const bookAppointment = async () => {
    if (!slotTime) {
      toast.warn("Please select a time slot")
      return
    }

    if (!docSlots[slotIndex]?.length) {
      toast.error("No available slots for this day")
      return
    }

    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate = formatDate(date)
      navigate('/appointment/bookAppointment', { state: { docId, slotDate, slotTime } })
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  // --------------------- Effects ----------------------------

  useEffect(() => {
    const info = doctors.find(doc => doc._id === docId)
    setDocInfo(info)
    setLoading(false)
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

   if (loading) return <p className="text-center mt-10">Loading doctor details...</p>;

  // --------------------- UI ----------------------------

  return docInfo && (
    <div>
      {/* Doctor Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="Doctor" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="Verified" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience} Years</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="Info" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>

        {/* Days Scroll */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer 
                ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'} 
                ${!item.length && 'opacity-50 cursor-not-allowed'}`}
              key={index}
            >
              <p>{item[0] ? daysOfWeek[item[0].datetime.getDay()] : 'N/A'}</p>
              <p>{item[0] ? item[0].datetime.getDate() : '--'}</p>
            </div>
          ))}
        </div>

        {/* Times Scroll */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
                ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
          Book an appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.specialization} />
    </div>
  )
}

export default Appointment
