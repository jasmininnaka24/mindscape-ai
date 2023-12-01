const express = require('express');
const router = express.Router();
const { StudyMaterialsCategories } = require('../models'); // Ensure it's pluralized

router.post('/', async (req, res) => {
  const category = req.body;
  const addedCategory = await StudyMaterialsCategories.create(category);
  res.json(addedCategory);
});



router.get('/get-categoryy/:id', async (req, res) => {
  const id = req.params.id;
  const extractedUserDetails = await StudyMaterialsCategories.findByPk(id);
  res.json(extractedUserDetails)
})






router.get('/:categoryFor/:StudyGroupId', async (req, res) => {
  const { categoryFor, StudyGroupId } = req.params;
  const extractedCategories = await StudyMaterialsCategories.findAll({
    where: {
      categoryFor: categoryFor,
      StudyGroupId: StudyGroupId, 
    },
  });
  res.json(extractedCategories);
})

router.get('/personal/:categoryFor/:UserId', async (req, res) => {
  const { UserId } = req.params;
  const extractedCategories = await StudyMaterialsCategories.findAll({
    where: {
      categoryFor: 'Personal',
      UserId: UserId, 
    },
  });
  res.json(extractedCategories);
})





router.get('/get-all-study-material/:UserId', async (req, res) => {
  const { UserId } = req.params;
  const extractedCategories = await StudyMaterialsCategories.findAll({
    where: {
      categoryFor: 'Personal',
      UserId: UserId, 
    },
  });
  res.json(extractedCategories);
})


router.get('/personal-study-material/:categoryFor/:UserId', async (req, res) => {
  const { categoryFor, UserId } = req.params;
  const extractedCategories = await StudyMaterialsCategories.findAll({
    where: {
      categoryFor: categoryFor,
      UserId: UserId, 
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
  // console.log(id);
})


router.get('/shared-categories/:tag/:materialFor', async (req, res) => {
  const { tag } = req.params;
  const extractedCategories = await StudyMaterialsCategories.findAll({
    where: {
      tag: tag,
    },
  });
  res.json(extractedCategories);
})


router.get('/shared-material-category/:id/:categoryFor/:UserId', async (req, res) => {
  const { id } = req.params;
  const extractedCategory = await StudyMaterialsCategories.findOne({
    where: {
      id: id, 
    },
  });
  console.log(id);

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

router.put('/update-study-performance/:id', async (req, res) => {
  const categoryID = req.params.id;
  const { studyPerformance } = req.body;

  try {
    const StudyMaterialsCategoriesData = await StudyMaterialsCategories.findByPk(categoryID);

    if (!StudyMaterialsCategoriesData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    StudyMaterialsCategoriesData.studyPerformance = studyPerformance;

    const updatedStudyPerformance = await StudyMaterialsCategoriesData.save();

    console.log('Dashboard data updated successfully:', updatedStudyPerformance);
    res.json(updatedStudyPerformance);
  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
