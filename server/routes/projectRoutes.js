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


module.exports = router;
