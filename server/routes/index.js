const express = require("express");
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");

router.use("/auth", authRoutes);
router.use("/project", projectRoutes);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
