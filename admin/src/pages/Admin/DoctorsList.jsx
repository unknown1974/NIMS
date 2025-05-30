import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, token, getAllDoctors, changeAvailability, removeDoctor } = useContext(AdminContext);

  useEffect(() => {
    if (token) {
      getAllDoctors();
    }
  }, [token]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
      <h1 className="text-xl font-semibold mb-4 text-center sm:text-left">All Doctors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="group border border-indigo-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
          >
            <div className="bg-indigo-50 group-hover:bg-blue-400 transition-colors duration-500 flex items-center justify-center h-40">
              <img
                src={item.image}
                alt={`${item.name}`}
                className="h-full object-contain"
              />
            </div>
            <div className="p-4 text-center sm:text-left">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.specialization}</p>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    className="accent-green-600"
                    checked={item.available}
                  />
                  <span>Available</span>
                </label>
                <button
                  onClick={() => removeDoctor(item._id)}
                  className="bg-red-600 px-4 py-2 text-white rounded-md hover:bg-red-700 transition sm:ml-auto hover:cursor-pointer"
                >
                  Remove Doctor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
