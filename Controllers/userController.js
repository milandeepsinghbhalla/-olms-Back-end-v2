// import Address from "../Models/Address";
// import User from "../Models/User";

const Address = require("../Models/Address");
const Admin = require("../Models/Admin");

const User = require("../Models/User");

const jwt = require('jsonwebtoken');


const mongoose = require('mongoose');

const userController = {
  profileSetup: async (req, res, next) => {
    // all the logic for profile setup

    // payload 
    // {
    //   fullname,
    //   email,
    //   phnNumber,
    //   countryCode,
    //   role,
    //   companyName,
    //   streetAddress,
    //   city,
    //   state,
    //   zipCode
    // }

    // start transaction and create user without address
    // const session = await mongoose.startSession();

    // session.startTransaction();


    try {
      // check if user with email exists?
      let userFindResult = await User.find({
        email: req.body.email
      })
      if (userFindResult.length != 0) {
        let error = {
          status: 401,
          message: 'User with that email already exists...!!!'
        }
        throw error;
      }
      // check if user with phone number exist
      userFindResult = await User.find({
        countryCode: req.body.countryCode,
        number: req.body.phnNumber
      })
      if (userFindResult.length != 0) {
        let error = {
          status: 401,
          message: 'User with that phone number already exists...!!!'
        }
        throw error;
      }
      // no errors create user
      const newUser = new User();
      let { fullName, email, countryCode, phnNumber, role, companyName } = req.body
      newUser.fullName = fullName;
      newUser.email = email;
      newUser.countryCode = countryCode;
      newUser.number = phnNumber;
      newUser.role = role;
      newUser.companyName = companyName;

      let createdUser = await newUser.save();
      let createdUserId = createdUser._id;

      // now create address and add 
      const newAddress = new Address();
      let { companyAddress, state, city, zipCode } = req.body;
      newAddress.title = "Company's Address";
      newAddress.userId = createdUserId;
      newAddress.streetAddress = companyAddress;
      newAddress.city = city;
      newAddress.state = state;
      newAddress.zipCode = zipCode;
      newAddress.country = countryCode;

      const createdAdress = await newAddress.save();
      // find user and update addresss id
      const foundUser = await User.findById(createdUserId);
      foundUser.companyAddress = createdAdress._id;
      const finalUser = await foundUser.save();
      // commit transaction and send response

      // await session.commitTransaction();
      // session.endSession();

      // send email to user to reply with supporting documents
      // and add the userId to userApprovals in admin and send email notification to admin
      let admin = await Admin.findOne({
        userId: req.body.adminId
      })
      admin.userApprovals.push(createdUserId);
      let savedAdmin = await admin.save();
      return res.status(201).json({
        message: 'Profile Setup Completed Successfully...!!',
        userData: finalUser
      })
    }
    catch (err) {
      // await session.abortTransaction();
      // session.endSession();

      console.log('error- ', err);
      return res.status(err.status).json({
        message: err.message
      })
    }
    // finally {
    //   session.endSession();

    // }


  },
  login: async (req, res, next) => {
    // .... all the logic for login
    //payload
    // {
    //   email,
    //   password
    // }
    try {

      let foundUser = await User.findOne({
        email: req.body.email
      })
      if (!foundUser) {
        let myError = {
          status: 404,
          message: 'No user with that email...!!'
        }
        throw myError;

      }
      if (foundUser.password != req.body.password) {
        let myError = {
          status: 401,
          message: 'Wrong Password..!!'
        }
        throw myError
      }
      const token = jwt.sign({ userId: foundUser._id }, 'your-secret-key', { expiresIn: '10h' });

      return res.status(201).json({
        token: token,
        message: 'Logged In Successfully'
      })
    }
    catch (err) {
      console.log('error- ', err);
      return res.status(err.status).json({
        message: err.message
      })
    }
  },
  logout: (req, res, next) => {
    // .... all the logic for logout
  },
};

module.exports = userController;
