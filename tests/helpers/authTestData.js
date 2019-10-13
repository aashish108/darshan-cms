const schema = require('../../src/models/users');

const init = async () => {
  const users = await new schema.Users({
    username: 'Sov108',
    password: 'Password',
  });

  try {
    await users.save();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = { init };
