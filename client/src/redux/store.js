import { configureStore } from "@reduxjs/toolkit";
import appConfigReducer from "./slices/appConfigslice";
import postReducer from "./slices/postSlice";
import feedDataReducer from "./slices/feedslice";
import commentReducer from "./slices/commentSlice";
import exploreReducer from "./slices/exploreSlice";

export default configureStore({
  reducer: {
    appConfigReducer,
    postReducer,
    feedDataReducer,
    exploreReducer,
    commentReducer
  },
});
