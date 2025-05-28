import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/AppointmentModel.js"

const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability changed' })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api for doctor login 
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body

        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API to get doctor appointments for doctor panel

const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.doctorId;

        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API to mark appointment as completed
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.doctorId;

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment completed' })

        } else {
            return res.json({ success: false, message: 'Mark Failed' })

        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}


//API to cancel appointment for doctor panel

const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.doctorId;

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment cancelled' })

        } else {
            return res.json({ success: false, message: 'Cancellation Failed' })

        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//Api to get dashboard data for doctor panel 
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.doctorId;

        const appointments = await appointmentModel.find({ docId })
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
        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })
        const dashData = {
            completed,
            appointments: appointments.length,
            cancelled,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// API to get doctor profile for Doctor panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.doctorId;

        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//API to update doctor profile from Doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { fees, address, available } = req.body
        const docId = req.doctorId;

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
        res.json({ success: true, message: 'Profile updated successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}





export {
    changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard,
    doctorProfile, updateDoctorProfile
}
