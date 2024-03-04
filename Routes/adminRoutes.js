const express = require('express');
const adminController = require('../Controllers/adminController');

const adminRouter = express.Router();

adminRouter.get('/user-approvals',adminController.getUserApprovals)


module.exports = adminRouter