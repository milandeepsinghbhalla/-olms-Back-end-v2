const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  countryCode: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },


  password: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  supportingDocuments: {
    type: String,
    enum: ["Recieved", "Not-Recieved"],
    default: 'Not-Recieved',
  },
  isVerified: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
