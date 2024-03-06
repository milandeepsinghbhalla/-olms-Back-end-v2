const Admin = require("../Models/Admin")
const User = require("../Models/User")
const jwt = require('jsonwebtoken');


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
    },
    verifyToken: (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ error: 'Access denied' });
        try {
          const decoded = jwt.verify(token, 'your-secret-key');
          req.userId = decoded.userId;
          next();
        } catch (error) {
          res.status(401).json({ error: 'Invalid token' });
        }
      }
}

module.exports = middlewares