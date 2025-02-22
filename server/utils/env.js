require("dotenv").config();

if (!process.env.JWT_SECRET) {
  throw new Error("Please specify the JWT_SECRET environment variable");
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("Please specify the BUCKET_NAME JWT_REFRESH_SECRET variable");
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};
