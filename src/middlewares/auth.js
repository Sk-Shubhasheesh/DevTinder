const jwt = require('jsonwebtoken');
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    try {
        // read the tocken from the request cookie
        const { token } = req.cookies;
        if(!token){
            throw new Error("Token is not valid");
        }
        // validate the token
        const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodedObj;
        //find the user in db
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(404).send("ERROR: " + error.message);
    }

};

module.exports = {
    userAuth,
};