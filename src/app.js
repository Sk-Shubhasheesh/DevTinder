const express = require('express');
const connectDB =  require("./congif/database");
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async(req, res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User Added successfully!");
    } catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
    
})



// Get user by email
app.get("/user", async(req,res)=>{
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({emailId: userEmail});
        if(users.length === 0){
            res.status(404).send("User not found");

        }else{
            res.send(users);

        }
        
        
    } catch{
        res.status(400).send("Something went wrong:" + err.message);
    }
});

// feed API - get all the user from the database
app.get("/feed", async(req, res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        
    }

});




connectDB().then(()=>{
    console.log("Database connection established....");
    app.listen(3000, ()=>{
        console.log("Server is successfully listening on port 3000...");
        
    });

}).catch(err=>{
    console.error("Database cannot be connected due to some problem");
})



