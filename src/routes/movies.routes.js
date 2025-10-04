const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");


router.get('/v2/latest',movieController.justtalkLatest)
router.get('/v2/movies',movieController.justtalkMovies)
router.get('/v2/streaming',movieController.justtalkStreaming)
router.get('/v2/search',movieController.justtalkSearch)


module.exports = router;
