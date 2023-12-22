const Post = require("../Models/Post");
const User = require("../Models/User");
const Comment = require("../Models/Comment");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Util");
const cloudinary = require("cloudinary").v2;

const followOrUnfollowUser= async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const curUserId = req._id;

        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId);

        if (curUserId === userIdToFollow) {
            return res.send(error(409, "Users cannot follow themselves!"));
        }

        if (!userToFollow) {
            return res.send(error(404, "User to follow not found"));
        }

        if (curUser.followings.includes(userIdToFollow)) {
            const followingIndex = curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex, 1);

            const followerIndex = userToFollow.followers.indexOf(curUserId);
            userToFollow.followers.splice(followerIndex, 1);
        } else {
            userToFollow.followers.push(curUser);
            curUser.followings.push(userToFollow);
        }

        await userToFollow.save();
        await curUser.save();

        return res.send(success(200, { user: userToFollow }));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const getPostsOfFollowing = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId).populate("followings");

        const followingsIds = curUser.followings.map((item) => item._id);
        followingsIds.push(req._id);

        const fullPosts = await Post.find({
            owner: {
                $in: curUser.followings,
            },
        }).populate("owner");

        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        const suggestions = await User.find({
            _id: {
                $nin: followingsIds,
            },
        });

        return res.send(success(200, { ...curUser._doc, suggestions, posts }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const getPostsOfNotFollowing = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId).populate("followings");

        const followingsIds = curUser.followings.map((item) => item._id);
        followingsIds.push(req._id);

        const fullPosts = await Post.find({
            owner: {
                $nin: followingsIds,
            },
        }).populate("owner");

        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        return res.send(success(200, { posts }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const getMyPosts = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        const myALLPosts = await Post.find({
            owner: curUser,
        }).populate("likes");

        return res.send(success(200, { myALLPosts }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            res.send(error(400, "User Id is required"));
        }

        const user = await User.findById(userId);

        const userPosts = await Post.find({
            owner: user,
        }).populate("likes");

        return res.send(success(200, { userPosts }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const deleteMyProfile = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        // All posts Deletion

        await Post.deleteMany({
            owner: curUser,
        });

        //Removing Myself from follower's followings

        curUser?.followers?.forEach(async (followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(curUser);
            follower.followings.splice(index, 1);
            await follower.save();
        });

        //Removing Myself from following's followers

        curUser?.followings?.forEach(async (followingId) => {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curUser);
            following.followers.splice(index, 1);
            await following.save();
        });

        //Removing Myself from all likes

        const allPosts = await Post.find();
        allPosts.forEach(async (post) => {
            const index = await post.likes.indexOf(curUser);
            post.likes.splice(index, 1);
            await post.save();
        });

        // Deletion of all comments of the user
        await Comment.deleteMany({
            owner: curUser,
        });

        await curUser.deleteOne();

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(200, "User Deleted"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const getMyInfo = async (req, res) => {
    try {
        const user = await User.findById(req._id)
            .populate("followers")
            .populate("followings");
        return res.send(success(200, { user }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;

        const user = await User.findById(req._id);

        if (name) {
            user.name = name;
        }
        if (bio) {
            user.bio = bio;
        }
        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: "profileImage",
            });
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id,
            };
        }
        await user.save();
        return res.send(success(200, { user }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId)
            .populate({
                path: "posts",
                populate: {
                    path: "owner",
                },
            })
            .populate("followers")
            .populate("followings");

        const fullPosts = user.posts;
        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        return res.send(success(200, { ...user._doc, posts }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const searchUser = async (req, res) => {
    try {
        const { searchQuery } = req.body;

        if (!searchQuery) {
            res.send(error(400, "Search query is required"));
        }

        const user = await User.find({
            $or: [{ name: { $regex: searchQuery, $options: "i" } }],
        });

        return res.send(success(200, { user }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

module.exports = {
    followOrUnfollowUser,
    getPostsOfFollowing,
    getPostsOfNotFollowing,
    getMyPosts,
    getUserPosts,
    deleteMyProfile,
    getMyInfo,
    updateMyProfile,
    getUserProfile,
    searchUser,
};