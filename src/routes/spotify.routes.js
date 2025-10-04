const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotify.controller");

router.get("/v1/detail", spotifyController.spotidetail);
router.get("/v1/download", spotifyController.spotidownload);
module.exports = router;
