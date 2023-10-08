const express = require('express');
const router = express.Router();
const { QuesRev } = require('../models')

router.post('/', async (req, res) => {
  const data = req.body;
  const savedData = await QuesRev.create(data);
  res.json(savedData)
})

router.get('/study-material-rev/:studyMaterialID', async(req, res) => {
  const studyMaterialID = req.params.studyMaterialID;
  const studyMaterial = await QuesRev.findAll({
    where: { StudyMaterialId: studyMaterialID }
  });

  res.json(studyMaterial);
});

module.exports = router;