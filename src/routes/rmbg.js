const express = require("express");
const router = express.Router();
const rmbg = require("../controllers/rmbg.controller");

router.get("/v1/remove-bg",rmbg.rmbg );
module.exports = router;
