const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

// ------------------------SIGNUP---------------------------
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      // return res.status(400).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      // return res.status(409).send("User is already registered");
      return res.send(error(409, "User is already registered"));
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hasedPassword,
    });

    // return res.status(201).json({
    //   user,
    // });
    return res.send(success(201, "New User is Created!"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// -------------------LOGIN-----------------------------
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // return res.status(404).send("User is not registered");
      return res.send(error(404, "User is not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // return res.status(403).send("Incorrect Password");
      return res.send(error(403, "Incorrect Password"));
    }

    try {
      const accessToken = generateAccessToken({
        _id: user._id,
      });
      const refreshToken = generateRefreshToken({
        _id: user._id,
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      // return res.status(201).json({ accessToken });
      return res.send(success(201, { accessToken }));
    } catch (e) {
      return res.send(error(500, e.message));
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// this api will check the refreshtoken validity and generate a new access token
const refreshTokenAccessController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh Token in cookie is required ");
    return res.send(error(401, "Refresh Token in cookie is required "));
  }

  const refreshToken = cookies.jwt;
  console.log("refresh", refreshToken);

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    // return res.status(401).send("Invalid REFRESH TOKEN");
    return res.send(error(401, "Invalid REFRESH TOKEN"));
  }
};

// =========================LOGOUT=========================================
const logOutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "User Logout"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// -------------------Json Web Token---------Internal Function-----------------
const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "1d",
  });
  console.log(token);
  return token;
};

// --------------------------REFRESH TOKEN----------------------------------
const generateRefreshToken = (data) => {
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: "1y",
  });
  console.log(token);
  return token;
};

module.exports = {
  loginController,
  signupController,
  refreshTokenAccessController,
  logOutController,
};
