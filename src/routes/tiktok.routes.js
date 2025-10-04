const express = require("express");
const router = express.Router();
const tiktokController = require("../controllers/tiktok.controller");

router.get("/v1/download", tiktokController.sstik);
module.exports = router;
