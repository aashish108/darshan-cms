const Twitter = require('twitter');
const fileSystem = require('fs');
const slack = require('../helpers/slack');

let self;

class TwitterApi {
  constructor(darshan, req, res, next) {
    this.darshan = darshan;
    this.mediaIds = [];
    this.filesUploaded = 0;
    this.req = req;
    this.res = res;
    this.next = next;
    self = this;
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
    for (const image of this.darshan[0].files) {
      console.log('Twitter image file: ', `${__basedir}/uploads/processed_images/${image.filename}`);
      const data = fileSystem.readFileSync(`${__basedir}/uploads/processed_images/${image.filename}`);
      this.uploadMedia(data);
    }
  }

  async uploadMedia(data) {
    await this.client.post('media/upload', { media: data }, (error, media, response) => {
      console.log('Twitter upload media response: ', response.body);
      if (!error) {
        // If successful, a media object will be returned.
        this.mediaIds.push(media.media_id_string);
        this.filesUploaded += 1;
        if (this.filesUploaded === this.darshan[0].files.length) {
          this.tweet();
        }
      } else {
        console.log('Upload to Twitter failed: ', error);
        const errorRes = new Error();
        errorRes.statusCode = 500;
        errorRes.shouldRedirect = true;
        errorRes.message = error;
        self.next(errorRes);
      }
    });
  }

  async tweet() {
    const status = {
      status: this.darshan[0].outfitDetails,
      media_ids: this.mediaIds.join(),
    };
    this.client.post('statuses/update', status, async (error, tweet, response) => {
      const responseJSON = await JSON.parse(response.body);
      if (!error && !responseJSON.errors) {
        slack.sendNotification(`<!here> Darshan images have been uploaded to Twitter with outfit details: ${this.darshan[0].outfitDetails}`);
        return this.res.render('upload-to-twitter-confirmation', {
          title: 'Tweet Successful',
          message: 'Latest darshan has been tweeted',
          user: tweet.user.screen_name,
          tweetId: tweet.id_str,
          roles: this.req.user.roles,
        });
      }
      const errorRes = new Error();
      errorRes.statusCode = 500;
      errorRes.shouldRedirect = true;
      errorRes.message = responseJSON.errors[0].message || 'Tweet failed for an unknown reason';
      return self.next(errorRes);
    });
  }
}


module.exports = TwitterApi;
