const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/v1/darshan/latest', async (req, res) => {
  try {
    const latestDarshanImages = await controller.getLatestProcessedUploads(req, res);
    const data = {
      path: `${req.headers.host}/uploads/`,
      data: {
        ...latestDarshanImages,
      },
    };
    res.send(data);
    res.end();
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get('/v1/darshan/latest-two-days', async (req, res) => {
  try {
    const latestDarshanImages = await controller.getTwoLatestProcessedUploads(req, res);
    const data = {
      path: `${req.headers.host}/uploads/`,
      data: {
        ...latestDarshanImages,
      },
    };
    res.send(data);
    res.end();
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
