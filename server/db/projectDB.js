const prisma = require("../utils/prisma");
const { defaultTypes } = require("../config/project");

const addProjectToDB = async (name, description, userId) => {
  // while creating a project, create default types for the project as well

  return await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        ownerId: userId,
        description,
      },
    });

    await Promise.all(
      defaultTypes.map((type) =>
        tx.type.create({
          data: {
            name: type.name,
            position: type.position,
            projectId: project.id,
          },
        })
      )
    );

    return project;
  });
};

const getProjectsFromDB = async (userId) => {
  return await prisma.project.findMany({
    where: { ownerId: userId },
    include: { user: true },
  });
};

const getProjectFromDBById = async (projectId) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      cards: true,
      user: true,
      types: true,
      projectMembers: {
        include: {
          user: true
        }
      }
    },
  });
};

const updateProjectInDB = async (projectId, name, description, userId) => {
  return await prisma.project.update({
    where: { id: projectId, ownerId: userId },
    data: { name, description },
  });
};

const deleteProjectFromDB = async (projectId) => {
  return await prisma.project.delete({ where: { id: projectId } });
};

const addMemberToProject = async (projectId, userId) => {
  return await prisma.projectMember.create({
    data: {
      projectId,
      userId,
    },
    include: {
      user: true
    }
  });
};

module.exports = {
  addProjectToDB,
  getProjectsFromDB,
  getProjectFromDBById,
  deleteProjectFromDB,
  addMemberToProject,
  updateProjectInDB,
};
