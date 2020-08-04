var express = require("express");
var router = express.Router();

var Campground = require("../models/campgrounds");

//campgrounds home page which shows all campgrounds
router.get("/campgrounds", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      });
    }
  });
});

//new campground post route
router.post("/campgrounds", isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampGround = {
    name: name,
    image: image,
    description: desc,
    author: author,
  };
  //create a new campground and insert in db
  Campground.create(newCampGround, function (err, new_campground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//show campground new form to add new campground
router.get("/campgrounds/new", isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//show campground details and more info
router.get("/campgrounds/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campgrounds: foundCampground });
      }
    });
});

//is logged in function
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
