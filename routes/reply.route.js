const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer');

const { checkUser } = require('../middleware/auth.middleware.js');

const { reply, deleteReply } = require('../controllers/reply.controller.js');

const imgUpload = upload.single("image");

router
.use(checkUser)
.post('/', imgUpload, reply);

module.exports = router;