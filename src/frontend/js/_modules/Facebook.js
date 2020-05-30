class Facebook {
  constructor() {
    this.latestDarshanImages = latestDarshanImages;
    this.appId = '2316161761778187';
    this.fbAppVersion = 'v7.0';
    this.fbPageId = '161715481383';
    const fbScopesArray = [
      'pages_manage_posts',
      'pages_show_list',
      'publish_to_groups',
      'pages_read_engagement',
      'pages_read_user_content',
      'pages_manage_posts',
      'pages_manage_engagement',
    ];
    this.fbScopes = fbScopesArray.join();
    this.darshanUrl = 'https://www.iskcon-london.org/visit/see-our-shrine';
    this.baseAppUrl = 'https://apps.iskcon.london:8282';
    // this.baseImageUrl = 'https://apps.iskcon.london';
    this.baseImageUrl = 'https://localhost:3000';
    this.init();
    this.uploadToFacebookButton();
  }

  init() {
    FB.init({
      appId: this.appId,
      autoLogAppEvents: true,
      xfbml: true,
      version: this.fbAppVersion,
    });
  }

  uploadToFacebookButton() {
    const button = document.querySelector('form button');
    const self = this;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      self.login();
    });
  }

  login() {
    const self = this;
    FB.login((response) => {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');

        FB.api('/me', () => {
          console.log(`Good to see you, ${response.name}.`);

          FB.api(`${this.fbPageId}?fields=access_token`, 'get', {}, () => {
            if (!response || response.error) {
              console.log(response.error);
            } else {
              console.log(response);
              const token = response.authResponse.accessToken;
              document.getElementById('fbToken').value = token;
              this.post(self);
            }
          });
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      scope: this.fbScope,
      return_scopes: true,
      enable_profile_selector: true,
    });
  }

  post() {
    console.log('this.latestDarshanImages[0].outfitDetails', this.latestDarshanImages[0].outfitDetails);
    FB.api(
      `/${this.fbPageId}/feed`,
      'POST',
      {
        message: this.latestDarshanImages[0].outfitDetails,
        child_attachments: this.childAttachments(),
        link: this.darshanUrl,
      },
      (fbResponse) => {
        if (fbResponse && !fbResponse.error) {
          window.location.href = `${this.baseAppUrl}/darshan-app/stage3/facebook/upload/confirmation`;
        }
      },
    );
  }

  childAttachments() {
    const self = this;
    console.log('this.latestDarshanImages in childAtt', this.latestDarshanImages);
    return this.latestDarshanImages[0].files.map((imageObject) => ({ link: `${self.baseImageUrl}/darshan-cms/uploads/processed_images/${imageObject.filename}` }));
  }
}

export default Facebook;
