const express = require('express');
const router = express.Router();
const { StudyMaterialsCategories } = require('../models'); // Ensure it's pluralized

router.post('/', async (req, res) => {
  const category = req.body;
  const addedCategory = await StudyMaterialsCategories.create(category);
  res.json(addedCategory);
});

router.get('/:categoryFor/:StudyGroupId/:UserId', async (req, res) => {
  const { categoryFor, StudyGroupId, UserId } = req.params;
  const extractedCategories = await StudyMaterialsCategories.findAll({
    where: {
      categoryFor: categoryFor,
      StudyGroupId: StudyGroupId, 
      UserId, 
    },
  });
  res.json(extractedCategories);
})

router.get('/:categoryFor/:UserId', async (req, res) => {
  const { categoryFor, UserId } = req.params;
  const extractedCategories = await StudyMaterialsCategories.findAll({
    where: {
      categoryFor: categoryFor,
      UserId, 
    },
  });
  res.json(extractedCategories);
})

router.get('/get-lastmaterial/:id/:categoryFor/:UserId', async (req, res) => {
  const { id, categoryFor, UserId } = req.params;
  const extractedCategory = await StudyMaterialsCategories.findOne({
    where: {
      id: id, 
      categoryFor: categoryFor,
      UserId: UserId,
    },
  });
  res.json(extractedCategory);
})

router.get('/get-lastmaterial/:id/:StudyGroupId/:categoryFor/:UserId', async (req, res) => {
  const { id, categoryFor, StudyGroupId, UserId } = req.params;
  const extractedCategory = await StudyMaterialsCategories.findOne({
    where: {
      id: id, 
      StudyGroupId: StudyGroupId,
      categoryFor: categoryFor,
      UserId: UserId,
    },
  });
  res.json(extractedCategory);
})



module.exports = router;
