const express = require('express');
const userController = require("../Controllers/userController.js");

const userRouter = express.Router();

userRouter.post("/profile-setup", userController.profileSetup);
//userRouter.post("/login", userController.login);

// edited router

module.exports = userRouter;
