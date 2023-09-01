import React, { useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import PostList from "../../components/posts/postList";
import Sidebar from "../../components/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/ApiCalls/PostsApiCalls";

const HomePage = () => {
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts(1));
  });

  return (
    <section className="home">
      <div className="home-hearo-header">
        <div className="home-hero-header-layout">
          <h1 className="home-title">Welcome to Blog</h1>
        </div>
      </div>
      <div className="home-latest-post">Latest Posts</div>
      <div className="home-container">
        <PostList posts={posts} />
        <Sidebar />
      </div>
      <div className="home-see-posts-link">
        <Link className="home-link" to="/posts">
          See All Posts
        </Link>
      </div>
    </section>
  );
};

export default HomePage;
