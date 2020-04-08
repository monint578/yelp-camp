var express = require("express");
var router = express.Router();
var Kruva = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
	Kruva.find({}, function(err, allCampgrounds) {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/campgrounds", {sklypas: allCampgrounds});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, price: price, description: desc, author: author}
	Kruva.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Hurray, you just add a new campground!");
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Kruva.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.chechCampgroundOwnership, function(req, res){
	Kruva.findById(req.params.id, function (err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
		});
});
//UPDATE CAMPGROUD ROUTE
router.put("/:id", middleware.chechCampgroundOwnership, function(req, res){
	Kruva.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//DELETE CAMPGROUD ROUTE
router.delete("/:id", middleware.chechCampgroundOwnership, function(req, res){
	Kruva.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;