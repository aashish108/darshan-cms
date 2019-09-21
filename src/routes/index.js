const { Router } = require('express');
// const request = require('request');
const router = Router();

const stage1 = require('./stage1');
const stage2 = require('./stage2');
const stage3 = require('./stage3');

router.use('/stage1', stage1);
router.use('/stage2', stage2);
router.use('/stage3', stage3);

module.exports = {
  router,
};
