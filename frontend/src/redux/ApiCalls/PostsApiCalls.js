import { postActions } from "../Slices/postSlice";
import { request } from "../../utils/API";
import { toast } from "react-toastify";

// fetch posts based on page number
export const fetchPosts = (pageNumber) => {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?pageNumber=${pageNumber}`);
      dispatch(postActions.setPosts(data));
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };
};

// Get posts Count
export const getPostsCount = () => {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/count`);
      dispatch(postActions.setPostsCount(data));
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };
};

// fetch posts based on category
export const fetchPostsBasedOnCategory = (category) => {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?category=${category}`);
      dispatch(postActions.setPostsCategory(data));
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };
};

// Create Post
export const createPost = (newPost) => {
  return async (dispatch, getState) => {
    try {
      dispatch(postActions.setLoading());
      await request.post(`/api/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // set IsPostCreated true it has in it loading = false
      dispatch(postActions.setIsPostCreated());
      // set IsPostCreated false after 2 seconds without it we will always navigate to the homepage "in the create-post page"
      setTimeout(() => {
        dispatch(postActions.clearIsPostCreated());
      }, 2000);
    } catch (error) {
      // toast.error(error.response.data.message);
      dispatch(postActions.clearLoading());
    }
  };
};

// fetch single post by id
export const fetchSinglePost = (postId) => {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/${postId}`);
      dispatch(postActions.setPost(data));
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };
};

// toggle Like Post
export const toggleLikePost = (postId) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/posts/like/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getState().auth.user.token}` },
        }
      );
      dispatch(postActions.setLike(data));
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };
};

// Update Post Image
export const updatePostImage = (newImage, postId) => {
  return async (dispatch, getState) => {
    try {
      await request.put(`/api/posts/update-image/${postId}`, newImage, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
          "Content-Type": "multipart/formD-data",
        },
      });
      toast.success("New Post Image Uploaded successfully");
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    }
  };
};

// Update Post
export const updatePost = (newPost, postId) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/api/posts/${postId}`, newPost, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      dispatch(postActions.setPost(data));
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    }
  };
};

// Delete Post
export function deletePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
        },
      });
      dispatch(postActions.deletePost(data.postId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Get All Posts
export const getAllPosts = () => {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts`);
      dispatch(postActions.setPosts(data));
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    }
  };
};
