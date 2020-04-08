//ALL MIDDLEWARE GOES HERE
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Campground middleware
middlewareObj.chechCampgroundOwnership = function(req, res, next) {
	//is user logged in 
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function (err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				//does user own the campgrounds?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	//if not, redirect
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}		
}

//Comment middleware
middlewareObj.chechCommentsOwnership = function(req, res, next) {
	//is user logged in 
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("back");
			} else {
				//does user own the campgrounds?
				if(foundComment.author.id.equals(req.user.id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	//if not, redirect
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}		
};

//is logged in MIDDLEWARE
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

module.exports = middlewareObj;