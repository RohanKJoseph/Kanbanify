const {
  addProjectToDB,
  getProjectsFromDB,
  getProjectFromDBById,
  deleteProjectFromDB,
} = require("../db/projectDB");

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
      await addProjectToDB(name, description, userId);
      res.status(200).json({ message: "Project created successfully" });
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
            color: type.color
          }
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
      };

      res
        .status(200)
        .json({
          message: "Project fetched successfully",
          project: responseData,
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error getting project: ${error.message}` });
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
}

module.exports = new ProjectController();
