const nodemailer = require('nodemailer');
const adminmodel = require("../model/admin")
const blogmodel = require("../model/blogmodel");
const typemodel = require("../model/type");
const bcrypt = require('bcrypt');
const fs = require("fs");
const flash = require("connect-flash");
const { log } = require("console");
const otpGenerator = require('otp-generator')
const crypto = require("crypto")
var us_id;


const transporter = nodemailer.createTransport({
   service: 'Gmail',
   port: 645,
   secure: true,
   auth: {
      user: 'parthvachhani2212@gmail.com',
      pass: 'sijsedhstslxcpso',
   }
});


// login / logout

const defultcontroler = async (req, res) => {
   req.flash('msg', 'Welcome to Deskbord')
   req.flash('err', 'err to Deskbord')
   if (req.cookies.singalId) {
      const blogs = await blogmodel.find();
      console.log(req.flash);
      res.render('index', { blogs, us_id, messages: req.flash('err') });
   } else {
      res.redirect('/signin');
   }



}

const signincontroller = (req, res) => {
   try {
      res.render("signin")
   } catch (err) {
      console.log("errr", err);
   }

}

const signupcontroller = (req, res) => {
   try {
      res.render("signup")
   } catch (err) {
      console.log("errr", err);
   }

}


const addadmincontroller = async (req, res) => {
   try {
      const { username, email, password } = req.body
      let saltRounds = 10;

      bcrypt.hash(password, saltRounds, async (err, hash) => {
         const addmin = new adminmodel({
            username,
            email,
            password: hash
         })

         await addmin.save();
      });

      res.redirect("/signin")
   } catch (err) {
      console.log("err", err);
   }

}

const signinadmincontroller = async (req, res) => {
   console.log("req admin ", req.body);

   const { email, password } = req.body
   const signinadmin = await adminmodel.find({ email })

   bcrypt.compare(password, signinadmin[0].password, function (err, result) {
      console.log("resut..", result);
      if (signinadmin.length != 0) {
         if (result) {
            res.cookie("singalId", signinadmin[0].id);
            us_id = signinadmin[0].id;
            res.redirect("/")
         } else {
            res.redirect("/signin")
         }
      } else {
         res.redirect("/signup")
      }

   });


}
const logoutadmincontroler = (req, res) => {
   res.clearCookie('singalId');
   res.redirect('/signin');
}

// blog controller   


const formcontroller = async (req, res) => {
   const typeadd = await typemodel.find({})
   console.log("addd", typeadd[0].id);

   res.render("form", { typeadd });
};

const showblog = async (req, res) => {
   try {
      const blogs = await blogmodel.find({}).populate("typeid").exec();
      res.render("showblog", { blogs, us_id });
   } catch (err) {
      console.log(err);
   }
};

const allblog = async (req, res) => {
   try {
      const blogs = await blogmodel.find({}).populate("typeid").exec();
      res.render("allblog", { blogs });
   } catch (err) {
      console.log(err);
   }
};



const addBlog = async (req, res) => {
   const { editId } = req.body;

   if (!editId) {
      let addblog = new blogmodel({
         name: req.body.name,
         title: req.body.title,
         typeName: req.body.typeName,
         rate: req.body.rate,
         blogImg: req.file.filename,
         userId: us_id,
         typeid: req.body.typeName


      });

      console.log("aaa", addblog);

      await addblog.save();
   } else {
      await blogmodel.findByIdAndUpdate(editId, {
         name: req.body.name,
         title: req.body.title,
         rate: req.body.rate,
         typeName: req.body.typeName,
      })
      console.log("Edit Complate...");
   }

   await res.redirect("/showblog");

};

const editcontroler = async (req, res) => {
   const id = req.params.id;
   const singleblog = await blogmodel.findById(id);
   const typeadd = await typemodel.find()
   res.render("edit", { singleblog, typeadd });
}

const deletcontroler = async (req, res) => {
   const id = req.params.id;

   let blogSingal = await blogmodel.findOne({ _id: id })
   fs.unlink(`./images/${blogSingal.blogImg}`, () => {
      console.log('delet succesfull...');
   })
   await blogmodel.deleteOne({ _id: id });
   res.redirect("/showblog");
}




// change password


