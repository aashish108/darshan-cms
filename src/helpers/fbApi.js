const request = require('request');

class FacebookApi {
  constructor(darshan, req, res) {
    this.darshan = darshan;
    this.req = req;
    this.res = res;
    this.fbPageToken = req.body.fbPageToken;
  }

  init() {
    this.urlConstruction();
  }

  async urlConstruction() {
    const parts = [];
    for (const file of this.darshan[0].files) {
      parts.push(`{link:'${process.env.HOST}/${file.destination}/${file.filename}'},`);
    }
    const childAttachments = encodeURI(`[${parts.join('')}]`);
    const url = `https://graph.facebook.com/v3.3/161715481383/feed?message=${this.darshan.outfitDetails}&child_attachments=${childAttachments}&link=https://www.iskcon.london&access_token=${this.fbPageToken}`;

    console.log(url);

    const options = {
      url,
      method: 'POST',
    };
    try {
      await request(options, FacebookApi.callback);
      this.res.render('upload-to-facebook-confirmation', {
        title: 'Facebook post Successful',
        message: 'Latest darshan has been posted on Facebook',
        roles: this.req.user.roles,
      });
      this.res.end();
    } catch (e) {
      console.log(e);
    }
  }

  static callback(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
    } else if (error) {
      console.log(error);
    }
  }
}

module.exports = FacebookApi;
