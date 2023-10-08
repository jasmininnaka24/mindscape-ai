const express = require('express');
const router = express.Router();
const { StudyMaterials } = require('../models')

router.post('/', async (req, res) => {
  const studyMaterial = req.body;
  const createdstudyMaterial = await StudyMaterials.create(studyMaterial); 
  res.json(createdstudyMaterial)
})

router.get('/study-code/:StudyGroupId/:id', async (req, res) => {
  const { StudyGroupId, id } = req.params;
  const extractedStudyMaterial = await StudyMaterials.findByPk(id, {
    where: {
      StudyGroupId: StudyGroupId,
    },
  });

  res.json(extractedStudyMaterial);
});



router.get('/study-material/:materialFor/:StudyGroupId/:UserId/:id', async(req, res) => {
  const { materialFor, StudyGroupId, UserId, id} = req.params;
  const latestMaterial = await StudyMaterials.findAll({
    where: { 
      id: id,
      materialFor: materialFor,
      StudyGroupId: StudyGroupId,
      UserId: UserId
    },
    order: [['id', 'DESC']]
  });

  res.json(latestMaterial);
});

router.get('/study-material-category/:materialFor/:StudyGroupId/:UserId', async(req, res) => {
  const { materialFor, StudyGroupId, UserId} = req.params;
  const latestMaterial = await StudyMaterials.findAll({
    where: { 
      materialFor: materialFor,
      StudyGroupId: StudyGroupId,
      UserId: UserId
    },
    order: [['id', 'DESC']]
  });

  res.json(latestMaterial);
});


router.get('/study-material-category/:materialFor/:UserId', async(req, res) => {
  const { materialFor, UserId} = req.params;
  const latestMaterial = await StudyMaterials.findAll({
    where: { 
      materialFor: materialFor,
      UserId: UserId
    },
    order: [['id', 'DESC']]
  });

  res.json(latestMaterial);
});




module.exports = router;