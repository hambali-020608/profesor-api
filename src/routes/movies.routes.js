const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");


router.get('/api/movies/v2/latest',movieController.justtalkLatest)
router.get('/api/movies/v2/movies',movieController.justtalkMovies)
router.get('/api/movies/v2/streaming',movieController.justtalkStreaming)
router.get('/api/movies/v2/search',movieController.justtalkSearch)


module.exports = router;
