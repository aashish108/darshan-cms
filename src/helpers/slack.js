const request = require('request-promise-native');

function sendNotification(text) {
  const options = {
    method: 'POST',
    uri: process.env.SLACK_URL,
    body: {
      text,
    },
    json: true,
  };
  request(options);
}

module.exports = {
  sendNotification,
};
