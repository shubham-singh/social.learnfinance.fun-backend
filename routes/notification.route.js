const express = require('express');
const router = express.Router();

const { getNotification } = require('../controllers/notification.controller');

router.get('/', getNotification);

module.exports = router;