var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var mongoose = require('mongoose')
var methodOverride = require('method-override')
var User = require('./models/users')
var Campground = require('./models/campgrounds')
var Comment = require('./models/comments')
var seedDB = require('./seeds')
var flash = require('connect-flash')
var commentRoutes = require('./routes/comments')
var campgroundRoutes = require('./routes/campgrounds')
var indexRoutes = require('./routes/index')
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
mongoose.set('useUnifiedTopology', true)
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {
//  useNewUrlParser: true,
// });

mongoose.connect(
  'mongodb+srv://kiran_panjam:Version@02@cluster0.c9td0.mongodb.net/yelp_camp?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
)

//seedDB();

//passport configuration
app.use(
  require('express-session')({
    secret: 'Yamaha FZ 8789',
    resave: false,
    saveUninitialized: false,
  }),
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

app.use(indexRoutes)
app.use(commentRoutes)
app.use(campgroundRoutes)

app.listen(3003, process.env.IP, function () {
  console.log('The YelpCamp server has started!')
})
