const express = require('express');
const router = express.Router();
const { QuesAns } = require('../models')

router.post('/', async (req, res) => {
  const data = req.body;
  const savedData = await QuesAns.create(data);
  res.json(savedData)
})

router.get('/study-material-mcq/:studyMaterialID', async(req, res) => {
  const studyMaterialID = req.params.studyMaterialID;
  const studyMaterial = await QuesAns.findAll({
    where: { StudyMaterialId: studyMaterialID }
  });

  res.json(studyMaterial);
});

router.put('/update-response-state/:studyMaterialID/:id', async (req, res) => {
  const id = req.params.id;
  const { response_state } = req.body; // Use response_state instead of responseState

  const studyMaterialID = req.params.studyMaterialID;
  const studyMaterial = await QuesAns.findByPk(id, {
    where: { StudyMaterialId: studyMaterialID }
  });
  studyMaterial.response_state = response_state; // Use response_state instead of responseState
  await studyMaterial.save();
  res.json(studyMaterial);
});

router.put('/update-stoppedAt/:studyMaterialID/:id', async (req, res) => {
  const id = req.params.id;
  const { stoppedAt } = req.body;

  const studyMaterialID = req.params.studyMaterialID;
  const studyMaterial = await QuesAns.findByPk(id, {
    where: { stoppedAt: stoppedAt, StudyMaterialId: studyMaterialID }
  });
  studyMaterial.stoppedAt = stoppedAt; 
  await studyMaterial.save();
  res.json(studyMaterial);
});




module.exports = router;