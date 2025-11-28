var fs = require("fs").promises
var express = require("express");
var app = express();
app.use(express.static(__dirname));
app.use(express.json());
const port = 8013;

//
// Middleware
//

app.use(function (req, res, next) {
    // allow cross-origin access control
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");

    next();
});

//
// Route Service
//

// server ping
app.get("/", function(req, res) {
    console.log("Ping recieved\n")
    res.sendStatus(204);
});



// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port + "\n");
    }
});
