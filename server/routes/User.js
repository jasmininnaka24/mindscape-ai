const express = require('express');
const router = express.Router();
const { User } = require('../models')
const bcrypt  = require('bcrypt');
const { route } = require('./Tasks');

const { sign } = require('jsonwebtoken')

router.post('/', async (req, res) => {
  const { username, password, email, name } = req.body; 
  bcrypt.hash(password, 10).then(async (hash) => {
    const savedUserData = await User.create({
      username: username,
      password: hash,
      email: email, 
      name: name,
    });
    res.json(savedUserData);
  });
});


router.post('/login', async (req, res) => {
  const { password, email } = req.body; 

  const user = await User.findOne({
    where: { 
      email: email,
    }
  })

  if (!user) {
    res.json({ error: 'User does not exist' });
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.json({error: 'Wrong email and password combination.'});
      } else {
        const assessToken = sign({username: user.username, id: user.id}, "mindscapeprojectkeysecret");

        
        res.json(assessToken);
      }
    });
  }
});


router.get('/', async (req, res) => {
  const listOfUsername = await User.findAll();
  res.json(listOfUsername);
})

router.get('/get-user/:id', async (req, res) => {
  const userId = req.params.id;
  const extractedUserDetails = await User.findByPk(userId);
  res.json(extractedUserDetails)
})

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  await user.destroy();
  res.json(user);
})

module.exports = router;