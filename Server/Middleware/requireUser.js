const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");
const User = require("../Models/User");

module.exports = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    // return res.status(401).send("Authoriztion headers required");
    return res.send(error(401, "Authoriztion headers required"));
  }

  const acessToken = req.headers.authorization.split(" ")[1];
  //   console.log(acessToken);

  try {
    const decoded = jwt.verify(
      acessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id;

    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "User Not Found"));
    }

    next();
  } catch (e) {
    // console.log(e);
    // return res.status(401).send("Invalid Acccess Key");
    return res.send(error(401, "Invalid Acccess Key"));
  }
  // next();
};
