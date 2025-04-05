const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
// Get all the pending connection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    try {
       const loggedInUser = req.user;
       const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
       }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]) ;

       res.json({
        message: "Data fetched successfully",
        data: connectionRequest
       })



    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
})


module.exports = userRouter;