const express = require("express");
const router = express.Router();
const aboutController = require("../controller/about.controller");
const profileController = require("../controller/profile.controller");
const registerController = require("../controller/register.controller");
const signInController = require("../controller/signin.controller");
const getUserController = require("../controller/getUser.controller");
const authenticate = require("../middelware/authenticate");
const logoutController = require("../controller/logout.controller");

router.post("/register", registerController);

router.post('/signin', signInController);
router.get("/about" ,authenticate ,aboutController);
router.get("/profile" , authenticate , profileController);
router.get("/user/:id" , getUserController);
router.get("/logout" , authenticate ,logoutController);


module.exports = router;



