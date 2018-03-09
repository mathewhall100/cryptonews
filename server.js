// Dependencies

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsscrape");

// Set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "home" }));
app.set("view engine", "handlebars");


// Import routes

app.use( require("./controllers/fetch.js"));
app.use( require("./controllers/home.js"));




// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});