import { request } from "../../utils/API";
// because every comment belongs to a post
import { postActions } from "../Slices/postSlice";
import { commentActions } from "../Slices/commentSlice";

import { toast } from "react-toastify";

// Create Comment
export const createComment = (newComment) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post("/api/comments", newComment, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      dispatch(postActions.addCommentToPost(data));
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    }
  };
};

// Update Comment
export const updateComment = (commentId, comment) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/comments/${commentId}`,
        comment,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.token}`,
          },
        }
      );
      dispatch(postActions.updateCommentPost(data));
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    }
  };
};

// delete Comment from a post
export const deleteComment = (commentId) => {
  return async (dispatch, getState) => {
    try {
      await request.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      // to remove comment from comments slice "current  the user view"
      dispatch(commentActions.deleteComment(commentId));
      dispatch(postActions.deleteCommentFromPost(commentId));
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    }
  };
};

// Fetch All Comments
export const fetchAllComments = () => {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/api/comments`, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      dispatch(commentActions.setComments(data));
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    }
  };
};
