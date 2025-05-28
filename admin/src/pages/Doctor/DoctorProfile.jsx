import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function DoctorProfile() {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)

  const [isEdit, setIsEdit] = useState(false)
  const [editableData, setEditableData] = useState(null)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: editableData.address,
        available: editableData.available,
      }

      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, {
        headers: { dToken },
      })

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  useEffect(() => {
    if (profileData) {
      setEditableData(profileData)
    }
  }, [profileData])

  const handleAddressChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        
        [field]: value,
        
      },
    }))
  }

  const handleAvailabilityChange = () => {
    setEditableData((prev) => ({
      ...prev,
      available: !prev.available,
    }))
  }

  if (!editableData) return null

  return (
    <div>
      <div className="flex flex-col gap-4 m-5">
        {/* Profile Image */}
        <div>
          <img
            className="bg-blue-500/80 w-full sm:max-w-64 rounded-lg"
            src={editableData.image}
            alt=""
          />
        </div>

        {/* Profile Header */}
        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {editableData.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {editableData.degree} - {editableData.speciality || 'speciality'}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {editableData.experience}
            </button>
          </div>
        </div>

        {/* About Section */}
        <div>
          <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About</p>
          <p className="text-sm text-gray-600 max-w-[700px] mt-1">{editableData.about}</p>
        </div>

        {/* Address Section */}
        <div className="flex gap-2 py-2">
          <p>Address:</p>
          <p className="text-sm">
            {isEdit ? (
              <>
                <input
                  type="text"
                  className="border rounded px-2 py-1 mb-1 block"
                  onChange={(e) => handleAddressChange('address1', e.target.value)}
                  value={editableData.address.line1}
                />
                <input
                  type="text"
                  className="border rounded px-2 py-1 block"
                  onChange={(e) => handleAddressChange('address2', e.target.value)}
                  value={editableData.address.line2}
                />
              </>
            ) : (
              <>
                {editableData.address.address1}
                <br />
                {editableData.address.address2}
              </>
            )}
          </p>
        </div>

        {/* Availability Section */}
        <div className="flex gap-2 pt-2 items-center">
          <input className={`accent-green-600 w-4 h-4 ${!isEdit ? 'pointer-events-none cursor-default' : ''}`}
            onChange={isEdit ? handleAvailabilityChange : undefined}
            checked={editableData.available}
            type="checkbox"
            id="availability"
            disabled={!isEdit}
            
          />
          <label htmlFor="availability">Available</label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isEdit ? (
            <>
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditableData(profileData)
                  setIsEdit(false)
                }}
                className="px-4 py-1 border border-gray-400 text-sm rounded-full mt-5 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
