
const jwt = require('jsonwebtoken');
const Vendor = require('../models/VendorModel');
const Hospital = require('../models/HospitalModel');
const Government = require('../models/GovernmentModel');


const requireAuth = async (req, res, next) => {

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" })
    }
    const token = authorization.replace("Bearer ", "");
    try {
    const { _id } = jwt.verify(token, "good boy");
    req.user = await Vendor.findById(_id).select('_id');
    if (!req.user) {
        req.user = await Hospital.findById(_id).select('_id');
    }
    if (!req.user) {
        req.user = await Government.findById(_id).select('_id');
    }


    if (!req.user) {
        return res.status(401).json({ error: "You must be logged in" })
    }

    next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ error: "request not authorized" })
    }


    

}

module.exports = requireAuth;
