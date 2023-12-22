const router= require('express').Router();
const requireUser = require("../Middleware/requireUser");
const commentController = require("../Controllers/commentController");

router.post("/create",requireUser,commentController.createCommentController);
router.delete("/delete",requireUser,commentController.deleteCommentController);
router.get("/comments",requireUser,commentController.getCommentController);

module.exports = router;