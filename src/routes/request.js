const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const User = require('../models/user');



requestRouter.post("/sendConnectionRequest", userAuth, async(req, res)=>{
    console.log( "Sending a c");
    
})

module.exports = requestRouter;