const prisma = require("../utils/prisma");

const addTypeToDB = async (name, projectId, position) => {
  return await prisma.type.create({
    data: { name, projectId, position },
  });
};

const deleteTypeFromDB = async (typeId) => {
  return await prisma.type.delete({ where: { id: typeId } });
};

const updateTypeFromDB = async (typeId, data) => {
  return await prisma.type.update({
    where: { id: typeId },
    data: data,
  });
};

module.exports = { addTypeToDB, deleteTypeFromDB, updateTypeFromDB };