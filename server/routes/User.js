const express = require('express');
const router = express.Router();
const { User } = require('../models')

router.get('/', async (req, res) => {
  const listOfUsername = await User.findAll();
  res.json(listOfUsername);
})

router.get('/get-user/:id', async (req, res) => {
  const userId = req.params.id;
  const extractedUserDetails = await User.findByPk(userId);
  res.json(extractedUserDetails)
})

router.post('/', async (req, res) => {
  const user = req.body; 
  const sevedUserData = await User.create(user);
  res.json(sevedUserData);
})

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  await user.destroy();
  res.json(user);
})

module.exports = router;