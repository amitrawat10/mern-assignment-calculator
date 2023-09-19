const express = require("express");
const calculationController = require("../controllers/calculation.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/create", authMiddleware, calculationController.createCalcuation);
router.get("/history", authMiddleware, calculationController.getCalculations);
router.delete("/:id", authMiddleware, calculationController.deleteCalculation);

module.exports = router;
