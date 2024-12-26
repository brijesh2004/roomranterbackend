const express = require("express");
const {accessChat , sendChat}  = require("../controller/chat.controller");

const authenticate = require("../middelware/authenticate");

const router = express.Router();

router.route("/").post(authenticate ,accessChat);
router.route("/send").post(authenticate ,sendChat);

module.exports = router;
