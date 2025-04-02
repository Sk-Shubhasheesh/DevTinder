const express = require('express');
const connectDB = require("./congif/database");
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

const {userAuth} = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());


// Signup API
app.post("/signup", async (req, res) => {
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

})


// login API
app.post("/login", async (req, res) => {
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


// GET Profile APi
app.get("/profile",userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }



})


connectDB().then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000...");

    });

}).catch(err => {
    console.error("Database cannot be connected due to some problem");
})



