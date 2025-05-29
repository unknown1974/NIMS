import { React, useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

function DoctorDashboard() {
  const { dashData, setDashData, getDashData, completeAppointment, cancelAppointment, dToken } = useContext(DoctorContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  return dashData && (
    <div className="w-full max-w-6xl px-4 sm:px-6 md:px-8 py-4 mx-auto">
      <div className="flex flex-wrap gap-4 justify-between">

        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 w-full sm:w-[48%] lg:w-[30%] cursor-pointer hover:scale-105 transition-transform">
          <img className="w-12 sm:w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{dashData.appointments}</p>
            <p className="text-gray-500 text-sm">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 w-full sm:w-[48%] lg:w-[30%] cursor-pointer hover:scale-105 transition-transform">
          <img className="w-10 sm:w-11" src={assets.complete_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{dashData.completed}</p>
            <p className="text-gray-500 text-sm">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 w-full sm:w-[48%] lg:w-[30%] cursor-pointer hover:scale-105 transition-transform">
          <img className="w-10 sm:w-11" src={assets.cancel_icon2} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{dashData.cancelled}</p>
            <p className="text-gray-500 text-sm">Cancelled</p>
          </div>
        </div>
      </div>

      <div className="bg-white mt-8 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold text-lg">Latest Bookings</p>
        </div>
        <div className="divide-y">
          {
            dashData.latestAppointments.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center px-4 py-3 gap-2 sm:gap-4 hover:bg-gray-100">
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">{item.userData.name}</p>
                  <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <div className="flex gap-2">
                    <img onClick={() => cancelAppointment(item._id)} className="w-8 h-8 rounded-full cursor-pointer" src={assets.cancel_icon} alt="Cancel" />
                    <img onClick={() => completeAppointment(item._id)} className="w-8 h-8 rounded-full cursor-pointer" src={assets.tick_icon} alt="Complete" />
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
