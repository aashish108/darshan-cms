class Facebook {
  constructor() {
    this.latestDarshanImages = window.latestDarshanImages;
    self = this;
    Facebook.init();
    this.login();
  }

  static init() {
    FB.init({
      appId: '2316161761778187',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v7.0',
    });
  }

  login() {
    FB.login((response) => {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');

        FB.api('/me', () => {
          console.log(`Good to see you, ${response.name}.`);

          FB.api('161715481383?fields=access_token', 'get', {}, () => {
            if (!response || response.error) {
              console.log(response.error);
            } else {
              console.log(response);
              const token = response.authResponse.accessToken;
              document.getElementById('fbToken').value = token;
              this.post();
            }
          });
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      scope: 'pages_manage_posts',
      return_scopes: true,
      enable_profile_selector: true,
    });
  }

  post() {
    FB.api(
      '/161715481383/feed',
      'POST',
      {
        message: this.latestDarshanImages[0].outfitDetails,
        child_attachments: this.childAttachments(),
        link: 'https://www.iskcon-london.org/visit/see-our-shrine',
      },
      (fbResponse) => {
        if (fbResponse && !fbResponse.error) {
          window.location.href = 'https://apps.iskcon.london:8282/darshan-app/stage3/facebook/upload/confirmation';
        }
      },
    );
  }

  childAttachments() {
    return this.latestDarshanImages.map((imageObject) => ({ link: `https://apps.iskcon.london/darshan-cms/uploads/processed_images/${imageObject.filename}` }));
  }
}

// export default Facebook;
