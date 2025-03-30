const express = require('express');
const connectDB =  require("./congif/database")
const app = express();

connectDB().then(()=>{
    console.log("Database connection established....");
    app.listen(3000, ()=>{
        console.log("Server is successfully listening on port 3000...");
        
    });

}).catch(err=>{
    console.error("Database cannot be connected due to some problem");
})



