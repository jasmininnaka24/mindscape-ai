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

module.exports = router;