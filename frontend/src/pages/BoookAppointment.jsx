import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/Appcontext'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'


const BookAppointment = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [aadharNumber, setAadharNumber] = useState('')
    const [dob, setDob] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [about, setAbout] = useState('')
    const { backendUrl, getDoctorsData } = useContext(AppContext)
    const location = useLocation()
    const { docId, slotDate, slotTime } = location.state || {}
    const navigate = useNavigate()

    const token = localStorage.getItem('token') // or wherever you're storing token

    const onBookAppointmentHandler = async (event) => {
        event.preventDefault();
        if (!name || !email || !phoneNumber || !aadharNumber || !address1 || !address2 || !about || !dob) {
            toast.error("Please fill all required fields.");
            return;
        }
        try {
            const payload = {
                name,
                email,
                phoneNumber,
                aadharNumber,
                dob,
                address1,
                address2,
                about,
                docId,
                slotDate,
                slotTime
            };

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                setName('');
                setEmail('');
                setPhoneNumber('');
                setAadharNumber('');
                setDob('')
                setAddress1('');
                setAddress2('');
                setAbout('');

                await getDoctorsData()
                navigate('/')
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong.");
            console.error(error);
        }
    };


    return (
        <form onSubmit={onBookAppointmentHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Book Appointment</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll scroll-smooth'>
                <div className='w-full lg:flex-1 flex flex-col gap-4'>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Enter your name' required />
                    </div>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Email</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                    </div>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Phone Number</p>
                        <input onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} className='border rounded px-3 py-2' type="number" placeholder='Phone Number' required />
                    </div>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Aadhar Number</p>
                        <input
                            type="text"
                            pattern="\d{12}"
                            maxLength="12"
                            onChange={(e) => setAadharNumber(e.target.value)}
                            value={aadharNumber}
                            className="border rounded px-3 py-2"
                            placeholder="Aadhar Number (12 digits)"
                            required
                        />
                    </div>
                     <div className='flex-1 flex flex-col gap-1'>
                        <p>Date Of Birth</p>
                        <input onChange={(e) => setDob(e.target.value)} value={dob} className='border rounded px-3 py-2' type="date" placeholder='Date of birth' required />
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address Line 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address Line 2' required />
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>About Disease</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Describe illness' rows={5} required />
                </div>

                <button type='submit' className='bg-blue-400 px-10 py-3 mt-4 text-white rounded-full'>
                    Book Appointment
                </button>
            </div>
        </form>
    )
}

export default BookAppointment
