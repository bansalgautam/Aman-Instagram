import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);
      console.log("user profile", response);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const LikeAndUnlikePost = createAsyncThunk(
  "post/likeAndUnlike",
  async (body) => {
    try {
      const response = await axiosClient.post("/posts/like", body);
      return response.result.post;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const deletePost = createAsyncThunk("posts/deletePost",
  async (body) => {
  try {
    const response = await axiosClient.delete("/posts/", body);
    return response.result.post;
  } catch (error) {
    return Promise.reject(error);
  }
});

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(deletePost.fulfilled,(state,action)=>{
        const index =state?.userProfile?.posts?.findIndex(
          (item)=>item._id===action.payload
        )
        if (index !== undefined && index !== -1) {
          state.userProfile.posts.splice(index, 1);
      }
      })
      .addCase(LikeAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index !== undefined && index !== -1) {
          state.userProfile.posts[index] = post;
        }
      });
  },
});

export default postSlice.reducer;
