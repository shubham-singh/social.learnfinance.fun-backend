const express = require('express');
const router = express.Router();

const { getNotification, readNotification, readAllNotification } = require('../controllers/notification.controller');

router
.get('/', getNotification)
.post('/', readNotification)
.post('/all', readAllNotification);

module.exports = router;