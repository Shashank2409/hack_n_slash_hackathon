"use strict";
const express = require("express");
const controller = require("./controller");


const router = express.Router();

router.route("/search_user").post(controller.usermethod);

router.route("/list_user").post(controller.allUserMethod);

router.route("/list_friends").post(controller.allFriendsMethod);

module.exports = router;