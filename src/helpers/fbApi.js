const request = require('request');

function urlConstruction(files, outfit, fbPageToken) {
  const parts = [];
  for (file of files) {
    // parts.push(`{link:'https://localhost/${file.destination}/${file.filename}'},`);
    parts.push(`{link:'https://images.all-free-download.com/images/graphiclarge/ethereal_image_185195.jpg'},`);
  }
  const childAttachments = encodeURI('[' + parts.join('') + ']');
  const url = 'https://graph.facebook.com/v3.3/161715481383/feed?message=test12345&child_attachments=' + childAttachments + '&link=https://www.iskcon.london&access_token='+fbPageToken;

  console.log(url);

  const options = {
    url: url,
    method: 'POST'
  };

  request(options, callback);
}

function callback(error, response, body) {
  console.log('Ín callback!');
  // console.log(response);
  console.log(body);
  if (!error && response.statusCode == 200) {
      console.log(body);
  } else if (error) {
    console.log(error);
  }
}

module.exports = {
  urlConstruction,
}










// var array = [
//   {
//     link: 'https://images.all-free-download.com/images/graphiclarge/ethereal_image_185195.jpg',
//     name: 'Test1',
//   },
//   {
//     link: 'https://images.all-free-download.com/images/graphiclarge/ethereal_image_185195.jpg',
//     name: 'Test2',
//   }
// ];

// var parts = [];
// for ( var i = 0; i < array.length; ++i ) {
//   parts.push(`{link:'${array[i].link}',name:'${array[i].name}'},`);
// }
// var url = '[' + parts.join('') + ']';
// console.log(encodeURI(url));