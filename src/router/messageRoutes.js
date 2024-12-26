const express = require("express");

const {allMessages} = require("../controller/message.controllers");

const authenticate = require("../middelware/authenticate");

const router = express.Router();

router.route("/").get(authenticate ,allMessages);

module.exports = router;