const changepasscontroller = (req, res) => {
   res.render("changepass");
}
const newpass = async (req, res) => {
   const { opass, npass, cpass } = req.body;
   // console.log(req.body);

   const id = req.cookies.singalId;
   let saltRounds = 10;
   let data = await adminmodel.findOne({ _id: id });
   // console.log(data);

   bcrypt.compare(opass, data.password, async (err, result) => {
      console.log("result==", result);
      if (result) {
         if (npass == cpass) {
            bcrypt.hash(npass, saltRounds, async (err, hash) => {
               await adminmodel.findByIdAndUpdate({ _id: id }, {
                  password: hash
               })
            });

            res.redirect('/logoutadmin');
         }
      }
   });

}

// profile

const myprofile = async (req, res) => {

   const id = req.cookies.singalId;
   let profiledata = await adminmodel.findOne({ _id: id });

   res.render("myprofile", { profiledata })
}
const editprofile = async (req, res) => {
   const proId = req.params.id

   const proSIngaldata = await adminmodel.findById(proId);
   console.log("proid", proSIngaldata);


   res.render("editprofile", { proSIngaldata })
}

const updateProfile = async (req, res) => {

   const { profilId } = req.body;




   await adminmodel.findByIdAndUpdate(profilId, {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      bio: req.body.bio

   })

   res.redirect("/myprofile")


}


// type

const typecontroller = (req, res) => {
   res.render("type")
}

const typeaction = async (req, res) => {
   console.log("re", req.body);
   const typeData = new typemodel({
      typeName: req.body.typeName

   })

   await typeData.save();



   res.redirect("/form");
   // res.end();
}


// forgotpass 

const forgotpass = (req, res) => {
   res.render("forgotpass")
}



const opt = (req, res) => {
   res.render("otp")
}

const newPassport = (req, res) => {
   res.render("newPassport")
}

const addfordata = async (req, res) => {
   let { email } = req.body;
   await adminmodel.findOne({ email }).then((user) => {
      if (user != null) {
         const Otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
         res.cookie('userotp', Otp)

         const token = crypto.randomBytes(32).toString("hex");

         user.resetToken = token;
         user.expireToken = Date.now() + 3600000;

         user.save();

         const url = `http://localhost:3003/newPassport/${token}`;

         const message = `To resert Your Password click on this link ${url}`

         const { OTP, Link } = req.body

         if (Link) {

             // Email data
             const mailOptionsLink = {
               from: 'parthvachhani@gmail.com',
               to: user.email,
               subject: 'Reset Your Password Click Hear To Researt It ',
               text: message
            };

            // Send the email
            transporter.sendMail(mailOptionsLink, (error, info) => {
               if (error) {
                  console.error('Error sending email:', error);
               } else {
                  console.log('Email sent:', info.response);
               }
            })

            res.redirect("/MailBox")

         } else {

            // Email data
            const mailOptions = {
               from: 'parthvachhani@gmail.com',
               to: user.email,
               subject: 'Reset Password OTP',
               text: `Your Change Password OTP is ${Otp} , Please don't share your OTP other person`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                  console.error('Error sending email:', error);
               } else {
                  console.log('Email sent:', info.response);
               }
            });
            res.cookie('userotpId', user.id)
            res.redirect("/otp")
         }

      } else {
         res.redirect("/forgotpass")
      }

   }).catch((err) => {
      console.log("erroe", err);
   })

}

const MailBox = (req,res)=>{
   res.render("MailBox")
}

const conformNewPass = async (req, res) => {
   const { npass, cpass } = req.body;
   const { userotpId } = req.cookies
   // console.log("uuuuu",userId);
   let saltRounds = 10;

   if (npass == cpass) {
      bcrypt.hash(npass, saltRounds, async (err, hash) => {
         await adminmodel.findByIdAndUpdate({ _id: userotpId }, {
            password: hash
         })
      });

      res.redirect('/logoutadmin');
   }

}


const conformOtp = (req, res) => {
   const cookieotp = req.cookies.userotp;
   const serverOTP = req.body.OTP;

   if (cookieotp === serverOTP) {
      res.redirect('/newPassport')
   } else {
      res.redirect('back')
   }
};



module.exports = {
   defultcontroler, signincontroller, signupcontroller, addadmincontroller, signinadmincontroller, logoutadmincontroler,
   formcontroller, addBlog, showblog, editcontroler, deletcontroler, allblog,
   changepasscontroller, newpass,
   myprofile, editprofile, updateProfile,
   typecontroller, typeaction,
   forgotpass, addfordata, opt, conformOtp, newPassport, conformNewPass,MailBox
}