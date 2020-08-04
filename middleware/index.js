var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
          // res.render("campgrounds/edit", { campground: foundCampground });
        } else {
          req.flash("error", "You do not have right permissions!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please login!");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "No comment found!");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
          // res.render("campgrounds/edit", { campground: foundCampground });
        } else {
          req.flash("error", "You do not have right permissions!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please login!");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login to proceed further!");
  res.redirect("/login");
};

module.exports = middlewareObj;
