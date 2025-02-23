const {
  addProjectToDB,
  getProjectsFromDB,
  getProjectFromDBById,
  deleteProjectFromDB,
  updateProjectInDB,
  getProjectMembersFromDB,
} = require("../db/projectDB");
const { getCardFromDB, assignUserToCard } = require("../db/cardDB");
const { getUserFromDB } = require("../db/userDB");

class ProjectController {
  createProject = async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        return res
          .status(400)
          .json({ error: "Name and description are required" });
      }
      const userId = req.user.id;
      const project = await addProjectToDB(name, description, userId);
      res
        .status(200)
        .json({ message: "Project created successfully", project });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error creating project: ${error.message}` });
    }
  };

  getProjects = async (req, res) => {
    try {
      const userId = req.user.id;
      const projects = await getProjectsFromDB(userId);

      const responseData = projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        updatedAt: project.updatedAt,
        createdAt: project.createdAt,
        user: {
          id: project.user.id,
          name: project.user.name,
          profileUrl: project.user.profileUrl,
        },
      }));
      res.status(200).json({
        message: "Projects fetched successfully",
        projects: responseData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error getting projects: ${error.message}` });
    }
  };

  getProjectById = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const project = await getProjectFromDBById(projectId);

      const categorizedCards = {};
      project.types.forEach((type) => {
        categorizedCards[type.id] = {
          cards: project.cards.filter((card) => card.typeId === type.id),
          type: {
            id: type.id,
            name: type.name,
            position: type.position,
          },
        };
      });

      const responseData = {
        id: project.id,
        name: project.name,
        description: project.description,
        updatedAt: project.updatedAt,
        createdAt: project.createdAt,
        cards: categorizedCards,
        user: {
          id: project.user.id,
          name: project.user.name,
          profileUrl: project.user.profileUrl,
        },
        members: project.projectMembers.map((member) => ({
          id: member.user.id,
          name: member.user.name,
          profileUrl: member.user.profileUrl,
        })),
      };

      res.status(200).json({
        message: "Project fetched successfully",
        project: responseData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error getting project: ${error.message}` });
    }
  };

  updateProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { name, description } = req.body;
      const userId = req.user.id;
      const project = await updateProjectInDB(
        projectId,
        name,
        description,
        userId
      );
      res
        .status(200)
        .json({ message: "Project updated successfully", project });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error updating project: ${error.message}` });
    }
  };

  deleteProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const userId = req.user.id;

      const project = await getProjectFromDBById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.ownerId !== userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this project" });
      }

      await deleteProjectFromDB(projectId);
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error deleting project: ${error.message}` });
    }
  };

  assignUser = async (req, res) => {
    try {
      const cardId = req.params.cardId;
      const projectId = req.params.projectId;
      const email = req.body.email;

      const project = await getProjectFromDBById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const card = await getCardFromDB(cardId);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }

      const user = await getUserFromDB({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMember = project.projectMembers.some(
        (member) => member.userId === user.id
      );
      if (!isMember) {
        return res
          .status(403)
          .json({ error: "User is not a member of this project" });
      }

      const updatedCard = await assignUserToCard(cardId, user.id);

      res.status(200).json({
        message: "User assigned to card successfully",
        card: updatedCard,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error assigning user to card: ${error.message}` });
    }
  };

  getProjectMembers = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const members = await getProjectMembersFromDB(projectId);
      const responseData = members.map((member) => ({
        id: member.user.id,
        email: member.user.email,
      }));
      res
        .status(200)
        .json({
          message: "Members fetched successfully",
          members: responseData,
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error getting project members: ${error.message}` });
    }
  };
}

module.exports = new ProjectController();
