const express = require('express');
const router = express.Router();
const { User, Token } = require('../models');
const sendEmail = require('../utils/sendEmail');
const resetPassword = require('../utils/resetPassword');
const crypto = require('crypto');
const bcrypt  = require('bcrypt');

const { sign, verify } = require('jsonwebtoken')

const jwtSecret = "mindscapeprojectkeysecret";

// registration
router.post('/', async (req, res) => {
  const { username, password, email, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const savedUserData = await User.create({
      username: username,
      password: hash,
      email: email,
      name: name,
    });

    const token = await Token.create({
      UserId: savedUserData.id,
      token: crypto.randomBytes(32).toString('hex'),
    });

    const url = `http://localhost:3000/users/${savedUserData.id}/verify/${token.token}`;
    // Use the correct frontend URL, adjust the port if needed

    await sendEmail(savedUserData.email, 'Verify Email', url);

    res.status(201).send({ message: "An email has been sent to your gmail account. Kindly check for verification." });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Verify email with token
router.get('/:id/verify/:token', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(400).send({ message: 'Invalid link' });
    }

    const token = await Token.findOne({
      where: {
        UserId: user.id,
        token: req.params.token,
      },
    });

    if (!token) {
      return res.status(400).send({ message: 'Invalid token' });
    }

    // Update the user's isVerified field
    await user.update({ isVerified: true });
    res.json(token)

    // Remove the token from the database
    // await token.destroy();

    // Redirect the user to the login page (you can change the URL as needed)
    // res.redirect(`/classification-questions/${user.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


// log in
router.post('/login', async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.json({ error: 'User does not exist' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ error: 'Wrong email and password combination.' });

    } else if (user.isVerified !== true) {
      // Generate a new verification token
      const token = await Token.create({
        UserId: user.id,
        token: crypto.randomBytes(32).toString('hex'),
      });

      // Construct the verification URL with the new token
      const url = `http://localhost:3000/users/${user.id}/verify/${token.token}`;
        
      // Use the correct frontend URL, adjust the port if needed
      await sendEmail(user.email, 'Verify Email', url);

      return res.status(400).send('An email has been sent to your gmail account. Kindly check for verification.');

    } else {


      const accessToken = sign({ id: user.id }, jwtSecret);

      return res.json({ accessToken, user: { id: user.id } });
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
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




router.post('/forgot-password', async (req, res) => {
  const {email} = req.body;

  try {
    const oldUser = await User.findOne({
      where: {
        email: email
      }
    })


    if (!oldUser) {
      return res.json({message: "User does not exist."})
    }

    const secret = jwtSecret + oldUser.password;
    const token =  sign({ email: oldUser.email, id: oldUser.id }, secret, {expiresIn: '5m'});

    // const link = `http://localhost:3000/reset-password/${oldUser.id}/${token}`;
    // console.log(link);


    // Construct the verification URL with the new token
    const url = `http://localhost:3000/reset-password/${oldUser.id}/${token}`;
  
    // Use the correct frontend URL, adjust the port if needed
    await sendEmail(email, 'Verify Email', url);

    // return res.status(400).send('An email has been sent to your gmail account. Kindly check for verification.');



  } catch (error) {

  }
})


router.get('/reset-password/:id/:token', async(req,res) => {
  const { id, token } = req.params;


  const oldUser = await User.findByPk(id)

  if (!oldUser) {
    return res.json({message: "User does not exist."})
  }

  const secret = jwtSecret + oldUser.password;


  try {

    const verifyData = verify(token,secret);
    res.json({email: verifyData.email});

  } catch (error) {
    console.log(error);
    res.json({message: "Not verified"});
  }

})

router.post('/reset-password/:id/:token', async(req,res) => {
  const { id, token} = req.params;
  const { password } = req.body;

  const oldUser = await User.findByPk(id)

  if (!oldUser) {
    return res.json({message: "User does not exist."})
  }

  const secret = jwtSecret + oldUser.password;


  try {

    const verifyData = verify(token,secret);
    // res.json({email: verifyData.email});

    const encryptedPassword = await bcrypt.hash(password, 10);


    const UserData = await User.findByPk(id);

    UserData.password = encryptedPassword;
    const updatedUserData = await UserData.save();
    
    res.json({message: "Password Updated"});
  } catch (error) {
    console.log(error);
    res.json({message: "Not verified"});
  }

})





router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  await user.destroy();
  res.json(user);
})

router.delete('/delete-token/:id', async (req, res) => {
  const tokenId = req.params.id;
  const token = await Token.findByPk(tokenId);
  await token.destroy();
  res.json(token);
})

module.exports = router;