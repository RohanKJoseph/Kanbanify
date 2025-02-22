const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const typeController = require("../controllers/typeController");
const { authenticateJWT } = require("../middleware/auth");

router.use(authenticateJWT);
// Project routes
router.get("/", projectController.getProjects);
router.post("/create", projectController.createProject);
router.get("/:projectId", projectController.getProjectById);
router.delete("/:projectId", projectController.deleteProject);

// Type routes
router.post("/:projectId/types/create", typeController.createType);
router.delete("/:projectId/types/:typeId", typeController.deleteType);
router.put("/:projectId/types/:typeId", typeController.updateType);



module.exports = router;
