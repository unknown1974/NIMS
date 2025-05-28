import mongoose from 'mongoose';

const appointmentSchema =new mongoose.Schema({
        docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    userData: {
        name: String,
        email: String,
        phoneNumber: String,
        aadharNumber: String,
        dob:Date,
        address: {
            line: String,
            line2: String
        },
        about: String
    },
    
    slotDate:{type:String,required:true},
    slotTime:{type:String,required:true},
    docData:{type:Object,required:true},
    date:{type:Number,required:true},
    cancelled:{type:Boolean,default:false},
    isCompleted:{type:Boolean,default:false}
})

const appointmentModel = mongoose.models.appointments || mongoose.model('appointments', appointmentSchema);
export default appointmentModel
