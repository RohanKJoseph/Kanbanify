const prisma = require("../utils/prisma");

const getCommentsFromDB = async (cardId) => {
  return await prisma.comment.findMany({
    where: { cardId },
    select: { content: true, createdAt: true, user: true },
  });
};

const createCommentToDB = async (content, cardId, userId) => {
  return await prisma.comment.create({
    data: { content, cardId, userId },
  });
};

const deleteCommentFromDB = async (commentId) => {
  return await prisma.comment.delete({ where: { id: commentId } });
};

module.exports = {
  getCommentsFromDB,
  createCommentToDB,
  deleteCommentFromDB,
};
