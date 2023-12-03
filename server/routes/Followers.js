const express = require('express');
const router = express.Router();
const { Followers } = require('../models');

router.post('/follow', async (req, res) => {
  const followingPersonId = req.body;
  const savedFollowedPersonId = await Followers.create(followingPersonId);
  res.json(savedFollowedPersonId);
})

router.get('/get-follower-list/:id', async (req, res) => {
  const id = req.params.id;
  const extractedFollowingList = await Followers.findAll({
    where: { FollowerId: id }
  });

  res.json(extractedFollowingList);
})



module.exports = router;