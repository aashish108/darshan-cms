const moment = require('moment');
const schema = require('../../src/models/schemas');

const init = async () => {
  const darshanProcessedUploads = await new schema.DarshanProcessedUploads({
    timeUploaded: moment().format(),
    files: [
    ],
    outfitDetails: 'Outfit',
    darshanDate: moment().format(),
  });

  return darshanProcessedUploads.save();
};

module.exports = { init };
