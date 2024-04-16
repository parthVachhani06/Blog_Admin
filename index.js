const express =require("express");
const app = express();
const router =require("./routes/router")
const db = require("./config/db")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");

const port= 3003
app.set('view engine', 'ejs');

app.use(express.static("assets"));
app.use(express.static("images"));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie : {secure:false}
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use(cookieParser());
app.use('/',router);






app.listen(port,(req,res)=>{
    console.log(`server start..${port}`);
})


