import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slices/AuthSlice";
import { profileReducer } from "./Slices/profileSlice";
import { postReducer } from "./Slices/postSlice";
import { categoryReducer } from "./Slices/categorySlice";
import { commentReducer } from "./Slices/commentSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    post: postReducer,
    category: categoryReducer,
    comment: commentReducer,
  },
});
export default store;
