var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var Campground = require("../models/campgrounds");
const { route } = require("./comments");

//campgrounds home page which shows all campgrounds
router.get("/campgrounds", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err || !allCampgrounds) {
      console.log(err);
      res.redirect("campgrounds/index");
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      });
    }
  });
});

//new campground post route
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampGround = {
    name: name,
    price: price,
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
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//show campground details and more info
router.get("/campgrounds/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found!");
        console.log(err);
        res.redirect("back");
      } else {
        res.render("campgrounds/show", { campgrounds: foundCampground });
      }
    });
});

//edit campground route
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);

//update campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//destroy campground route
router.delete(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds");
      }
    });
  }
);

module.exports = router;
