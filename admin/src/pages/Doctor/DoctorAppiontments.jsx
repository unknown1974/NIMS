import { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets.js'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

function DoctorAppointments() {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <p className="mb-3 text-lg font-semibold">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        {/* Desktop Header */}
        <div className="hidden sm:grid font-semibold grid-cols-[0.5fr_2fr_1fr_3fr_3fr] gap-2 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Action</p>
        </div>

        {appointments
          .slice() // shallow copy to avoid mutating original
          .reverse()
          .map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_1fr_3fr_3fr] gap-2 sm:items-center text-gray-600 px-4 py-4 border-b hover:bg-gray-50"
            >
              <p className="hidden sm:block">{index + 1}</p>

              <div className="flex items-center gap-2">
                {/* You can optionally add a profile icon here */}
                <p className="font-medium">{item.userData.name}</p>
              </div>

              <p className="hidden sm:block">{calculateAge(item.userData.dob)}</p>

              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

              {/* Action Section */}
              {item.cancelled ? (
                <p className="text-red-500 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex gap-2">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default DoctorAppointments
