const express = require("express");
const bodyParser =require("body-parser")
const router = express.Router();
const controller = require("../controllers/controller")
const authMiddle = require("../middlewares/auth")

const upload = require('../middlewares/blogImgMiddleware');
const passport = require("../middlewares/passport");


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// login / logout
router.get('/',authMiddle,controller.defultcontroler);
router.get('/signin',controller.signincontroller);
router.get('/signup',controller.signupcontroller);
router.get('/logoutadmin',controller.logoutadmincontroler);
router.post('/addAdmin',controller.addadmincontroller);
router.post('/signinadmin',passport.authenticate('local',{failureRedirect : "/signin"}),controller.signinadmincontroller);


// blog crud
router.get("/form",controller.formcontroller)
router.get("/showblog",controller.showblog)
router.get("/allblog",controller.allblog)
router.post("/addBlog",upload.single('blogImg'),controller.addBlog)
router.get('/editblog/:id',controller.editcontroler);
router.get("/deleteblog/:id",controller.deletcontroler);

// profile


router.get('/myprofile',controller.myprofile)
router.get('/editprofile/:id',controller.editprofile)
router.post('/updateProfile',controller.updateProfile)

// change pass
router.get('/changepass',controller.changepasscontroller)
router.post('/newpass',controller.newpass)
router.get("/forgotpass",controller.forgotpass)
router.post("/addfordata",controller.addfordata)
router.get("/otp",controller.opt)
router.post("/conformOtp",controller.conformOtp)
router.get("/newPassport/:t",controller.newPassport)
router.get("/newPassport",controller.newPassport)
router.post("/conformNewPass",controller.conformNewPass)

// catagory

router.get("/type",controller.typecontroller);
router.post("/typeaction",controller.typeaction)

router.get("/MailBox",controller.MailBox)

module.exports =router;