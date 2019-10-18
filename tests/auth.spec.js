const { assert } = require('chai');
const controller = require('../src/controllers/controller.js');

describe('User auth testing', () => {
  it('user auth works in verifying correct credentials', async () => {
    const verifyUser = await controller.authUser('Sov108', 'Password');
    assert.exists(verifyUser.username, 'User/password are correct.');
  });

  it('user auth works in declining an auth if user password credentials are wrong', async () => {
    const verifyUser = await controller.authUser('Sov108', 'Passwords');
    assert.isFalse(verifyUser, 'User/password are incorrect and have not been authenticated.');
  });

  it('user auth works in declining an auth if username is wrong', async () => {
    const verifyUser = await controller.authUser('Sov10s8', 'Passwords');
    assert.isFalse(verifyUser, 'User/password are incorrect and have not been authenticated.');
  });
});
