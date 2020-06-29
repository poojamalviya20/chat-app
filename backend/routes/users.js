var express = require("express");
var router = express.Router();
const sequelize = require("../models/Users");
var jwt = require("jsonwebtoken");
var md5 = require("md5");
process.env.SECRET_KEY = "secret";
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (header !== "undefined") {
    const token = header;
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

router.post("/signUp", function(req, res) {
  let form = req.body.formValues;
  console.log("res", form);
  console.log("res", req.body);
  sequelize
    .query(
      "INSERT INTO user(user_type, status, name, email, phonenumber, password) VALUES (?,?,?,?,?,?)",
      {
        type: sequelize.QueryTypes.INSERT,
        raw: true,
        replacements: [
          "1",
          "1",
          req.body.name,
          req.body.email,
          req.body.phoneno,
          md5(req.body.password)
        ]
      }
    )
    .then(rows => {
      console.log(rows);
      res.json({ success: true });
    });
});

router.get("/check_email", (req, res) => {
  let value = req.param("email");
  sequelize
    .query("SELECT email FROM user WHERE email=?", {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      replacements: [value]
    })
    .then(rows => {
      console.log(rows);
      if (rows.length > 0) {
        res.json({ found: true, message: "Email Already Exist" });
      } else {
        res.json({ found: false, message: "" });
      }
    });
});

router.post("/login", function(req, res) {
  let email = req.body.email;
  sequelize
    .query("SELECT * FROM user WHERE email = ? and password = ? ", {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      replacements: [email, md5(req.body.password)]
    })
    .then(rows => {
      if (rows.length == 0) {
        res.json({
          success: false,
          message: "Wrong Username Or Password"
        });
      } else {
        let id = rows[0].id;
        let token = jwt.sign({ email: email, id: id }, process.env.SECRET_KEY, {
          expiresIn: "24h"
        });
        res.json({
          success: true,
          message: "Authentication successful!",
          token: token,
          rows
        });
      }
    });
});

router.get("/show_users", (req, res) => {
  sequelize
    .query("SELECT * FROM user ", {
      type: sequelize.QueryTypes.SELECT,
      raw: true
    })
    .then(rows => {
      res.json(rows);
    });
});

router.get("/show_user_by_id", (req, res) => {
  let id = req.param("id");
  sequelize
    .query("SELECT * FROM user where id = ?", {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      replacements: [id]
    })
    .then(rows => {
      res.json(rows);
    });
});

router.delete("/deleteUser", (req, res) => {
  let id = req.param("id");
  sequelize
    .query("DELETE FROM user WHERE id = ?", {
      type: sequelize.QueryTypes.DELETE,
      raw: true,
      replacements: [id]
    })
    .then(rows => {
      console.log(rows);
      res.json({ success: true });
    });
});

router.post("/update_user", (req, res) => {
  console.log("form values", req.body);
  let id = req.param("id");
  sequelize
    .query("UPDATE user set name=?,email=?,phonenumber=? where id =? ", {
      type: sequelize.QueryTypes.UPDATE,
      raw: true,
      replacements: [
        req.body.name,
        req.body.email,
        req.body.phonenumber,
        req.body.id
      ]
    })
    .then(rows => {
      console.log(rows[0]);
      res.json({ success: true });
    });
});

module.exports = router;
