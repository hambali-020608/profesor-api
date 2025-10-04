const express = require("express");
const router = express.Router();

router.use("/api/spotify", require("./spotify.routes"));
router.use("/api/tiktok", require("./tiktok.routes"));
router.use("/api/youtube", require("./youtube.routes"));
router.use("/api/movies", require("./movies.routes"));

module.exports = router;
