import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/AppointmentModel.js'
import twilio from 'twilio'
import crypto from 'crypto';
import otpModel from '../models/otpModel.js'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//API to book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { name, email, phoneNumber, aadharNumber,dob, address1, address2, about, docId, slotDate, slotTime } = req.body;

    const doctor = await doctorModel.findById(docId).select('-password');
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    // Check if slot is already booked
    let slots_booked = doctor.slots_booked || {};

    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }

    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }

    // Push the new slot
    slots_booked[slotDate].push(slotTime);

    // Atomically update slots_booked
    await doctorModel.updateOne(
      { _id: docId },
      { $set: { [`slots_booked.${slotDate}`]: slots_booked[slotDate] } }
    );

    const userData = {
      name, email, phoneNumber, aadharNumber,dob,
      address: { line1: address1, line2: address2 }, about
    };

    const appointmentData = {
      docId,
      userData,
      slotDate,
      slotTime,
      docData: doctor,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({ success: true, message: "Appointment booked successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



//Api to get user appointments for frontend my-appointmenst page
const listAppointments=async (req,res)=>{
    try {
        // const {userId}=req.body
        // const appointments=await appointment.find({userId})
        const allappointments=await appointmentModel.find({})

        res.json({success:true,allappointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

//ApI to cancel appointment
const cancelAppointment=async (req,res)=>{
    try {
        const {userId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        //verify appointment user
        if(appointmentData.userId!==userId){
            return res.json({success:false,message:"Unauthorized access"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        //releasing doctor slot
        const {docId, slotDate,slotTime}=appointmentData
        const doctorData=await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e!== slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:"Appointment cancelled successfully"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
 
const findAppointments = async (req, res) => {
  try {
    const { searchData } = req.body;
    const { selectedOption, inputData } = searchData;

    if (!selectedOption || !inputData) {
      return res.status(400).json({ message: 'Missing search parameters.' });
    }

    let query = {};

    if (selectedOption === 'phoneNumber') {
      query['userData.phoneNumber'] = inputData;
    } else if (selectedOption === 'aadharNumber') {
      query['userData.aadharNumber'] = inputData;
    } else {
      return res.status(400).json({ message: 'Invalid search option.' });
    }

    const appointments = await appointmentModel.find(query);
    
    

    if (appointments.length === 0) {
      return res.status(200).json({ message: 'No appointments found.' });
    }

    res.status(200).json({ appointments });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};


 const sendOtp = async (req, res) => {
  try {
    const { appointmentId, phoneNumber } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userData.phoneNumber !== phoneNumber) {
      return res.status(400).json({ message: 'Phone number mismatch' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await client.messages.create({
      body: `Your OTP for cancelling the appointment is: ${otp}`,
      to: `+91${phoneNumber}`, // add country code
      from: process.env.TWILIO_PHONE_NUMBER
    });

    await otpModel.create({
      appointmentId,
      phoneNumber,
      otp,
      createdAt: new Date()
    });

    res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};
 const verifyOtpAndCancelAppointment = async (req, res) => {
  try {
    const { appointmentId, otp } = req.body;

    const validOtp = await otpModel.findOne({ appointmentId, otp });
    if (!validOtp) return res.status(400).json({ message: 'Invalid OTP' });

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    await otpModel.deleteMany({ appointmentId });

    res.status(200).json({ message: 'Appointment cancelled successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};



export { bookAppointment,listAppointments,cancelAppointment,findAppointments,sendOtp,verifyOtpAndCancelAppointment}