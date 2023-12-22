const requireUser = require("../Middleware/requireUser");
const router = require("express").Router();
const userController = require("../Controllers/userController");

router.post("/follow", requireUser, userController.followOrUnfollowUser);
router.get("/getFeedData", requireUser, userController.getPostsOfFollowing);
router.get("/getExploreData", requireUser,userController.getPostsOfNotFollowing);
router.get("/getMyPosts", requireUser, userController.getMyPosts);
router.get("/getUserPost", requireUser, userController.getUserPosts);
router.delete("/deleteMyProfile", requireUser, userController.deleteMyProfile);
router.get("/getMyInfo", requireUser, userController.getMyInfo);
router.put('/',requireUser,userController.updateMyProfile);
router.post('/getUserProfile',requireUser,userController.getUserProfile);
router.post('/searchUser',requireUser,userController.searchUser);

module.exports = router;
