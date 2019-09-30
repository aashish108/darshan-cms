const Twitter = require('twitter');
const fileSystem = require('fs');

class TwitterApi {
  constructor(darshan) {
    this.darshan = darshan;
    console.log('darshan: ', darshan);
    console.log('darshan.files: ', darshan.files);
    this.mediaIds = [];
    this.filesUploaded = 0;
  }

  init() {
    this.newTwitterClient();
    this.darshanImages();
  }

  newTwitterClient() {
    this.client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_TOKEN_SECRET,
    });
  }

  darshanImages() {
    for (const image of this.darshan.files) {
      const data = fileSystem.readFileSync(`${__basedir}/uploads/processed_images/${image.filename}`);
      this.uploadMedia(data);
    }
  }

  uploadMedia(data) {
    this.client.post('media/upload', { media: data }, (error, media, response) => {
      if (!error) {
        // If successful, a media object will be returned.
        this.mediaIds.push(media.media_id_string);
        console.log('this.darshan.outfitDetails');
        console.log(this.darshan.outfitDetails);
        this.filesUploaded += 1;
        if (this.filesUploaded === this.darshan.files.length) {
          this.tweet();
        }
      } else {
        console.log('Úpload to Twitter failed: ', error);
      }
    });
  }

  tweet() {
    const status = {
      status: this.darshan.outfitDetails,
      media_ids: this.mediaIds.join(),
    };
    this.client.post('statuses/update', status, (error, tweet, response) => {
      if (!error) {
        console.log(tweet);
      }
    });
  }
}


module.exports = TwitterApi;
