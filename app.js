var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var app = express();    

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//requiring routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
//servinam public director kad naudotu visus joje esancius failus siuo atveju - CSS
app.use(express.static(__dirname + "/public"));     
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIG   
app.use(require("express-session")({
    secret: "Taip",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
   
// kad passintu prisijungusio userio data i kiekviena route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");  
    res.locals.success = req.flash("success");
    next(); 
});     
            
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server has started"); 
});             