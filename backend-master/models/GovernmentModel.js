const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const validator = require('validator');

const GovernmentSchema = new Schema({
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

GovernmentSchema.statics.signup = async function(name, location, contact, email, password) {
    if (!name || !location || !contact || !email || !password) {
        throw new Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const existingGovernment = await this.findOne({ email });
    if (existingGovernment) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const government = new this({
        name,
        location,
        contact,
        email,
        password: hashedPassword
    });
    await government.save();
    return government;
}

GovernmentSchema.statics.login = async function(email, password) {
    const government = await this.findOne({ email });
    if (!government) {
        throw new Error("Invalid login credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, government.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid login credentials");
    }

    return government;
}



module.exports = mongoose.model('Government', GovernmentSchema);



