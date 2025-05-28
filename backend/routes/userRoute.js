import express from 'express'
import { bookAppointment,listAppointments,cancelAppointment, findAppointments, sendOtp, verifyOtpAndCancelAppointment } from '../controllers/userController.js'


const userRouter = express.Router()

userRouter.post('/book-appointment',bookAppointment)
userRouter.get('/appointments',listAppointments)
userRouter.post('/cancel-appointment',cancelAppointment)
userRouter.post('/find-appointments',findAppointments)
userRouter.post('/send-otp',sendOtp)
userRouter.post('/verify-otp-cancel',verifyOtpAndCancelAppointment)





export default userRouter