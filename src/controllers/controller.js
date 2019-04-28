const db = require('../models/db');

class controller {
  constructor(files, outfitDetails) {
    this.files = files;
    this.outfitDetails = outfitDetails;
  }

  async init() {
    await db.connect();
    this.addToDB();
  }

  addToDB() {
    db.addUploadsToDB(this.files, this.outfitDetails);
  }
}

module.exports = controller;