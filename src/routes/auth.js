const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require('bcrypt');


// Signup API
authRouter.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added successfully!");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

});

// login API
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("EmailID is not Present")
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            const token = await user.getJWT(); 
            res.cookie("token", token, {
                expires: new Date(Date.now()+8*3600000)
            }); 
            res.send("LOGIN Successful!!")
        } else {
            throw new Error("Invalid Password!!");
        }

    } catch (error) {
        res.status(404).send("ERROR : " + error.message); // Fixed `err` to `error`
    }
});



module.exports = authRouter;