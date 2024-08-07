const mongoose = require('mongoose');
const studentSchema = mongoose.Schema(
    {
        studentNumber:{
            type: String,
            required:[true, 'Number is required']
        },
        firstName:{
            type: String,
            required:[true, 'First name is required']
        },
        LastName:{
            type: String,
            required:[true, 'Last name is required']
        },
        Address:{
            type: String,
            required:[true, 'Address is required']
        },
        city:{
            type: String,
            required:[true, 'City is required']
        },
        phoneNumber:{
            type: Number,
            required:[true, 'Phone number is required']
        },
        email:{
            type: String,
            required:[true, 'Email is required']
        },
        program:{
            type: String,
            required:[true, 'Program is required']
        },
    },
    {
        timestamps: true
    }

)
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;