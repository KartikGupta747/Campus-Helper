const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.get('/studymaterials', resourceController.getStudyMaterials);
router.get('/previousyearpapers', resourceController.getPreviousYearPapers);
router.get('/departments', resourceController.getDepartments);
router.get('/departments/career-stats', resourceController.getDepartmentCareerStats);
router.get('/societies', resourceController.getSocieties);
router.get('/faqs', resourceController.getFAQs);
router.get('/lingo', resourceController.getLingo);
router.get('/events', resourceController.getEvents);
router.get('/josaacutoffs/:year', resourceController.getJosaaCutoffs);

module.exports = router;
