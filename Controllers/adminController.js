const Admin = require("../Models/Admin");
const User = require("../Models/User");

const adminController = {
    getUserApprovals: async (req,res,next)=>{
        // find admin and get the array of user approvals ids populate them and return
        console.log('adminId---',req.body.adminId)
        let foundUserApprovals = await Admin.findOne({
            userId:req.body.adminId
        },{userApprovals: 1, _id: 0}).populate('userApprovals',{
            
            password: 0,
            __v: 0
        })

        console.log(`user approvals from admin---- `, foundUserApprovals);
        res.status(200).json({ userApprovals: foundUserApprovals.userApprovals, message: 'Test Done Successfully...!!!'})
    }
}

module.exports = adminController;
