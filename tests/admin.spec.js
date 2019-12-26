const { assert } = require('chai');
const controller = require('../src/controllers/controller.js');

describe('Admin panel', () => {
  it('has the correct existing user role', async () => {
    const user = await controller.findUser('Sov108');
    return assert.include(user.roles, 'admin', 'roles array contains processor value');
  });

  it('does not have the processor role by default', async () => {
    const user = await controller.findUser('Sov108');
    return assert.notInclude(user.roles, 'processor', 'roles array contains processor value');
  });

  it('updates the user correctly', async () => {
    const username = 'Sov108';
    const password = 'Password';
    const roles = ['admin', 'processor'];
    const res = {};
    res.end = () => true;
    res.render = () => true;
    res.redirect = () => true;
    await controller.updateUser(username, password, roles, res);
    const user = await controller.findUser('Sov108');
    return assert.include(user.roles, 'processor', 'roles array contains processor value');
  });

  it('adds a new user correctly', async () => {
    const username = 'user2';
    const password = 'Password';
    const roles = ['uploader'];
    const res = {};
    res.end = () => true;
    res.render = () => true;
    res.redirect = () => true;
    await controller.addNewUser(username, password, roles, res);
    const user = await controller.findUser('user2');
    return assert.equal(user.username, 'user2', 'user2 exists');
  });

  it('does not have the admin role when user2 is created', async () => {
    const user = await controller.findUser('user2');
    return assert.notInclude(user.roles, 'admin', 'user2 does not have the admin role');
  });

  it('does have the uploader role when user2 is created', async () => {
    const user = await controller.findUser('user2');
    return assert.include(user.roles, 'uploader', 'user2 has the uploader role');
  });
});
