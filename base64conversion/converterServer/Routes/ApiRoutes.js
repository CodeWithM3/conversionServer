const express = require("express");
const router = express.Router();
const User = require("../DbConnection/userSchema.js");
const Converted_Text = require("../DbConnection/convertedTestSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const decoder = require("../middlewares/auth");
const sendExtractedDoc = require("../queue/sendingContent");

const upload = require("../uploadDoc.js");

//Customer Registration
router.post("/sign_up", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    const hashedpassword = bcrypt.hash(password, 10);
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedpassword,
    });
    if (!firstname || !lastname || !email || !password) {
      res.json({ status: 400, message: "please enter all fields" });
    } else if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    } else if (password.length < 8) {
      res.json({
        status: 400,
        message: "Password should be atleast 8 characters",
      });
    } else {
      await newUser.save();
      return res.json({
        status: "ok",
        message: "User is registered successfully ",
      });
    }
  } catch (error) {
    console.log("An error occurred", error);
  }
});
//Customer Login
router.get("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const Login = await User.findOne({ email });
    if (!Login) {
      return res.send({ status: 400, message: "Incorrect email or password" });
    }
    const id = Login.id;
    const token = jwt.sign({ id }, "ghdjakujsbbuebkwki");
    return res.json(token);
  } catch (error) {
    res.json({ message: "User is not allowed" });
  }
});

//Customer upload file to be uploaded and extracted
router.post(
  "/uploadnextract",
  decoder,
  upload.single("Document"),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      let uploadedDocument = req.file;
      if (uploadedDocument) {
        // fetches the base directory from anywhere in the application

        const basedir = require.main.paths[0]
          .split("node_modules")[0]
          .slice(0, -1);
        let filePath = path.join(
          basedir,
          "uploads/" + uploadedDocument.filename
        );
        let extractedData = await fs.readFileSync(filePath, "utf-8");
        //sending file to through bull queue to converterserverB
        await sendExtractedDoc({ userId, extractedData });
        return res.send({
          status: 200,
          message: "Extracted file is been sent",
        });
      }
    } catch (error) {
      console.log("An error occurred with upload server", error);
    }
  }
);
//Extracted file is converted to base64
router.put("/convertedText", async (req, res) => {
  try {
    const id = req.body.userId;
    const searchUser = await User.findOne({ id });
    if (searchUser) {
      const convertedText = new Converted_Text({
        userId: id,
        convertedText: req.body.base64,
      });
      await convertedText.save();
      res.json({ message: "success" });
    }
  } catch (error) {
    console.log("An error occurred in storing converted test", error);
  }
});
//Displays all the user in database
router.get("/users", decoder, async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const userId = req.user.id;
    const customer = await Converted_Text.find({ userId })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json(customer);
  } catch (error) {
    console.log("An error in fetching all users", error);
  }
});

module.exports = router;
