import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function DoctorProfile() {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editableData, setEditableData] = useState(null);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: editableData.address,
        available: editableData.available,
      };

      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
        headers: { dToken },
      });

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  useEffect(() => {
    if (profileData) setEditableData(profileData);
  }, [profileData]);

  const handleAddressChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleAvailabilityChange = () => {
    setEditableData((prev) => ({
      ...prev,
      available: !prev.available,
    }));
  };

  if (!editableData) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-xl shadow-sm">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            className="w-full sm:w-64 h-64 object-cover rounded-lg border"
            src={editableData.image}
            alt={editableData.name}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{editableData.name}</h2>
            <p className="text-gray-600 mt-1">
              {editableData.degree} - {editableData.speciality || 'Speciality'}
            </p>
            <span className="inline-block mt-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
              {editableData.experience} experience
            </span>
          </div>

          {/* About */}
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">About</p>
            <p className="text-sm text-gray-600">{editableData.about}</p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">Address</p>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className="border rounded px-3 py-2 text-sm"
                  onChange={(e) => handleAddressChange('address1', e.target.value)}
                  value={editableData.address.address1}
                  placeholder="Address Line 1"
                />
                <input
                  type="text"
                  className="border rounded px-3 py-2 text-sm"
                  onChange={(e) => handleAddressChange('address2', e.target.value)}
                  value={editableData.address.address2}
                  placeholder="Address Line 2"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {editableData.address.address1}
                <br />
                {editableData.address.address2}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <input
              className={`accent-green-600 w-4 h-4`}
              type="checkbox"
              checked={editableData.available}
              onChange={isEdit ? handleAvailabilityChange : undefined}
              disabled={!isEdit}
              id="availability"
            />
            <label htmlFor="availability" className="text-sm text-gray-700">Available</label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-3">
            {isEdit ? (
              <>
                <button
                  onClick={updateProfile}
                  className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditableData(profileData);
                    setIsEdit(false);
                  }}
                  className="px-4 py-2 text-sm border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-2 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
