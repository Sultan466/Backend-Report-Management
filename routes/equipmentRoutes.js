const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController')

router.get('/equipmentDailyStatus', equipmentController.equipmentDailyStatusController)
router.get('/equipmentInfo', equipmentController.equipmentInfoController)
router.post('/addEquipmentDailyStatus', equipmentController.addEquipmentDailyStatusController)

module.exports = router;