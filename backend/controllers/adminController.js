import validator from 'validator'
import bycrpt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/AppointmentModel.js'
import userModel from '../models/userModel.js'



//api for add doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, degree, experience, about, address } = req.body;
    const imageFile = req.file
    console.log(name, email, password, specialization, degree, experience, about, address, imageFile)
    //checking for all data to add doctor
    if (!name || !email || !password || !specialization || !degree || !experience || !about || !address) {
      return res.json({ success: false, message: "Missing Details" })
    }
    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" })
    }
    //validating exiting email
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.json({ success: false, message: "Email already registered" });
    }

    //validating password is strong or not
    if (password.length < 8) {
      return res.json({ success: false, message: "Password should be at least 8 characters" })
    }
    //hashing doctor password 
    const salt = await bycrpt.genSalt(10)
    const hashedPassword = await bycrpt.hash(password, salt)


    //upload image cloudinary 
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
    const imageUrl = imageUpload.secure_url

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      specialization,
      degree,
      experience,
      about,
      address: JSON.parse(address),
      date: Date.now()
    }
    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({ success: true, message: "Doctor added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const removedoctor = async (req, res) => {
  try {
      const {docId} = req.body
      const docData = await doctorModel.findById(docId);
      if(!docData){
        return res.json({ success: false, message: "Doctor not found" });
      }
        await doctorModel.findByIdAndDelete(docId);
        
        await appointmentModel.updateMany({docId}, { $set: {cancelled : true} })
        return res.json({ success: true, message: "Doctor Removed successfully" });
  } catch {
    console.log(error)
    return res.json({ success: false, message: error.message })
    
  }
}

//api for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });


      return res.json({ success: true, message: "Login Success", token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api for get all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password")
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}
// API to get all appointments of a doctor
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ApI for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });

    }

    await appointmentModel.findByIdAndDelete(appointmentId);

    // release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// api to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {


    const appointments = await appointmentModel.find({})

    let completed = 0
    appointments.map((item) => {
      if (item.isCompleted) {
        completed += 1
      }
    })
    let cancelled = 0
    appointments.map((item) => {
      if (item.cancelled) {
        cancelled += 1
      }
    })

    const dashData = {
      completed, cancelled,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5)

    }

    res.json({ success: true, dashData })


  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard,removedoctor }