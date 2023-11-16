const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/personnelController')

router.get('/personnelInfo', personnelController.personnelInfoController)
router.get('/personnelMonthlyStatus', personnelController.personnelMonthlyStatusController)
router.get('/personnelDailyStatus', personnelController.personnelDailyStatusController)
router.post('/addPersonnelDailyStatus', personnelController.addPersonnelDailyStatusController)
router.get('/personnelStatusInMonthRange', personnelController.personnelStatusInMonthRangeController)

module.exports = router;
