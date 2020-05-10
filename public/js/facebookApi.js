window.fbAsyncInit = () => {
  FB.init({
    appId: '2316161761778187',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.3',
  });

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
          }
        });
      });
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, {
    scope: 'manage_pages,pages_show_list,publish_pages',
    return_scopes: true,
    enable_profile_selector: true,
  });
};
