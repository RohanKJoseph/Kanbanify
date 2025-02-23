const prisma = require("../utils/prisma");

const addInviteToDB = async (projectId, userId) => {
  return await prisma.invite.create({
    data: { projectId, userId },
  });
};

const deleteInviteFromDB = async (projectId, userId) => {
  const invite = await prisma.invite.findFirst({
    where: {
      projectId: projectId,
      userId: userId,
    },
  });
  return await prisma.invite.delete({
    where: {
      id: invite.id,
    },
  });
};

const getInvitesFromDB = async (userId) => {
  return await prisma.invite.findMany({
    where: {
      userId: userId,
    },
  });
};

module.exports = { addInviteToDB, deleteInviteFromDB, getInvitesFromDB };
