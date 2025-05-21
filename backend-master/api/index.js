
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const vendormedicineRoutes = require('../routes/vendormedicine');
const hospitalmedicineRoutes = require('../routes/hospitalmedicine');
const hospitalRoutes = require('../routes/hospital');
const vendorRoutes = require('../routes/vendor');
const shipmentRoutes = require('../routes/shipment');
const shipmentTrackingRoutes = require('../routes/shipmentTacking');
const feedbackRoutes = require('../routes/feedback');
const authRoutes = require('../routes/Auth');

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: '*'
    }
));
app.use('/api', vendormedicineRoutes);
app.use('/api', hospitalRoutes);
app.use('/api', vendorRoutes);
app.use('/api', shipmentRoutes);
app.use('/api', shipmentTrackingRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', authRoutes);
app.use('/api', hospitalmedicineRoutes);

mongoose.connect("mongodb+srv://verdantyagi:verdan1410@cluster0.xnqbaln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("connected to the database");
}).catch((error) => {
    console.log("error ", error);
});




app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


module.exports = app;
