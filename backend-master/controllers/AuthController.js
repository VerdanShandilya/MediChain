const jwt=require('jsonwebtoken');
const Vendor=require('../models/VendorModel');
const Hospital=require('../models/HospitalModel');
const Government=require('../models/GovernmentModel');


const createtoken=(_id)=>{
    return jwt.sign({ _id }, "good boy", { expiresIn: '3d' })
}

 

const signupUser=async(req,res)=>{
    const {name,location,contact,email,password,type}=req.body;
    try{
        if(type==='Vendor'){
            const vendor=await Vendor.signup(name,location,contact,email,password,type);
            const token=createtoken(vendor._id);
            res.status(200).json({token,type});
        }
        else if(type==='Hospital'){
            const hospital=await Hospital.signup(name,location,contact,email,password,type);
            const token=createtoken(hospital._id);
            res.status(200).json({token,type});
        }
        else if(type==='Government'){
            const government=await Government.signup(name,location,contact,email,password,type);
            const token=createtoken(government._id);
            res.status(200).json({token,type});
        }

        else{
            throw new Error("Invalid type");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({error:err.message});
        
    }
}

const loginUser=async(req,res)=>{
    const {email,password,type}=req.body;
    try{
        if(type==='Vendor'){
            const vendor=await Vendor.login(email,password);
            const token=createtoken(vendor._id);
            res.status(200).json({token,type});
        }
        else if(type==='Hospital'){
            const hospital=await Hospital.login(email,password);
            const token=createtoken(hospital._id);
            res.status(200).json({token,type});
        }
        else if(type==='Government'){
            const government=await Government.login(email,password);
            const token=createtoken(government._id);
            res.status(200).json({token,type});
        }

        else{
            throw new Error("Invalid type");
        }
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}


module.exports={loginUser,signupUser};



