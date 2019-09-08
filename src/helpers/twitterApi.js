const request = require('request');
const queryString = require('querystring');
const rp = require('request-promise-native');
const axios = require('axios');
const https = require('https');


// OAuth1.0 - 3-legged server side flow (Twitter example)
// step 1
//

// User wants to sign in to twitter

async function init() {
  await step1();
  return step2();
}

function step1a() {
  const data = JSON.stringify({
    callback: 'http://127.0.0.1:3000/node/darshan-app/twitter-auth/step3',
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
  })

    console.log(`data: ${data}`)
  const options = {
    hostname: 'api.twitter.com',
    port: 443,
    path: '/oauth/request_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      process.stdout.write(d)
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

async function step1() {
  // Original
  // const oauth = {
  //   callback: 'http://127.0.0.1:3000/node/darshan-app/twitter-auth/step3',
  //   consumer_key: process.env.CONSUMER_KEY,
  //   consumer_secret: process.env.CONSUMER_SECRET,
  // };
  // const url = 'https://api.twitter.com/oauth/request_token';
  // request.post({ url, oauth }, step2);
  // 
  // Axios
  var x = encodeURI('http://127.0.0.1:3000/node/darshan-app/twitter-auth/step3');
  axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://api.twitter.com/oauth/request_token?callback=${x}&consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
         accept: 'application/json'
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// request-promise-native
// 
// var options = {
//     method: 'POST',
//     uri: 'https://api.twitter.com/oauth/request_token',
//     body: {
//       callback: encodeURI('http://127.0.0.1:3000/node/darshan-app/twitter-auth/step3'),
//       consumer_key: process.env.CONSUMER_KEY,
//       consumer_secret: process.env.CONSUMER_SECRET,
//     },
//     json: true // Automatically stringifies the body to JSON
// };

// rp(options)
//     .then(function (parsedBody) {
//       // POST succeeded...
//       console.log('POST succeeded.')
//     })
//     .catch(function (e) {
//       // POST failed...
//       console.log('POST failed: ', e)
//     });
}

async function step2(e, r, body) {
  // Ideally, you would take the body in the response
  // and construct a URL that a user clicks on (like a sign in button).
  // The verifier is only available in the response after a user has
  // verified with twitter that they are authorizing your app.
  console.log('step 2.');
  console.log('e: ',e);
  // console.log('body: ', body);
  const reqData = queryString.parse(body);
  const uri = `https://api.twitter.com/oauth/authenticate?${queryString.stringify({ oauth_token: reqData.oauth_token })}`;
  console.log('req_data.oauth_token:', reqData.oauth_token);
  // redirect the user to the authorize uri
  console.log('ÚRL to be redirected to: ', uri);
  return uri;
  // step3(body, reqData);
}

// after the user is redirected back to your server
function step3(oauthToken, oauthVerifier) {
  const oauth = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: oauthToken,
    verifier: oauthVerifier,
  };
  const url = 'https://api.twitter.com/oauth/access_token';
  request.post({ url, oauth }, step3Response);
}

function step3Response(e, r, body) {
  // ready to make signed requests on behalf of the user
  console.log('Step 3 body: ', body);
  const permData = queryString.parse(body);
  const oauth = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: permData.oauth_token,
    token_secret: permData.oauth_token_secret,
  };
  const url = 'https://api.twitter.com/1.1/users/show.json';
  const qs = {
    screen_name: permData.screen_name,
    user_id: permData.user_id,
  };
  request.get({
    url, oauth, qs, json: true,
  }, (e2, r2, user2) => {
    console.log(user2);
  });
}

async function init() {
  step1();
}

module.exports = {
  step1,
  step1a,
  step3,
};
