import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, token, getAllDoctors, changeAvailability } = useContext(AdminContext);

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
            className="border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-indigo-50 group-hover:bg-blue-400 transition-all duration-500 flex items-center justify-center h-40">
              <img
                src={item.image}
                alt={`${item.name}`}
                className="h-full object-contain"
              />
            </div>
            <div className="p-4 text-center sm:text-left">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  className="accent-green-600"
                  checked={item.available}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
