const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const VendorSchema = new Schema({
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
    },
    type:{
        type:String,
        required:true
    }
});

VendorSchema.statics.signup = async function(name, location, contact, email, password,type) {
    if (!name || !location || !contact || !email || !password) {
        throw new Error("All fields are required");
    }
    if(!type)
{
    throw new Error("Type is required");
}
    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const existingVendor = await this.findOne({ email });
    if (existingVendor) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new this({
        name,
        location,
        contact,
        email,
        password: hashedPassword,
        type
    });
    await vendor.save();
    return vendor;
}

VendorSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error("All fields are required");
    }

    const vendor = await this.findOne({ email });
    if (!vendor) {
        throw new Error("Invalid email");
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    return vendor;
}


module.exports = mongoose.model('Vendor', VendorSchema);