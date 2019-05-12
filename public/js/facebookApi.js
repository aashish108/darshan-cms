window.fbAsyncInit = function() {
  FB.init({
    appId            : '2316161761778187',
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v3.3'
  });

  FB.login(function(response) {
    if (response.authResponse) {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');

        // FB.api('me/accounts', 'get', {}, function(response) {
        //   if (!response || response.error) {
        //     console.log(response.error);
        //   } else {
        //     console.log(response);
        //   }
        // });

        // FB.api('me?fields=id,name', 'get', {}, function(response) {
        //   if (!response || response.error) {
        //     console.log(response.error);
        //   } else {
        //     console.log(response);
        //   }
        // });

        // FB.api('161715481383/albums', 'get', {}, function(response) {
        //   if (!response || response.error) {
        //     console.log(response.error);
        //   } else {
        //     console.log(response);
        //   }
        // });

        FB.api('161715481383?fields=access_token', 'get', {}, function(response) {
          if (!response || response.error) {
            console.log(response.error);
          } else {
            console.log(response);
            const token = response.access_token;
            document.getElementById("fbToken").value = token; 
            // FB.api(
            //   "/161715481383/feed",
            //   "POST",
            //   {
            //       "published": "false",
            //       // "child_attachments": "[\n    {\n      link: \"https://yahoo.com\",\n      name: \"name -1\",\n      picture: \"https://images.all-free-download.com/images/graphiclarge/ethereal_image_185195.jpg\"\n    },\n    {\n      link: \"https://google.com\",\n      name: \"name - 2 \",\n      picture: \"https://images.all-free-download.com/images/graphiclarge/ethereal_image_185195.jpg\"\n    }\n  ]",
            //       "message": "test",
            //   },
            //   function (response) {
            //     if (!response || response.error) {
            //       console.log(response.error);
            //     } else {
            //       console.log(response);
            //     }
            //   }
            // );

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

fbAsyncInit();