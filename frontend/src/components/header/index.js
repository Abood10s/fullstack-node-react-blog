import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/ApiCalls/AuthApiCalls";
const Header = () => {
  const [showNav, setShowNav] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <strong>BLOG</strong>
          <i className="bi bi-pencil"></i>
        </div>
        <div
          className="header-menu"
          onClick={() => setShowNav((prev) => !prev)}
        >
          <i className="bi bi-list"></i>
        </div>
      </div>
      <nav
        className="navbar"
        style={{
          clipPath: showNav && "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <ul className="nav-links">
          <Link to="/" className="nav-link" onClick={() => setShowNav(false)}>
            <i className="bi bi-house"></i> Home
          </Link>
          <Link
            to="/posts"
            className="nav-link"
            onClick={() => setShowNav(false)}
          >
            {" "}
            <i className="bi bi-stickies"></i> Posts
          </Link>
          {user && (
            <Link
              to="/posts/create-post"
              className="nav-link"
              onClick={() => setShowNav(false)}
            >
              {" "}
              <i className="bi bi-journal-plus"></i> Create
            </Link>
          )}
          {user?.isAdmin && (
            <Link
              to="/admin-dashboard"
              className="nav-link"
              onClick={() => setShowNav(false)}
            >
              {" "}
              <i className="bi bi-person-check"></i> Admin Dashboard
            </Link>
          )}
        </ul>
      </nav>
      {user ? (
        <div className="header-right-user-info">
          <span
            onClick={() => setDropdown((prev) => !prev)}
            className="header-right-username"
          >
            {user?.username}
          </span>
          {user && user.profilePhoto && (
            <img
              src={user.profilePhoto.url}
              alt="user"
              className="header-right-user-photo"
            />
          )}
          {dropdown && (
            <div className="header-right-dropdown">
              <Link
                to={`/profile/${user?._id}`}
                className="header-dropdown-item"
                onClick={() => setDropdown(false)}
              >
                <i className="bi bi-file-person"></i>
                <span>Profile</span>
              </Link>
              <div className="header-dropdown-item">
                <i className="bi bi-box-arrow-in-left"></i>
                <span
                  onClick={() => {
                    dispatch(logoutUser());
                    setDropdown(false);
                  }}
                >
                  Logout
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="heder-right">
          <Link to="/login" className="header-right-link">
            {" "}
            <i className="bi bi-box-arrow-in-right"></i> <span>Login</span>
          </Link>
          <Link to="/register" className="header-right-link">
            {" "}
            <i className="bi bi-person-plus"></i> <span>Register</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
