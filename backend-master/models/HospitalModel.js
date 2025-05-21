const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const validator = require('validator');
const HospitalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


HospitalSchema.statics.signup = async function(name, location, contact, email, password) {
    if (!name || !location || !contact || !email || !password) {
        throw new Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const existingHospital = await this.findOne({ email });
    if (existingHospital) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hospital = new this({
        name,
        location,
        contact,
        email,
        password: hashedPassword
    });
    await hospital.save();
    return hospital;
}

HospitalSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error("All fields are required");
    }

    const hospital = await this.findOne({ email });
    if (!hospital) {
        throw new Error("Invalid email");
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    return hospital;
}



module.exports = mongoose.model('Hospital', HospitalSchema);