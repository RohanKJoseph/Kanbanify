const prisma = require("../utils/prisma");

const getUserFromDB = async (where) => {
  return await prisma.user.findUnique({
    where: where,
  });
};

const addUserToDB = async (email, password, name, profileUrl) => {
  await prisma.user.create({
    data: {
      email,
      password,
      name,
      profileUrl
    },
  });
};

const addRefreshTokenToDB = async (userId, refreshToken, expiresAt) => {
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: expiresAt,
    },
  });
};

const getRefreshTokenToDB = async () => {
  return await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
      userId: payload.sub,
      expiresAt: { gt: new Date() },
    },
  });
};

const updateUserDataInDB = async (where, data) => {
  await prisma.user.update({
    where,
    data,
  });
};

module.exports = {
  getUserFromDB,
  addRefreshTokenToDB,
  getRefreshTokenToDB,
  addUserToDB,
  updateUserDataInDB
};
