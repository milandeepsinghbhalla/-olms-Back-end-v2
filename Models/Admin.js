const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: "User"
    },
    userApprovals: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
            ref: "User"
        }],
        default: []
    }
})

const Admin = mongoose.model("Admin", AdminSchema);

module.exports =  Admin;
