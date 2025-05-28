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

  const backendUrl = import.meta.env.VITE_BACKEND_URL

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
      const res = await axios.post(backendUrl + '/api/user/verify-otp-cancel', { appointmentId, otp: otpInput });
      if (res.data.message === 'Appointment cancelled successfully') {
        toast.success(res.data.message);
        appointmentSearch();
        // Mark this appointment as verified
        setVerifiedAppointments(prev => [...prev, appointmentId]);
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
      <h2 className="text-xl mb-2">Find By:</h2>
      <div>
        <label className="mr-4">
          <input
            type="radio"
            value="phoneNumber"
            checked={selectedOption === 'phoneNumber'}
            onChange={handleOptionChange}
            className="mr-1"
          />
          Phone Number
        </label>

        <label className="mr-4">
          <input
            type="radio"
            value="aadharNumber"
            checked={selectedOption === 'aadharNumber'}
            onChange={handleOptionChange}
            className="mr-1"
          />
          Aadhar Number
        </label>

        <div className="flex-1 flex flex-col gap-1 mt-4">
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
        </div>
      </div>

      <button
        onClick={appointmentSearch}
        className="bg-blue-500 px-10 py-3 mt-4 text-white rounded-full"
      >
        Find Appointments
      </button>

      {/* Conditional display after button click */}
      {searchAttempted && (
        appointments.length > 0 ? (
          <div className="w-full max-w-6xl m-5">
            <p className="mb-3 text-lg font-medium">All Appointments</p>
            <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
              <div className="max-sm:full font-semibold grid grid-cols-[0.7fr_2fr_1fr_2fr_2fr_1fr] gap-1 py-3 px-6 border-b">
                <p>S. No</p>
                <p>Patient</p>
                <p>Age</p>
                <p>Date & Time</p>
                <p>Doctor</p>
                <p>Action</p>
              </div>
              {[...appointments].reverse().map((item, index) => (
                <div
                  className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.7fr_2.4fr_1fr_2.3fr_1.8fr_1fr] gap-1 items-center text-gray-500 px-3 py-6 border-b hover:bg-gray-50"
                  key={index}
                >
                  <p className="max-sm:hidden">{index + 1}</p>
                  <div className="flex items-center gap-2">
                    <p>{item.userData.name}</p>
                  </div>
                  <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
                  <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                  <p>{item.docData.name}</p>
                  <div className='flex flex-col gap-2 justify-end'>
                    {!item.cancelled && !item.isCompleted && (
                      <button
                        onClick={() => sendOtp(item._id, item.userData.phoneNumber)}
                        className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                      >
                        Cancel Appointment
                      </button>
                    )}
                    
                    {item.cancelled && (
                      <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>
                    )}
                    {item.isCompleted && (
                      <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Appointment Completed</button>
                    )}

                    {otpSentAppointment === item._id && (
                      <div className="flex flex-col mt-2 gap-2">
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
                          className={`rounded py-2 ${verifiedAppointments.includes(item._id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'}`}
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
        )
      )}

    </div>
  );
};

export default FindAppointments;
