import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk(
  "user/getmyinfo",
  async () => {
    try {
      const response = await axiosClient.get("/user/getmyinfo");
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body) => {
    try {
      const response = await axiosClient.put("/user/",body);
      return response.result;
      // console.log("api is called", response.result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const appConfigslice = createSlice({
  name: "appConfigslice",
  initialState: {
    isLoading: false,
    toastData:{},
    myProfile: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast:(state,action)=>{
      state.toastData =action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.myProfile = action.payload?.user;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      });
  },
});

export default appConfigslice.reducer;

export const { setLoading,showToast } = appConfigslice.actions;
