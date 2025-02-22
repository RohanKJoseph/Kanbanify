const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");

router.use("/auth", authRoutes);
router.use("/project", projectRoutes);

module.exports = router;
