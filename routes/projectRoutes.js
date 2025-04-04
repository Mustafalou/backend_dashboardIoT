// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, projectController.getProjects);
router.post('/', authenticateToken, projectController.createProject);
router.get('/:projectId/pages/:page/dropped-items', projectController.getDroppedItems);
router.post('/:projectId/pages/:page/dropped-items', projectController.UpdateDroppedItems);
router.post("/:projectId/data", projectController.getProjectData);
router.put("/:projectId/data", projectController.updateProjectData);
module.exports = router;
