class Facebook {
  constructor() {
    this.latestDarshanImages = latestDarshanImages;
    this.appId = '2316161761778187';
    this.fbAppVersion = 'v7.0';
    this.fbPageId = '161715481383';
    this.userId = '10157276554802300';
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
      xfbml: false,
      version: this.fbAppVersion,
      status: true,
    });
  }

  uploadToFacebookButton() {
    const button = document.querySelector('form button');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      this.login();
    });
  }

  login() {
    FB.login((response) => {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        console.log('inital user login FB response', response.authResponse);
        this.getPageTokenFromUserToken();
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      scope: this.fbScopes,
      return_scopes: true,
      enable_profile_selector: true,
    });
  }

  getPageTokenFromUserToken() {
    FB.api('/me', () => {
      console.log('Good to see you.');
      FB.api(`${this.userId}/accounts`, 'get', {}, (userAccountsResponse) => {
        console.log('userAccountsResponse', userAccountsResponse);
        const pageToken = userAccountsResponse.data.map((account) => {
          console.log(`FB account ${account.name} found.`);
          console.log('this.fbPageId', this.fbPageId);
          console.log('account.id', account.id);
          if (account.id === this.fbPageId) {
            return account.access_token;
          }
        });
        console.log(`FB Page account token is ${pageToken}`);
        document.getElementById('fbToken').value = pageToken;
        this.post(pageToken);
      });
    });
  }

  post(pageToken) {
    console.log('this.latestDarshanImages[0].outfitDetails', this.latestDarshanImages[0].outfitDetails);
    FB.api(
      `/${this.fbPageId}/feed?access_token=${pageToken}`,
      'POST',
      {
        message: this.latestDarshanImages[0].outfitDetails,
        child_attachments: this.childAttachments(),
        link: this.darshanUrl,
        multi_share_optimized: true,
      },
      (fbResponse) => {
        if (fbResponse && !fbResponse.error) {
          window.location.href = `${this.baseAppUrl}/darshan-app/stage3/facebook/upload/confirmation`;
        } else if (fbResponse.error) {
          console.log('FB error: ', fbResponse.error);
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
