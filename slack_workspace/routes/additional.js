"use strict";
const express = require("express");

let router = express.Router();

router.route("/").post((req,res) => {
    res.send("Yes Yes");
});