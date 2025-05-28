
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  phoneNumber: String,
  otp: String,
  createdAt: Date
});

export default mongoose.model('Otp', otpSchema);
