function updateFileNames() {
  const files = document.getElementById("files").files;
  let html = '';
  document.getElementById("filesNames").innerHTML = '';
  console.log(files);
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      html += files[i].name+'<br>';
    }
  }
  else {
    html = 'No files uploaded yet.'
  }
  document.getElementById("filesNames").innerHTML = html;
}

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
       
       FB.api('me?fields=id,name', 'get', {}, function(response) {
         if (!response || response.error) {
           console.log(response.error);
         } else {
           console.log('Post ID: ' + response.id);
           console.log(response);
         }
       });

       FB.api('161715481383/albums', 'get', {}, function(response) {
        if (!response || response.error) {
          console.log(response.error);
        } else {
          console.log(response);
        }
      });
     });
    } else {
     console.log('User cancelled login or did not fully authorize.');
    }
  });
};

updateFileNames();