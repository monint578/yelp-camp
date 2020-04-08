var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local").Strategy,
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverrite	= require("method-override");

var	Kruva 	= require("./models/campground"),
	seedDB 	= require("./seeds"),
	Comment = require("./models/comment"),
	User	= require("./models/user");

var commentRoutes 	 = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes 	 = require("./routes/index");

// seedDB();
mongoose.connect("mongodb://localhost/sudu_kruva", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverrite("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "miau miau miau",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("seccess");
	next()
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp server started");
});