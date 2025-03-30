const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://shubhasheeshkundu02:K0sPv6Q0IOT3Tscs@cluster0.gaaddax.mongodb.net/devTinder");
};

module.exports = connectDB;




