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
      userId: userId
    }
  });
  console.log(projectId, userId, invite);
  return await prisma.invite.delete({
    where: {
      id: invite.id
    }
  });
};

module.exports = { addInviteToDB, deleteInviteFromDB };
