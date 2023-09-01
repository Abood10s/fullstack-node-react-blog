import React, { useState } from "react";
import "./commentList.css";
import swal from "sweetalert2";
import UpdateCommentModal from "./UpdateCommentModal";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import { deleteComment } from "../../redux/ApiCalls/CommentsApiCall";
const CommentList = ({ comments }) => {
  const [updateComment, setUpdateComment] = useState(false);
  const [commentForUpdate, setCommentForUpdate] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  // Update Comment Handler
  const updateCommentHandler = (comment) => {
    // passes current comment to edit in modal
    setCommentForUpdate(comment);
    // opens modal
    setUpdateComment(true);
  };

  // Delete Comment Handler
  const deleteCommentHandler = (commentId) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to see this comment!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteComment(commentId));
          swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
  };

  return (
    <div className="comment-list">
      <h4 className="comment-list-count">{comments?.length} Comments</h4>
      {comments?.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="comment-item-info">
            <div className="comment-item-username">{comment.username}</div>
            <div className="comment-item-time">
              {/* Moment gets when comment is created like facebook ... 10minutes ago hour ago month ago.. */}
              <Moment fromNow ago>
                {comment.createdAt}
              </Moment>{" "}
              ago
            </div>
          </div>
          <p className="comment-item-text">{comment.text}</p>
          {/* only comment writer can edit his comment */}
          {user?._id === comment.user && (
            <div className="comment-item-icon-wrapper">
              <i
                onClick={() => updateCommentHandler(comment)}
                className="bi bi-pencil-square"
              ></i>
              <i
                onClick={() => deleteCommentHandler(comment?._id)}
                className="bi bi-trash-fill"
              ></i>
            </div>
          )}
        </div>
      ))}
      {updateComment && (
        <UpdateCommentModal
          commentForUpdate={commentForUpdate}
          setUpdateComment={setUpdateComment}
        />
      )}
    </div>
  );
};

export default CommentList;
