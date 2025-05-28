import mongoose from "mongoose";

//   _id: 'doc15',
//         name: 'Dr. Amelia Hill',
//         image: doc15,
//         speciality: 'Dermatologist',
//         degree: 'MBBS',
//         experience: '1 Years',
//         about:

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        
    },
    image:{
        type: String,
        default:"https://www.google.com/imgres?q=image&imgurl=https%3A%2F%2Fcdn.prod.website-files.com%2F62d84e447b4f9e7263d31e94%2F6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg&imgrefurl=https%3A%2F%2Fwww.pixsy.com%2Fimage-theft%2Fverify-image-source-copyright-owner&docid=XUAyne4_INagNM&tbnid=HXLlNEpHoJATkM&vet=12ahUKEwj1jsngnoSNAxUGna8BHSkSGHcQM3oECFQQAA..i&w=1920&h=1080&hcb=2&ved=2ahUKEwj1jsngnoSNAxUGna8BHSkSGHcQM3oECFQQAA"
    },
    address:{
        type: Object,
        default:{line1:'',line2:''},
    },
    gender:{
        type: String,
        default: "Not Selected",
    },
    dob:{
        type:String,default: "Not Selected",
    },
    phone:{
        type:String,default:'0000000000',
    }
    });

    const userModel =mongoose.models.user ||  mongoose.model("user", userSchema);
    export default userModel;