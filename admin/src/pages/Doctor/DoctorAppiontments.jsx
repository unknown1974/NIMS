import { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets.js'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

function DoctorAppiontments() {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])
  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments
      </p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] ovreflow-y-scroll'>
        <div className='max-sm:hidden font-semibold grid grid-cols-[0.5fr_2fr_1fr_3fr_3fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Action</p>
        </div>
        {
          appointments.reverse().map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid  grid-cols-[0.5fr_2fr_1fr_3fr_3fr] gap-1 items-center text-gray-500 px-3 py-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index + 1}</p>
              
              <div className='flex items-center gap-2'>
                
                <p>{item.userData.name}</p>
              </div>

              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>

              {
                item.cancelled ? <p className='text-red-500 text-xs font medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font medium'>Completed</p> : <div className='flex'>   <img onClick={() => cancelAppointment(item._id)} className='w-8 rounded-full' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-8 rounded-full' src={assets.tick_icon} alt="" />
                </div>
              }

            </div>
          ))
        }

      </div>



    </div>

  )
}

export default DoctorAppiontments