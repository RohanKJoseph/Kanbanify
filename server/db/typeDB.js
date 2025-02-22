const prisma = require("../utils/prisma");

const addTypeToDB = async (name, projectId) => {
  return await prisma.type.create({
    data: { name, projectId },
  });
};

const deleteTypeFromDB = async (typeId) => {
  return await prisma.type.delete({ where: { id: typeId } });
};

const updateTypeFromDB = async (typeId, name) => {
  return await prisma.type.update({ where: { id: typeId }, data: { name } });
};

module.exports = { addTypeToDB, deleteTypeFromDB, updateTypeFromDB };