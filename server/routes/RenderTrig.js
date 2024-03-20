const express = require("express");
const router = express.Router();
const { RenderTrig } = require("../models");

router.get("/", async (req, res) => {
  const trig = await RenderTrig.findAll();
  res.json(trig);
});

module.exports = router;
