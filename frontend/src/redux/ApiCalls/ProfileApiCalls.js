import { profileActions } from "../Slices/profileSlice";
import { request } from "../../utils/API";
import { toast } from "react-toastify";
import { authActions } from "../Slices/AuthSlice";

// Get User Profile
export const getUserProfile = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/users/profile/${userId}`);
      dispatch(profileActions.setProfile(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
};

// Upload User Profile Photo
export const uploadProfilePhoto = (newPhoto) => {
  return async (dispatch, getState) => {
    // getState gives us access to the whole state "the whole store"
    try {
      const { data } = await request.post(
        `/api/users/profile/profile-photo-upload`,
        newPhoto,
        // add token for user
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(profileActions.setProfilePhoto(data.profilePhoto));
      dispatch(authActions.setUserPhoto(data.profilePhoto));
      toast.success("Photo Uploaded Successfully");
      //modify user in localstorage

      const user = JSON.parse(localStorage.getItem("userInfo"));
      user.profilePhoto = data?.profilePhoto;
      localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };
};

// Update User Profile
export const updateProfile = (userId, profile) => {
  return async (dispatch, getState) => {
    // getState gives us access to the whole state "the whole store"
    try {
      const { data } = await request.put(
        `/api/users/profile/${userId}`,
        profile,
        // add token for user
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.token}`,
          },
        }
      );
      dispatch(profileActions.updateProfile(data));
      dispatch(authActions.setUserName(data.username));
      //modify user in localstorage

      const user = JSON.parse(localStorage.getItem("userInfo"));
      user.username = data?.username;
      localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };
};

// Delete Profile (Account)
export const deleteProfile = (userId) => {
  return async (dispatch, getState) => {
    // getState gives us access to the whole state "the whole store"
    try {
      dispatch(profileActions.setLoading());
      const { data } = await request.delete(
        `/api/users/profile/${userId}`,
        // add token for user
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.token}`,
          },
        }
      );
      dispatch(profileActions.setIsProfileDeleted());
      toast.success(data?.message);

      setTimeout(() => {
        profileActions.clearIsProfileDeleted();
      }, 2000);
    } catch (error) {
      toast.error("Something Went Wrong!");
      dispatch(profileActions.clearLoading());
    }
  };
};

// Get Users Count (For Admin Dashboard)
export const getUsersCount = (userId) => {
  return async (dispatch, getState) => {
    // getState gives us access to the whole state "the whole store"
    try {
      const { data } = await request.get(
        `/api/users/count`,
        // add token for user
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.token}`,
          },
        }
      );
      dispatch(profileActions.setIsUsersCount(data));
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };
};

// Get All Users Profiles (For Admin Dashboard)
export const getAllUsersProfiles = (userId) => {
  return async (dispatch, getState) => {
    // getState gives us access to the whole state "the whole store"
    try {
      const { data } = await request.get(
        `/api/users/profile`,
        // add token for user
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.token}`,
          },
        }
      );
      dispatch(profileActions.setProfiles(data));
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };
};
