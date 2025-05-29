import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';

const FindAppointments = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [inputData, setInputData] = useState('');
  const [appointments, setAppointments] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const { getAppointments, calculateAge, slotDateFormat } = useContext(AppContext);
  const [otpInput, setOtpInput] = useState('');
  const [otpSentAppointment, setOtpSentAppointment] = useState(null);
  const [verifiedAppointments, setVerifiedAppointments] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setInputData('');
    setAppointments(null);
    setSearchAttempted(false);
  };

  const sendOtp = async (appointmentId, phoneNumber) => {
    await axios.post(backendUrl + '/api/user/send-otp', { appointmentId, phoneNumber });
    setOtpSentAppointment(appointmentId);
    toast.success('OTP sent to your mobile!');
  };

  const verifyOtp = async (appointmentId) => {
    try {
      const res = await axios.post(backendUrl + '/api/user/verify-otp-cancel', {
        appointmentId,
        otp: otpInput,
      });
      if (res.data.message === 'Appointment cancelled successfully') {
        toast.success(res.data.message);
        appointmentSearch();
        setVerifiedAppointments((prev) => [...prev, appointmentId]);
      } else {
        toast.error('Incorrect OTP');
      }
    } catch (err) {
      toast.error('Error verifying OTP');
    }
  };

  const appointmentSearch = async () => {
    if (!selectedOption) {
      toast.error('Please select an option first.');
      return;
    }

    if (selectedOption === 'phoneNumber') {
      if (!/^\d{10}$/.test(inputData)) {
        toast.error('Please enter a valid 10-digit phone number.');
        return;
      }
    } else if (selectedOption === 'aadharNumber') {
      if (!/^\d{12}$/.test(inputData)) {
        toast.error('Please enter a valid 12-digit Aadhar number.');
        return;
      }
    }

    const searchData = { selectedOption, inputData };
    const data = await getAppointments(searchData);
    setSearchAttempted(true);

    if (data?.appointments && data.appointments.length > 0) {
      setAppointments(data.appointments);
    } else {
      setAppointments([]);
      toast.error('No Data Found');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Find Appointment By</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="phoneNumber"
            checked={selectedOption === 'phoneNumber'}
            onChange={handleOptionChange}
          />
          <span>Phone Number</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="aadharNumber"
            checked={selectedOption === 'aadharNumber'}
            onChange={handleOptionChange}
          />
          <span>Aadhar Number</span>
        </label>
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <input
          onChange={(e) => setInputData(e.target.value)}
          value={inputData}
          className="border rounded px-3 py-2"
          type="text"
          placeholder={
            selectedOption === 'phoneNumber'
              ? 'Enter Phone Number'
              : selectedOption === 'aadharNumber'
              ? 'Enter Aadhar Number'
              : 'Select an option first'
          }
          disabled={!selectedOption}
        />

        <button
          onClick={appointmentSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
        >
          Find Appointments
        </button>
      </div>

      {searchAttempted && (
        <div className="mt-8">
          {appointments.length > 0 ? (
            <div className="w-full max-w-6xl mx-auto">
              <p className="text-lg font-semibold mb-4">Appointments</p>
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                {[...appointments].reverse().map((item, index) => (
                  <div
                    key={index}
                    className="border-b px-4 py-4 flex flex-col sm:grid sm:grid-cols-6 sm:items-center gap-2 sm:gap-4 hover:bg-gray-50 transition-all"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden text-sm text-gray-700 space-y-1">
                      <p><strong>S. No:</strong> {index + 1}</p>
                      <p><strong>Patient:</strong> {item.userData.name}</p>
                      <p><strong>Age:</strong> {calculateAge(item.userData.dob)}</p>
                      <p><strong>Date & Time:</strong> {slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                      <p><strong>Doctor:</strong> {item.docData.name}</p>
                    </div>

                    {/* Desktop Grid Layout */}
                    <p className="hidden sm:block">{index + 1}</p>
                    <p className="hidden sm:block">{item.userData.name}</p>
                    <p className="hidden sm:block">{calculateAge(item.userData.dob)}</p>
                    <p className="hidden sm:block">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                    <p className="hidden sm:block">{item.docData.name}</p>

                    <div className="flex flex-col gap-2">
                      {!item.cancelled && !item.isCompleted && (
                        <button
                          onClick={() => sendOtp(item._id, item.userData.phoneNumber)}
                          className="border border-red-400 text-red-500 py-1 px-2 rounded hover:bg-red-600 hover:text-white transition"
                        >
                          Cancel Appointment
                        </button>
                      )}
                      {item.cancelled && (
                        <span className="text-red-500 border border-red-400 py-1 px-2 rounded text-center">
                          Appointment Cancelled
                        </span>
                      )}
                      {item.isCompleted && (
                        <span className="text-green-600 border border-green-500 py-1 px-2 rounded text-center">
                          Appointment Completed
                        </span>
                      )}

                      {otpSentAppointment === item._id && (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="Enter OTP"
                            className="border px-3 py-2 rounded"
                            disabled={verifiedAppointments.includes(item._id)}
                          />
                          <button
                            onClick={() => verifyOtp(item._id)}
                            className={`py-2 rounded text-white transition ${
                              verifiedAppointments.includes(item._id)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                            disabled={verifiedAppointments.includes(item._id)}
                          >
                            {verifiedAppointments.includes(item._id) ? 'Verified' : 'Verify OTP'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 text-center text-lg text-gray-500">
              No appointments found for the given {selectedOption === 'phoneNumber' ? 'Phone Number' : 'Aadhar Number'}.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindAppointments;
