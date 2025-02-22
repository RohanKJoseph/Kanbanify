const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const typeController = require("../controllers/typeController");
const { authenticateJWT } = require("../middleware/auth");
const cardController = require("../controllers/cardController");
const inviteController = require("../controllers/inviteController");

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

// Card routes
router.post("/:projectId/cards/create", cardController.createCard);
router.delete("/:projectId/cards/:cardId", cardController.deleteCard);
router.put("/:projectId/cards/:cardId", cardController.updateCard);

//invite routes
router.post("/:projectId/invite", inviteController.inviteUser);     
router.put("/:projectId/accept-invite", inviteController.acceptInvite);        
// router.post("/:projectId/decline-invite", inviteController.declineInvite);

module.exports = router;
