const { addTypeToDB, deleteTypeFromDB, updateTypeFromDB } = require("../db/typeDB");

class TypeController {
  createType = async (req, res) => {
    const { name } = req.body;
    const projectId = req.params.projectId;
    const type = await addTypeToDB(name, projectId);
    res.status(200).json({ message: "Type created successfully", type });
  }

  deleteType = async (req, res) => {
    const typeId = req.params.typeId;
    const type = await deleteTypeFromDB(typeId);
    res.status(200).json({ message: "Type deleted successfully", type });
  } 

  updateType = async (req, res) => {
    const typeId = req.params.typeId;
    const { name } = req.body;
    const type = await updateTypeFromDB(typeId, name);
    res.status(200).json({ message: "Type updated successfully", type });
  }
}

module.exports = new TypeController();
