const prisma = require("../utils/prisma");

const getCardFromDB = async (cardId) => {
  return await prisma.card.findUnique({
    where: { id: cardId },
    select: {
      title: true,
      description: true,
      comments: true,
      type: true,
      assigned: true,
    },
  });
};

const addCardToDB = async (title, description, typeId, projectId) => {
  return await prisma.card.create({
    data: { title, description, typeId, projectId },
  });
};

const deleteCardFromDB = async (cardId) => {
  return await prisma.card.delete({ where: { id: cardId } });
};

const updateCardFromDB = async (cardId, title, description, typeId) => {
  return await prisma.card.update({
    where: { id: cardId },
    data: { title, description, typeId },
  });
};

const assignUserToCard = async (cardId, userId) => {
  return await prisma.card.update({
    where: { id: cardId },
    data: {
      assigned: {
        connect: { id: userId }
      }
    },
  });
};

module.exports = {
  getCardFromDB,
  addCardToDB,
  deleteCardFromDB,
  updateCardFromDB,
  assignUserToCard,
};
