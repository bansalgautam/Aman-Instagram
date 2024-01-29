const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const authRouter = require("./Routers/authRouters");
const postRouter = require("./Routers/postRouters");
const usersRouter = require("./Routers/userRouter");
const commentRouter = require("./Routers/commentRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

dotenv.config({ path: "./.env" });

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 4000;

// --------------------------MIDDLEWARE---------------------------------
app.use(express.json({ limit: "50mb" }));
app.use(morgan("common"));
app.use(cookieParser());

// ---------- CORS ---------------------
const corsOptions = {
  origin: "*", // or a specific origin like 'http://example.com'
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", usersRouter);
app.use("/comment", commentRouter);

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "true");
  res.status(200).send("Ok from server");
});

dbConnect();

app.listen(PORT, () => {
  console.log(`Listening on the Port: ${PORT}`);
});

// atfcCs8i9O70DNdZ;
