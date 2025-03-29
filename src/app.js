const express = require('express');

const app = express();

app.use("/user", (req, res, next)=>{
    console.log("Handling the route user !");
    // res.send("Route Handler 1")
    next()

}, (req, res)=>{
    console.log("Handling the route user 2!");
    res.send("Route Handler 2")
})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000...");
    
});
