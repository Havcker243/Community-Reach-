const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.send("Hello World");
})

// app.post



app.listen(3000, function() {
    console.log("Server is running on port 3000");
})
