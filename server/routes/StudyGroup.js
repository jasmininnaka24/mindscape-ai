const express = require('express');
const router = express.Router();
const { StudyGroup } = require('../models')

// rendering group names
router.get('/extract-all-group', async (req, res) => {
  const listOfGroup = await StudyGroup.findAll();
  res.json(listOfGroup);
})

router.get('/extract-all-group/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const listOfGroup = await StudyGroup.findByPk(roomId);
  res.json(listOfGroup);
})

// creating a group
router.post('/create-group', async (req, res) => {
  const groupDetails = req.body;
  const savedGroupDetails = await StudyGroup.create(groupDetails);
  res.json(savedGroupDetails);
})

// updating group name
router.put('/update-group', async (req, res) => {
  const groupId = req.body.id;
  const { groupName } = req.body;

  const updatedGroupName = await StudyGroup.findByPk(groupId);
  updatedGroupName.groupName === groupName;

  await updatedGroupName.save();
  res.json(updatedGroupName);
})

// deleting a group
router.delete('/delete-group/:id', async (req, res) => {
  const groupId = req.params.id;
  const deletedGroup = await StudyGroup.findByPk(groupId);
  await deletedGroup.destroy();
  res.json(deletedGroup);
})

module.exports = router;