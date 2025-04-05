const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const User = require('../models/user');
const ConnectionRequest = require("../models/connectionRequest");



requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
    try {
      const fromUserId = req.user._id; 
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      
      const allowedStatus = ["ignored", "interested"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:  "Invalid status type " + status
        })
      }

      // if send request to himself
     

      // check touserId is present or not
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(400).json({message: "User not found"});
      }

      //If there is an existing Connection Request
      const  existingConnectionRequest  = await ConnectionRequest.findOne({
        $or: [
          {fromUserId, toUserId}  ,
          {fromUserId: toUserId, toUserId: fromUserId},
        ]
      });
      if(existingConnectionRequest){
        return res.status(400).send({message: "Connection Request Alredy Exists!!"});
      }

      // creating new instance
      const connectionRequest = new ConnectionRequest({
        fromUserId, 
        toUserId, 
        status
      })

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName+" is "+ status+" in "+ toUser.firstName,
        data,
      });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res)=>{
  try {
    const logedInUser = req.user;
    const {status, requestId} = req.params;
    // status should only accepted or rejected
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Status not allowed"
      });
    }
    // check requestId is present in DB or not
    // loggedIn User = toUserId
    // status = interested
    const connectRequest = await ConnectionRequest.findOne({
      _id:requestId,
      toUserId: logedInUser._id,
      status: "interested"
    });
    if(!connectRequest){
      return res.status(404).json({
        message: "Connection request not found"
      });
    }
    
    connectRequest.status = status;
    const data = await connectRequest.save();
    res.json({
      message:"Connection request is "+ status,
      data,
    })

  } catch (error) {
    res.status(404).send("ERROR : " + error.message);
  }

});

module.exports = requestRouter;