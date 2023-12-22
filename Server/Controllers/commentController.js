const Comment = require("../Models/Comment");
const Post = require("../Models/Post");
const { success, error } = require("../utils/responseWrapper");

const createCommentController = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req._id;

    const comment = await Comment.create({
      content,
      user: userId,
      post: postId,
    });

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    const data = await Comment.findById(comment._id).populate("user");

    return res.send(success(201, { data }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getCommentController = async (req, res) => {
  try {
    const { postId } = req.query;
    const comments = await Comment.find({ postId }).populate("user");

    return res.send(success(200, comments));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
  
const deleteCommentController=async(req,res)=>{
    try {
        const {commentId}=req.body;
        const userId=req._id;
        const comment =await Comment.findById(commentId);
        if(!comment){
            return res.send(error(404,"Comment Not Found"))
        }
        if(comment.user.toString !== userId){
            return res.send(error(403,"only owners can delete their comments"))
        }
        const postId = comment.post;
        const post = await Post.findById(postId);
        const index = post.comments.indexOf(commentId);
        post.comments.splice(index, 1);
        await post.save();
        await comment.remove();

        return res.send(success(200, "Comment deleted successfully"));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

module.exports = {
  createCommentController,
  getCommentController,
  deleteCommentController,
};
