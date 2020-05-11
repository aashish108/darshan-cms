const request = require('request');
const slack = require('../helpers/slack');

let self;

class FacebookApi {
  constructor(darshan, req, res, next) {
    this.darshan = darshan;
    console.log('darshan object: ', darshan);
    this.req = req;
    this.res = res;
    this.next = next;
    this.fbPageToken = req.body.fbPageToken;
    // We use self to point to this so the this context is not lost for callbacks
    self = this;
  }

  init() {
    this.urlConstruction();
  }

  async urlConstruction() {
    console.log('this.darshan.outfitDetails: ', this.darshan[0].outfitDetails);
    const parts = [];
    for (const file of this.darshan[0].files) {
      parts.push(`{link:'${process.env.HOST}/darshan-cms/${file.destination}/${file.filename}'},`);
    }
    const parts2 = [];
    parts2.push('{link:"https://apps.iskcon.london/darshan-cms/uploads/processed_images/fc5457387c50f1e17c98a02f906438b7"},');
    parts2.push('{link:"https://apps.iskcon.london/darshan-cms/uploads/processed_images/ce981ea6e7c6904a294455aad3741638"},');
    const childAttachments = encodeURI(`[${parts2.join('')}]`);
    const url = `https://graph.facebook.com/v3.3/161715481383/feed?message=${this.darshan[0].outfitDetails}&child_attachments=${childAttachments}&link=https://www.iskcon.london&access_token=${this.fbPageToken}`;

    console.log(url);

    const options = {
      url,
      method: 'POST',
    };
    request(options, FacebookApi.callback);
  }

  static async callback(error, response, body) {
    slack.sendNotification(`<!here> Darshan images have been uploaded to Facebook with details: ${self.darshan.outfitDetails}`);
    console.log('error: ', error);
    console.log('response: ', response.statusCode);
    console.log('body: ', body);
    const bodyJson = await JSON.parse(body);
    console.log('json', bodyJson);
    console.log('error', bodyJson.error);
    if (!error && response.statusCode === 200) {
      return self.res.render('upload-to-facebook-confirmation', {
        title: 'Facebook post Successful',
        message: 'Latest darshan has been posted on Facebook',
        roles: self.req.user.roles,
      });
    }
    console.log('bodyJson.error.message', bodyJson.error.message);
    const errorRes = new Error();
    errorRes.statusCode = 500;
    errorRes.shouldRedirect = true;
    errorRes.message = bodyJson.error.message;
    return self.next(errorRes);
  }
}

module.exports = FacebookApi;
