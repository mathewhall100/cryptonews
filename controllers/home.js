var express = require("express");
var routerHome = express.Router();

// require the customer models (   ) to use for database interaction

//var db = require("../models");

// ====================================
// create routes with logic as required
// ===================================


// route for /

routerHome.post("/save", function (req, res) {

        console.log(req.body.article)


});



// export routes for use in server.js

module.exports = routerHome;
