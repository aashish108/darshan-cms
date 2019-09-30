const moment = require('moment');
const schema = require('../../src/models/schemas');

const init = async () => {
  const darshanRawUploads = await new schema.DarshanRawUploads({
    time: moment().format(),
    files: 'file1.zip',
    outfitDetails: 'Outfit',
  });

  return darshanRawUploads.save();
};

module.exports = { init };
