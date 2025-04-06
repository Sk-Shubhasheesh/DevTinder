const express = require('express');
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');


// const USER_SAFE_DATA = "firstName, lastName, photoUrl, about, skills";



// Get all the pending connection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest
        })



    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
})


// checking the all connection which is accepted
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]).
            populate("toUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId
        });

        res.json({
            data
        })

    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
})

// feed API
userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        // User should see all the user card except 
        // 0. his own card(profile)
        // 1. his connection which is alredy accepted connection'
        // 2. ignored people
        // 3. already send the connection request

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50: limit;
        const skip = (page-1)*limit;

        const loggedInUser = req.user;
        // Find all connection request that i have send + received
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName photoUrl about skills").skip(skip).limit(limit);

        res.send(users);




    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
})


// pagination
// feed?page=1&limit=10 => first 10 user 1-10 => skip(0).limit(10)
// feed?page=2&limit=10 => user 11-20 => skip(10).limit(10)
module.exports = userRouter;