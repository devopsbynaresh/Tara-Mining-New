var express = require("express");
var router = express.Router();
var passport = require("passport");
const { User } = require("../models/user");
var { Equipment } = require("../models/equipment");
const equipmentService = require("../services/equipment.service");

const adminKey = "hkme03P@mauve";

// ROOT ROUTE
router.get("/", async function (req, res) {
  let all = [];
  let drilling = [];
  let blasting = [];
  let cleaning = [];
  let supporting = [];
  let equipments = await Equipment.find({
    $and: [{ approvalStatus: "approved" }],
  })
    .sort({ created_date: 1 })
    .populate("features images datasheets specifications");
  equipments.forEach(function (s) {
    if (s.mineActivity.includes("Drilling")) {
      let temp = s;
      temp.homePageFilter= "Drilling"
      drilling = [...drilling, temp]
    } else if (s.mineActivity.includes("Blasting")) {
      let temp = s;
      temp.homePageFilter= "Blasting"
      blasting = [...blasting, temp]
    } else if (s.mineActivity.includes("Cleaning")) {
      let temp = s;
      temp.homePageFilter= "Cleaning"
      cleaning = [...cleaning, temp]
    } else if (s.mineActivity.includes("Supporting")) {
      let temp = s;
      temp.homePageFilter= "Supporting"
      supporting = [...supporting, temp]
    }
  });
  all = [...drilling.slice(0,6), ...blasting.slice(0,6), ...cleaning.slice(0,6), ...supporting.slice(0,6) ];

  if (equipments.length > 0) {

    res.render("landing", {
      Drilling: drilling,
      Blasting: blasting,
      Cleaning: cleaning,
      Supporting: supporting,
      all: all,
    });
    // res.send({ status: "Success", all: equipments, Drilling: Drilling, Blasting: Blasting, Cleaning: Cleaning, Supporting: Supporting });
  } else {
    return res.redirect("/");
    // res.send({
    //   status: "Failure",
    //   message: "No Related products found.",
    // });
  }
});
// router.get("/", async function (req, res) {
//   let drilling = []
//   let blasting = []
//   let cleaning = []
//   let supporting = []
//   let all = []
//   try {
//     [[drilling], [blasting], [cleaning], [supporting],] = await Promise.all([
//       equipmentService.getEquipments(1, 3, undefined, {
//         mineActivityArr:
//           { $in: ['Drilling'] }
//       }, true),
//       equipmentService.getEquipments(1, 3, undefined, {
//         mineActivityArr:
//           { $in: ['Blasting'] }
//       }, true),
//       equipmentService.getEquipments(1, 3, undefined, {
//         mineActivityArr:
//           { $in: ['Cleaning'] }
//       }, true),
//       equipmentService.getEquipments(1, 3, undefined, {
//         mineActivityArr:
//           { $in: ['Supporting'] }
//       }, true),
//     ])
//   } catch (error) {
//     console.log(error)
//   }

//   drilling.forEach(item => { item.homePageFilter = 'Drilling' })
//   blasting.forEach(item => { item.homePageFilter = 'Blasting' })
//   cleaning.forEach(item => { item.homePageFilter = 'Cleaning' })
//   supporting.forEach(item => { item.homePageFilter = 'Supporting' })

//   console.log(drilling[0])

//   res.render("landing", { drilling, blasting, cleaning, supporting, all: [...drilling, ...blasting, ...cleaning, ...supporting] });
// });

// SHOW REGISTER FORM
router.get("/register", function (req, res) {
  res.render("register", { page: "register" });
});

// HANDLE SIGN UP LOGIC
router.post("/register", function (req, res) {
  var newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    companyName: req.body.company_name,
    address: {
      street1: req.body.address_1,
      street2: req.body.address_2,
      city: req.body.address_city,
      province: req.body.address_province,
      code: req.body.address_code,
    },
    phone: req.body.phone,
    website: req.body.website,
    companyReg: req.body.company_reg_no,
    vatNumber: req.body.vat_number,
    userType: req.body.user_type,
    mesmaId: req.body.memsa_id,
  });

  if (req.body.adminCode === adminKey) {
    newUser.isAdmin = true;
  }

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      console.log(err.message);
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {
      // req.flash("success", "Welcome " + user.username);
      res.redirect("/equipment");
    });
  });
});

// SHOW LOGIN FORM
router.get("/login", function (req, res) {
  res.render("login", { page: "login" });
});

// HANDLE LOGIN LOGIC
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/equipment",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// LOGOUT ROUTE
router.get("/logout", function (req, res) {
  req.logout();
  // req.flash("success", "Succesfully Logged Out!");
  res.redirect("/equipment");
});

router.get("/terms", function (req, res) {
  res.render("terms");
});

module.exports = router;
