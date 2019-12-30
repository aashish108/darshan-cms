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
      // parts.push(`{link:'https://localhost/${file.destination}/${file.filename}'},`);
      parts.push("{link:'https://images.all-free-download.com/images/graphiclarge/ethereal_image_185195.jpg'},");
    }
    const childAttachments = encodeURI(`[${parts.join('')}]`);
    const url = `https://graph.facebook.com/v3.3/161715481383/feed?message=test12345&child_attachments=${childAttachments}&link=https://www.iskcon.london&access_token=${this.fbPageToken}`;

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
    console.log('Ín callback!');
    // console.log(response);
    console.log(body);
    if (!error && response.statusCode === 200) {
      // window.location.href = 'http://localhost:3000/node/darshan-app/stage3/facebook/upload/confirmation';
      console.log(body);
    } else if (error) {
      console.log(error);
    }
  }
}

module.exports = FacebookApi;
