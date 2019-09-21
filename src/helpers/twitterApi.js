const Twitter = require('twitter');
const fileSystem = require('fs');

class TwitterApi {

  constructor(darshan) {
    this.darshan = darshan;
    console.log('darshan: ', darshan);
    console.log('darshan.files: ', darshan.files);
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
      let data = fileSystem.readFileSync(`${__basedir}/uploads/processed_images/${image.filename}`);
      this.uploadMedia(data);
    }
  }

  uploadMedia(data) {
   // client.get(path, params, callback);
  // client.post(path, params, callback);
  // client.stream(path, params, callback);
    this.client.post('media/upload', { media: data }, (error, media, response) => {
      if (!error) {
        // If successful, a media object will be returned.
        console.log(media);
        // // Lets tweet it
        // const status = {
        //   status: 'I am a tweet',
        //   media_ids: media.media_id_string, // Pass the media id string
        // };
        // console.log(status);
      } else {
        console.log('Úpload to Twitter failed: ', error);
      }
    });
  }

  tweet(status) {
    this.client.post('statuses/update', status, (error, tweet, response) => {
      if (!error) {
        console.log(tweet);
      }
    });
  }
}


module.exports = TwitterApi;
