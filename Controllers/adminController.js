const Admin = require("../Models/Admin");
const Carrier = require("../Models/Carrier");
const Shipper = require("../Models/Shipper");
const User = require("../Models/User");
// const bcrypt = require("bcrypt")
// const saltRounds = 10

const adminController = {
    getUserApprovals: async (req, res, next) => {
        // find admin and get the array of user approvals ids populate them and return
        console.log('adminId---', req.body.adminId)
        let foundUserApprovals = await Admin.findOne({
            userId: req.body.adminId
        }, { userApprovals: 1, _id: 0 }).populate('userApprovals', {

            password: 0,
            __v: 0
        })

        console.log(`user approvals from admin---- `, foundUserApprovals);
        res.status(200).json({ userApprovals: foundUserApprovals.userApprovals, message: 'Test Done Successfully...!!!' })
    },
    approveUsers: async (req, res, next) => {
        // create a mapping between roles and models
        // ['Shipper', 'Carrier', 'Dispatcher', 'Broker', 'Admin', 'Other']
        const rolesToModelsMapping = {
            shipper: Shipper,
            carrier: Carrier,
            admin: Admin,
            broker: 'will be added',
            dispatcher: 'will be added',
            other: 'will be added'
        }

        // payload
        // {
        //     selected: [userId1,userId2....]
        // }

        function randomPassword() {
            console.log(
                Math.random().toString(36).slice(2) +
                Math.random().toString(36)
                    .toUpperCase().slice(2));
        }
        let admin = await Admin.findOne({
            userId: req.body.adminId
        })
        const traverseSelected = async (userId) => {
            try {

                let foundUser = await User.findOne({
                    _id: userId
                })
                //get role
                let role = foundUser.role
                //generate random password
                //let salt = await bcrypt.genSalt(saltRounds)
                let password = randomPassword()
                //let hashedPassword = await bcrypt.hash(password, salt)
                // update password into user database
                foundUser.password = password;
                await foundUser.save();

                // create new role model
                console.log('role', role)
                console.log('roles to model mapping---', rolesToModelsMapping[role])
                let newRoleModel = new (rolesToModelsMapping[role])();
                newRoleModel.userId = userId
                await newRoleModel.save()
                // delete useraprrovals from admin
                let adminUserapprovals = [...admin.userApprovals];
                let startIndex = adminUserapprovals.indexOf(userId)
                adminUserapprovals.splice(startIndex, 1);
                admin.userApprovals = adminUserapprovals
                await admin.save();


            }
            catch (err) {
                console.log('error while approving---- ', err)
                return res.json({ message: 'some server error occured...!!' })
            }


        }
        for (let userId of req.body.selected) {
            await traverseSelected(userId)
        }
       

        return res.json({
            message: 'Approved Succefully...!!'
        })
    }
}

module.exports = adminController;
