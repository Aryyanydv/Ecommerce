const express = require('express');
const router = express.Router();
const attributeController = require("../controller/attribute.controller");

router.post("/attribute", attributeController.createAttribute);

module.exports = router;
