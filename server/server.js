const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const connectToDatabase = require("./db.js");
connectToDatabase();
const authRouter = require("./routes/auth.route.js");
const calcRouter = require("./routes/route.js");
const path = require("path");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL],
  })
);

app.use("/auth", authRouter);
app.use("/calculator", calcRouter);

app.use(express.static(path.join(__dirname, `../client/build`)));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, `../client/build/index.html`));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
