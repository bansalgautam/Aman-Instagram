const router = require("express").Router();
const authController = require("../Controllers/authController");

router.post("/signup", authController.signupController);
router.post("/login", authController.loginController);
router.get("/refresh", authController.refreshTokenAccessController);
router.post("/logout", authController.logOutController);

module.exports = router;
