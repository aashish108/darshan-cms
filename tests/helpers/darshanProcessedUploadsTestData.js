const moment = require('moment');
const schema = require('../../src/models/schemas');

const init = async () => {
  const upload1 = await new schema.DarshanProcessedUploads({
    timeUploaded: moment().format(),
    files: [
      'file1.jpg', 'file2.jpg',
    ],
    outfitDetails: 'Outfit 1',
    darshanDate: moment().format(),
  });

  try {
    await upload1.save();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = { init };
