const express = require("express");
const router = express.Router();
const YoutubeController = require("../controllers/youtube.controller");

router.get("/v1/detail", YoutubeController.Ddownr_metadata);
router.get("/v1/download", YoutubeController.Ddownr_download);
module.exports = router;
