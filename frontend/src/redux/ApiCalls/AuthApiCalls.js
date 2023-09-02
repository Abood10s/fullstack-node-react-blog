import { request } from "../../utils/API";
import { authActions } from "../Slices/AuthSlice";

// Login User
export const loginUser = (user) => {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/auth/login", user);
      dispatch(authActions.login(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }
  };
};

// Logout User
export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("userInfo");
  };
};

// Register User
export const registerUser = (user) => {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/auth/register", user);
      //register(data.message) => from backend res.json({message:"you registered successfully"})
      dispatch(authActions.register(data.message));
    } catch (error) {
      console.log(error);

      // toast.error(error.response.data.message);
    }
  };
};
