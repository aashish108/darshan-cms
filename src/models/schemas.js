let mongoose = require('mongoose');
let validator = require('validator');

const darshanRawUploadsSchema = new mongoose.Schema({
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
  },
});

const darshanProcessedUploadsSchema = new mongoose.Schema({
  timeUploaded: {
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
  },
  darshanDate: {
    type: Date,
    required: true,
  },
});

const darshanRawUploads = mongoose.model('Darshan Raw Uploads', darshanRawUploadsSchema);
const darshanProcessedUploads = mongoose.model('Darshan Processed Uploads', darshanProcessedUploadsSchema);

module.exports = {
  darshanRawUploads,
  darshanProcessedUploads,
};
