import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AddCategoryForm from "./AddCategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/ApiCalls/CategoriesApiCall";
import { getUsersCount } from "../../redux/ApiCalls/ProfileApiCalls";
import { getPostsCount } from "../../redux/ApiCalls/PostsApiCalls";
import { fetchAllComments } from "../../redux/ApiCalls/CommentsApiCall";

const AdminMain = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { usersCount } = useSelector((state) => state.profile);
  const { postsCount } = useSelector((state) => state.post);
  const { comments } = useSelector((state) => state.comment);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getUsersCount());
    dispatch(getPostsCount());
    dispatch(fetchAllComments());
  }, []);

  return (
    <div className="amdin-main">
      <div className="admin-main-header">
        <div className="admin-main-card">
          <h5 className="admin-card-title">Users</h5>
          <div className="admin-card-count">{usersCount}</div>
          <div className="admin-card-link-wrapper">
            <Link to="/admin-dashboard/users-table" className="admin-card-link">
              See all users
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-person"></i>
            </div>
          </div>
        </div>
        <div className="admin-main-card">
          <h5 className="admin-card-title">Posts</h5>
          <div className="admin-card-count">{postsCount}</div>
          <div className="admin-card-link-wrapper">
            <Link to="/admin-dashboard/posts-table" className="admin-card-link">
              See all posts
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-file-post"></i>
            </div>
          </div>
        </div>
        <div className="admin-main-card">
          <h5 className="admin-card-title">Categories</h5>
          <div className="admin-card-count">{categories.length}</div>
          <div className="admin-card-link-wrapper">
            <Link to="categories-table" className="admin-card-link">
              See all categories
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-tag-fill"></i>
            </div>
          </div>
        </div>
        <div className="admin-main-card">
          <h5 className="admin-card-title">Comments</h5>
          <div className="admin-card-count">{comments.length}</div>
          <div className="admin-card-link-wrapper">
            <Link to="comments-table" className="admin-card-link">
              See all comments
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-chat-left-text"></i>
            </div>
          </div>
        </div>
      </div>
      <AddCategoryForm />
    </div>
  );
};

export default AdminMain;
