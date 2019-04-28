let mongoose = require('mongoose');
let validator = require('validator');

let darshanUploadsSchema = new mongoose.Schema({
  time: {
    type: Date, 
    required: true,
  },
  files: {
    type: Array,
    required: true,
  },
  outfitDetails: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Darshan Uploads', darshanUploadsSchema)