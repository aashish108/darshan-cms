const mongoose = require('mongoose');

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

const DarshanRawUploads = mongoose.model('darshan-raw-uploads', darshanRawUploadsSchema);
const DarshanProcessedUploads = mongoose.model('darshan-processed-uploads', darshanProcessedUploadsSchema);

module.exports = {
  DarshanRawUploads,
  DarshanProcessedUploads,
};
