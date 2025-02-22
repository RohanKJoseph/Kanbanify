const { addTypeToDB, deleteTypeFromDB, updateTypeFromDB } = require("../db/typeDB");

class TypeController {
  createType = async (req, res) => {
    try {
      const { name, position } = req.body;
      const projectId = req.params.projectId;
      const type = await addTypeToDB(name, projectId, position);
      res.status(200).json({ message: "Type created successfully", type });
    } catch (error) {
      res.status(500).json({ error: "Error creating type" });
    }
  }

  deleteType = async (req, res) => {
    try {
      const typeId = req.params.typeId;
      const type = await deleteTypeFromDB(typeId);
      res.status(200).json({ message: "Type deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting type" });
    }
  };

  updateType = async (req, res) => {
    try {
      const typeId = req.params.typeId;
      const { name, position } = req.body;
      const type = await updateTypeFromDB(typeId, { name, position });
      res.status(200).json({ message: "Type updated successfully", type });
    } catch (error) {
      res.status(500).json({ error: "Error updating type" });
    }
  };
}

module.exports = new TypeController();
