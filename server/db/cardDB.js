const prisma = require("../utils/prisma");

const addCardToDB = async (name, description, typeId, projectId) => {
  return await prisma.card.create({
    data: { name, description, typeId, projectId },
  });
};

const deleteCardFromDB = async (cardId) => {
  return await prisma.card.delete({ where: { id: cardId } });
};

const updateCardFromDB = async (cardId, name, description, typeId) => {
  return await prisma.card.update({
    where: { id: cardId },
    data: { name, description, typeId },
  });
};

module.exports = { addCardToDB, deleteCardFromDB, updateCardFromDB };
