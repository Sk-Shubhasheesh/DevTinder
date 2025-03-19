const express = require('express');

const app = express();

// request handeling

app.use("/",(req, res)=>{
   res.send("Hello from the server")

})

// responce particuaar route
app.use("/test", (req, res)=>{
    res.send("Hello from the test route")
 
 })


app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000...");
    
});
