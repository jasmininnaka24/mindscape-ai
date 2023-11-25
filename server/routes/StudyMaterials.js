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



router.get('/study-material-personal/:materialFor/:UserId/:id', async(req,res) => {
  const { materialFor, UserId, id} = req.params;
  const personalStudyMaterial = await StudyMaterials.findByPk(id, {
    where: { 
      materialFor: materialFor,
      UserId: UserId
    },
    order: [['id', 'DESC']]
  });

  res.json(personalStudyMaterial);

})



router.get('/study-material-group-category/:materialFor/:StudyGroupId', async(req, res) => {
  const { materialFor, StudyGroupId, UserId} = req.params;
  const latestMaterial = await StudyMaterials.findAll({
    where: { 
      materialFor: materialFor,
      StudyGroupId: StudyGroupId,
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


router.get('/shared-materials', async(req, res) => {
  const latestMaterial = await StudyMaterials.findAll({
    where: { 
      tag: 'Shared',
    },
    order: [['id', 'DESC']]
  });

  res.json(latestMaterial);
});

router.get('/shared-materials/:StudyMaterialsCategoryId', async(req, res) => {
  const { StudyMaterialsCategoryId } = req.params;
  const latestMaterial = await StudyMaterials.findAll({
    where: { 
      tag: 'Shared',
      StudyMaterialsCategoryId: StudyMaterialsCategoryId,
    },
    order: [['id', 'DESC']]
  });

  res.json(latestMaterial);
});



router.put('/update-data/:id', async (req, res) => {
  const materialId = req.params.id;
  const { isStarted } = req.body;

  try {
    const StudyMaterialsData = await StudyMaterials.findByPk(materialId);

    if (!StudyMaterialsData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    StudyMaterialsData.isStarted = isStarted;

    await StudyMaterialsData.save();

    console.log('Dashboard data updated successfully:', StudyMaterialsData);
    res.json(StudyMaterialsData);
  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update-tag/:id', async (req, res) => {
  const materialId = req.params.id;
  const { tag } = req.body;

  try {
    const StudyMaterialsData = await StudyMaterials.findByPk(materialId);

    if (!StudyMaterialsData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    StudyMaterialsData.tag = tag;

    const savedMaterialData = await StudyMaterialsData.save();

    console.log('Dashboard data updated successfully:', StudyMaterialsData);
    res.json(savedMaterialData);

  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update-study-performance/:id', async (req, res) => {
  const materialId = req.params.id;
  const { studyPerformance } = req.body;

  try {
    const StudyMaterialsData = await StudyMaterials.findByPk(materialId);

    if (!StudyMaterialsData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    StudyMaterialsData.studyPerformance = studyPerformance;

    const updatedStudyPerformance = await StudyMaterialsData.save();

    console.log('Dashboard data updated successfully:', updatedStudyPerformance);
    res.json(updatedStudyPerformance);
  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/latestMaterialStudied/:UserId', async (req, res) => {
  const { UserId } = req.params;

  try {
    const latestMaterial = await StudyMaterials.findAll({
      where: {
        UserId: UserId,
        materialFor: 'Personal',
        isStarted: 'true'
      },
      order: [['updatedAt', 'DESC']]
    });

    res.json(latestMaterial);
  } catch (error) {
    console.error('Error fetching latest material studied:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/latestMaterialStudied/group/:StudyGroupId/:UserId', async (req, res) => {
  const { UserId, StudyGroupId } = req.params;

  try {
    const latestMaterial = await StudyMaterials.findAll({
      where: {
        UserId: UserId,
        materialFor: 'Group',
        StudyGroupId: StudyGroupId,
        isStarted: 'true'
      },
      order: [['updatedAt', 'DESC']]
    });

    res.json(latestMaterial);
  } catch (error) {
    console.error('Error fetching latest material studied:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/all-study-material/:StudyMaterialsCategoryId', async(req, res) => {
  const { StudyMaterialsCategoryId} = req.params;
  const studyMaterials = await StudyMaterials.findAll({
    where: { 
      StudyMaterialsCategoryId: StudyMaterialsCategoryId,
    },
  });

  res.json(studyMaterials);
});



module.exports = router;