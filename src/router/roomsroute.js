const express = require("express");
const apiController = require("../controller/api.controller");
const authenticate = require("../middelware/authenticate");
const uploadeImageController = require("../controller/uploadImageController");
const getCityController = require("../controller/getCity.controller");
const uploadRoomController = require("../controller/uploadRoom.controller");
const deleteRoomController = require("../controller/deleteRoom.controller");
const getRoomController = require("../controller/getRoom.controller");
const roomController = require("../controller/room.controller");
const similarRoomsController = require("../controller/similarRooms.controller");
const multer = require("multer");


const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });



router.get("/api" ,apiController);

router.post("/uploadImages" , authenticate ,upload.array("images", 10) , uploadeImageController);

router.get("/getcity" , getCityController);
router.post("/roomupload" , authenticate, uploadRoomController);

router.delete("/delete/myModel/:id" , authenticate ,deleteRoomController);
router.get("/userroom/:id" ,getRoomController);
router.get("/room" ,roomController);

router.get("/similarrooms" ,similarRoomsController);


module.exports = router;