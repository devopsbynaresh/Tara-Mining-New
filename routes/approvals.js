var express = require("express");
var router = express.Router({ mergeParams: true });
var { Equipment } = require("../models/equipment");
var {
  User,
  validateNewUserData,
  validateUpdatedUserData,
} = require("../models/user");
var fs = require("fs");
var middleware = require("../middleware");
var config = require("../config");

var nodemailer = require("nodemailer");
var _ = require("lodash");

var async = require("async");
var crypto = require("crypto");
let mail = require("../helpers/mail");

var transporter = nodemailer.createTransport({
  service: config.mail.service,
  auth: config.mail.auth,
});

router.get("/", async (req, res) => {
  return res.redirect("/approvals/users");
});

router.get("/users", middleware.isAdmin, async (req, res) => {
  User.find(function (err, users) {
    if (err) {
      req.flash(
        "error",
        `Users index error. Could not find users. ${err.message}`
      );
      return res.redirect("back");
    }
    res.render("approvals/users", { users: users });
  });
});
router.get("/equipments",middleware.isAdmin,  async (req, res) => {
  let equipments = await Equipment.find().populate(
    "features images datasheets specifications"
  );
  if (equipments.length > 0) {
    res.render("approvals/equipments", { equipments: equipments });
  } else {
    res.render("approvals/equipments", { equipments: [] });
  }
});

router.get(
  "/users/:id",
  middleware.isLoggedIn,
  middleware.checkUserAccountOwnership,
  function (req, res) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        req.flash("error", "User details error. User not found.");
        return res.redirect("back");
      }
      Equipment.find()
        .where("author.id")
        .equals(user._id)
        .exec(function (err, equipment) {
          if (err) {
            req.flash("error", "User details error. Equipment not found.");
            return res.redirect("back");
          }
          res.render("approvals/view-user", { user: user, equipment: equipment });
        });
    });
  }
);
// EDIT User Form
router.get(
  "/users/:id/edit",
  middleware.checkUserAccountOwnership,
  function (req, res) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        req.flash(
          "error",
          `User details error. User not found. ${err.message}`
        );
        return res.redirect("back");
      }
      res.render("approvals/edit-user", { user: user });
    });
  }
);
router.put(
  "/:id",
  async function (req, res) {
    const { error } = validateUpdatedUserData(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.status(400).redirect("/users/" + req.params.id);
    }
    if (!req.user.isAdmin) {
      req.body = _.omit(req.body, ["status"]);
    }
    if (req.user.isAdmin) {
      req.body.isAdmin = req.body.userType === 'admin' ? true : false
    }
    const mailOptions = {
      from: config.mail.auth.user,
      to: `${config.mail.auth.user}, ${req.body.email}`,
      subject: `User update for: ${req.body.firstname} ${req.body.lastname}`,
      html: `<p>Details for ${req.body.firstname} ${req.body.lastname}, have been updated.</p>`,
    };
    try {
      User.updateOne(
        { _id: req.params.id },
        { $set: req.body },
        function (err) {
          if (err) {
            req.flash("error", err.message);
            return res.status(400).redirect("/approvals/users/" + req.params.id);
          }
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              req.flash(
                "error",
                `Unable to send email. Pls try again later. Error: ${err.message}`
              );
              return res.status(400).redirect("/approvals/users/" + req.params.id);
            } else {
              res.send({ status: "Success", message: "User Details Updated Successfully" });
            }
          });
        }
      );
    } catch (error) {
      req.flash(
        "error",
        `Unable to update details. Please contact the system admin. Error: ${err.message}`
      );
      res.status(400).redirect("/approvals/users/" + req.params.id);
    }
  }
);



// UDATE Equipment Form
router.get(
  "/equipments/:id/edit",
  middleware.isLoggedIn,
  middleware.isActive,
  middleware.checkEquipmentOwnership,
  async function (req, res) {
    await Equipment.findById(req.params.id)
      .populate("features images datasheets specifications")
      .exec(async function (err, foundEquipment) {
        if (err || !foundEquipment) {
          req.flash(
            "error",
            "Sorry, show equipment details error encountered. Equipment not found."
          );
          res.redirect("back");
        } else {
          await User.findById(foundEquipment.author.id).exec(function (
            err,
            foundUser
          ) {
            if (err || !foundUser) {
              req.flash(
                "error",
                "Show equipment details error. Supplier details not found."
              );
              res.redirect("back");
            } else {
              foundUser.username = "";
              foundUser.password = "";
              foundUser.status = "";
              foundUser.companyReg = "";
              foundUser.vatNumber = "";
              res.render("approvals/edit-equip", {
                equipment: foundEquipment,
                user: foundUser,
              });
            }
          });
        }
      });
  }
);

// UPDATE equipment ROUTE
router.put(
  "/equipments/:id",
  middleware.isLoggedIn,
  function (req, res) {
    const { error } = validateEquipmentData(req.body.equipment);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.status(400).redirect("/approvals/equipment/" + req.params.id + "/edit");
    }

    Equipment.updateOne(
      { _id: req.params.id },
      { $set: req.body.equipment },
      function (err, updatedEquipment) {
        if (err) {
          req.flash(
            "error",
            "Update equipment error. Could not update equipment details."
          );
          return res
            .status(400)
            .redirect("/approvals/equipment/" + req.params.id + "/edit");
        } else {
          res.redirect("/approvals/equipment/" + req.params.id);
        }
      }
    );
  }
);


router.get("/equipments/:id", async function (req, res) {
  await Equipment.findById(req.params.id)
    .populate("features images datasheets specifications")
    .exec(async function (err, foundEquipment) {
      if (err || !foundEquipment) {
        req.flash(
          "error",
          "Sorry, show equipment details error encountered. Equipment not found."
        );
        res.redirect("back");
      } else {
        await User.findById(foundEquipment.author.id).exec(function (
          err,
          foundUser
        ) {
          if (err || !foundUser) {
            req.flash(
              "error",
              "Show equipment details error. Supplier details not found."
            );
            res.redirect("back");
          } else {
            foundUser.username = "";
            foundUser.password = "";
            foundUser.status = "";
            foundUser.companyReg = "";
            foundUser.vatNumber = "";
            res.render("approvals/view-equip", {
              equipment: foundEquipment,
              user: foundUser,
            });
          }
        });
      }
    });
});


router.delete("/:id", middleware.isAdmin, function (req, res) {
  console.log("DELETING");
  User.findOneAndDelete({ _id: req.params.id }, function (err) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/approvals/users");
    } else {
      return res.redirect("/approvals/users");
    }
  });
});

module.exports = router;
