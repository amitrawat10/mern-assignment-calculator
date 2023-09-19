const Calculation = require("../models/calculation.model");
class CalculationController {
  async createCalcuation(req, res) {
    const { calculationName, calculation, result } = req.body;
    if (!calculationName || !calculation || !result) {
      return res.status(400).json({
        success: false,
        message:
          "Calculation name, caculation & calculation result are required",
      });
    }

    try {
      const newCalculation = await Calculation.create({
        calculationName,
        calculation,
        result,
        user: req._id,
      });

      if (newCalculation) {
        return res.status(201).json({
          success: true,
          message: "Calculation Saved.",
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async getCalculations(req, res) {
    try {
      const calculations = await Calculation.find({ user: req._id });
      return res.status(200).json({
        success: true,
        message: "Calculations fetched",
        data: calculations,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  async deleteCalculation(req, res) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        success: true,
        message: "Incomplete payload",
      });
    try {
      const calculations = await Calculation.deleteOne({
        _id: id,
        user: req._id,
      });
      return res.status(200).json({
        success: true,
        message: "Calculations fetched",
        data: calculations,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
}

module.exports = new CalculationController();
