const prisma = require("../utils/prisma");
const { defaultTypes } = require("../config/project");

const addProjectToDB = async (name, description, userId) => {
  // while creating a project, create default types for the project as well
  await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        ownerId: userId,
        description,
      },
    });

    await Promise.all(
      defaultTypes.map((typeName) =>
        tx.type.create({
          data: {
            name: typeName,
            projectId: project.id,
          },
        })
      )
    );
  });
};

const getProjectsFromDB = async (userId) => {
  return await prisma.project.findMany({
    where: { ownerId: userId },
    include: { user: true},
  });
};

const getProjectFromDBById = async (projectId) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      cards: true,
      user: true,
      types: true,
    },
  });
};

const deleteProjectFromDB = async (projectId) => {
  return await prisma.project.delete({ where: { id: projectId } });
};

module.exports = {
  addProjectToDB,
  getProjectsFromDB,
  getProjectFromDBById,
  deleteProjectFromDB,
};
