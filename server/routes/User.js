const express = require('express');
const router = express.Router();
const { User, Token } = require('../models');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt  = require('bcrypt');

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

    const token = await Token.create({
      UserId: savedUserData.id,
      token: crypto.randomBytes(32).toString("hex")
    });

    const url = `${process.env.BASE_URL}users/${savedUserData.id}/verify/${token.token}`;

    await sendEmail(savedUserData.email, 'Verify Email', url)

    res.status(201).send({message: "An email has been sent to your gmail account. Kindly check for verification."})
    res.json(savedUserData);
  });
});


router.get('/:id/verify/:token', async (req, res) => {
  try{
    const user = await User.findOne({
      
    })
  } catch (error) {

  }
})

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
        const assessToken = sign({ id: user.id}, "mindscapeprojectkeysecret");

        
        res.json({ accessToken: assessToken, user: { id: user.id} });

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
  const extractedUserDetails = await User.findByPk(userId, {
    attributes: {exclude: ["password"]}
  });
  res.json(extractedUserDetails)
})




router.put('/update-typeoflearner/:id', async (req, res) => {
  const userId = req.params.id;
  const { typeOfLearner } = req.body;

  try {
    const UserData = await User.findByPk(userId);

    if (!UserData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    UserData.typeOfLearner = typeOfLearner;

    const updatedUserData = await UserData.save();

    res.json(updatedUserData);

  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update-user/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, studyProfTarget, typeOfLearner } = req.body;

  try {
    const UserData = await User.findByPk(userId);

    if (!UserData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    UserData.username = username;
    UserData.studyProfTarget = studyProfTarget;
    UserData.typeOfLearner = typeOfLearner;

    const updatedUserData = await UserData.save();

    res.json(updatedUserData);

  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update-user-image/:id', async (req, res) => {
  const userId = req.params.id;
  const { userImage } = req.body;

  try {
    const UserData = await User.findByPk(userId);

    if (!UserData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    UserData.userImage = userImage;

    const updatedUserData = await UserData.save();

    res.json(updatedUserData);

  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  await user.destroy();
  res.json(user);
})

module.exports = router;