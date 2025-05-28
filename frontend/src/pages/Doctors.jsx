import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';

const specialities = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist'
];

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = useCallback(() => {
    if (speciality && doctors?.length) {
      
      setFilterDoc(doctors.filter(doc => doc.specialization === speciality));
      
    } else {
      setFilterDoc(doctors || []);
    }
  }, [doctors, speciality]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  return (
    <div className='p-5'>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* Filter toggle button (mobile only) */}
        <button 
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters list */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden'} sm:flex`}>
          {specialities.map((item, idx) => (
            <p
              key={idx}
              onClick={() => speciality === item ? navigate('/doctors') : navigate(`/doctors/${item}`)}
              className={`w-full sm:w-[15vw] pl-3 py-1.5 pr-16 border border-gray-600 rounded transition-all cursor-pointer ${
                speciality === item ? 'bg-indigo-100 text-black' : ''
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Doctor cards */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-6'>
          {filterDoc?.length > 0 ? (
            filterDoc.map((item) => (
              <div 
                key={item._id}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300'
              >
                <img className='bg-blue-50 w-full h-48 object-cover' src={item.image} alt={item.name} />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                    <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></p>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.specialization}</p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>No doctors found for this speciality.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Doctors;
