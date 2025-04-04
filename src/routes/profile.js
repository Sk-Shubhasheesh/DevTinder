const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const { validateProfileEditData } = require("../utils/validation");

// GET Profile API
profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }



})

// Profile edit API
profileRouter.patch("/profile/edit", userAuth,async(req, res)=>{
    try {
       if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit Request");
       }
       const loggedInUser = req.user;
       Object.keys(req.body).forEach((key) =>(loggedInUser[key] = req.body[key]));

       await loggedInUser.save();

       res.json({
        messsage: `${loggedInUser.firstName} your profle updated successfully`, 
        data: loggedInUser})

    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
})


module.exports = profileRouter;
