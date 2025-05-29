import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { token, getDashData, cancelAppointment, dashData, loading } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (token) {
      getDashData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    dashData && (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <div className="flex items-center gap-2 bg-white p-4 w-full sm:w-[45%] lg:w-[30%] rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-12" src={assets.appointments_icon} alt="Appointments" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
              <p className="text-gray-400 text-sm">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 w-full sm:w-[45%] lg:w-[30%] rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-11" src={assets.complete_icon} alt="Completed" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.completed}</p>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 w-full sm:w-[45%] lg:w-[30%] rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-11" src={assets.cancel_icon2} alt="Cancelled" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.cancelled}</p>
              <p className="text-gray-400 text-sm">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white mt-10 rounded shadow-sm">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b">
            <img src={assets.list_icon} alt="List" className="w-5 h-5" />
            <p className="font-semibold text-gray-700">Latest Bookings</p>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-4 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10 h-10 object-cover"
                  src={item.docData.image}
                  alt="Doctor"
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-8 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
