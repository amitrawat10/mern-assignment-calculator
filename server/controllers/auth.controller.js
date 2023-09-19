const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
class AuthController {
  async register(req, res) {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, email & password are required",
      });
    }

    try {
      const userExists = await User.findOne({
        email,
      });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      const newUser = await User.create({ name, password, email });
      if (newUser) {
        const token = newUser.getToken();
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
          httpOnly: true,
        });
        return res.status(201).json({
          success: true,
          message: "User created.",
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

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password are required",
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }
      if (!(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Email or password is wrong",
        });
      }
      if (user) {
        const token = user.getToken();
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
          httpOnly: true,
        });
        return res.status(201).json({
          success: true,
          message: "User logged in",
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

  auth(req, res) {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (isVerified) {
      return res.status(200).json({
        success: true,
        message: "OK",
        isAuth: true,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        isAuth: false,
      });
    }
  }
}

module.exports = new AuthController();
