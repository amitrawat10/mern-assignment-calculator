const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token not found");
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) throw new Error("Someting went wrong while token verification");
    req._id = data.id;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};
