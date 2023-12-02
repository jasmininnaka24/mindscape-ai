const express = require('express');
const router = express.Router();
const { StudyGroupMembers } = require('../models')

// creating a member to the group
router.post('/add-member', async (req, res) => {
  const groupMemberDetails = req.body;
  const savedGroupMemberDetails = await StudyGroupMembers.create(groupMemberDetails);
  res.json(savedGroupMemberDetails);
})



router.get('/find-userId/:groupId/:UserId', async (req, res) => {
  const { groupId, UserId } = req.params;
  const listOfGroup = await StudyGroupMembers.findOne({
    where: {
      UserId: UserId,
      StudyGroupId: groupId
    }
  });
  res.json(listOfGroup);
})




// creating a member to the group
router.get('/get-members/:groupNameId', async (req, res) => {
  const { groupNameId } = req.params; // Access groupNameId from URL params
  try {
    const savedGroupMemberDetails = await StudyGroupMembers.findAll({
      where: {
        StudyGroupId: groupNameId,
      },
    });
    res.json(savedGroupMemberDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.delete('/remove-member/:groupNameId/:itemId', async (req, res) => {
  const { groupNameId, itemId } = req.params;

  try {
    const deletedGroupMember = await StudyGroupMembers.destroy({
      where: {
        UserId: itemId,
        StudyGroupId: groupNameId
      }
    });

    if (deletedGroupMember > 0) {
      res.json({ message: 'Group member removed successfully.' });
    } else {
      res.status(404).json({ error: 'Group member not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



// creating a member to the group
router.get('/get-materialId/:userId', async (req, res) => {
  const { userId } = req.params; 
  try {
    const savedGroupMemberDetails = await StudyGroupMembers.findAll({
      where: {
        UserId: userId,
      },
    });
    res.json(savedGroupMemberDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;