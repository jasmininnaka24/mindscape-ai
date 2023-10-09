const express = require('express');
const router = express.Router();
const { StudyGroupMembers } = require('../models')

// creating a member to the group
router.post('/add-member', async (req, res) => {
  const groupMemberDetails = req.body;
  const savedGroupMemberDetails = await StudyGroupMembers.create(groupMemberDetails);
  res.json(savedGroupMemberDetails);
})

// remove a member from a group
router.delete('/remove-member/:id', async (req, res) => {
  const groupMemberId = req.params.id;
  const deletedGroupMember = await StudyGroupMembers.findByPk(groupMemberId);
  await deletedGroupMember.destroy();
  res.json(deletedGroupMember);
})


module.exports = router;