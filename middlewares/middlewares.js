const Admin = require("../Models/Admin")
const User = require("../Models/User")

const middlewares = {
    createAdmin: async (req, res, next) => {
        let findAdmin = await User.findOne({
            email: 'milansinghdav@gmail.com'

        })
        let adminId = findAdmin._id
        // check admin already exist
        let foundAdmin = await Admin.find({
            userId: adminId
        })
        req.body.adminId = adminId
        if(foundAdmin.length !=0){
            console.log('admin exists')
            next();
        }
        else{

            let newAdmin = new Admin();
            newAdmin.userId = adminId
            await newAdmin.save()
            next();
        }
    }
}

module.exports = middlewares