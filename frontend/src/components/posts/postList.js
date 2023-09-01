import React from "react";
import PostItem from "./PostItem";
import "./posts.css";

const PostList = ({ posts }) => {
  return (
    <div className="post-list">
      {posts?.map((item) => (
        <PostItem key={item._id} post={item} />
      ))}
    </div>
  );
};

export default PostList;
