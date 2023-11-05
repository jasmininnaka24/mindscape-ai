const express = require('express');
const router = express.Router();
const { DashRecommendations } = require('../models')

router.post('/', async (req, res) => {
  const recommendations = req.body;
  const SavedRecommendations = await DashRecommendations.create(recommendations); 
  res.json(SavedRecommendations)
})




module.exports = router;