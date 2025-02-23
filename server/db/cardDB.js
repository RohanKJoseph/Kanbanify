const prisma = require("../utils/prisma");

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

module.exports = { addCardToDB, deleteCardFromDB, updateCardFromDB };
