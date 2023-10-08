const express = require('express');
const router = express.Router();
const { QuesAnsChoices } = require('../models')

router.post('/', async (req, res) => {
  const quesAnsChoicesData = req.body;
  const savedQACData = await QuesAnsChoices.create(quesAnsChoicesData);
  res.json(savedQACData);
})

router.get('/study-material/:studyMaterialID/:quesAnsID', async(req, res) => {
  const studyMaterialID = req.params.studyMaterialID;
  const quesAnsID = req.params.quesAnsID;
  const studyMaterial = await QuesAnsChoices.findAll({
    where: { QuesAnId: quesAnsID, StudyMaterialId: studyMaterialID }
  });

  res.json(studyMaterial);
});


module.exports = router;