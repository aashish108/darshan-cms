let mongoose = require('mongoose');
let validator = require('validator');

let darshanRawUploadsSchema = new mongoose.Schema({
  time: {
    type: Date, 
    required: true,
  },
  files: {
    type: String,
    required: true,
  },
  outfitDetails: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Darshan Uploads', darshanRawUploadsSchema)