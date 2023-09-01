import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PostList from "../../components/posts/postList";
import "./style.css";
import { fetchPostsBasedOnCategory } from "../../redux/ApiCalls/PostsApiCalls";
const Category = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { postsCategory } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPostsBasedOnCategory(category));
    window.scrollTo(0, 0);
  }, [category]);

  return (
    <section className="category">
      {postsCategory.length === 0 ? (
        <>
          <h1 className="category-not-found">
            Posts with <span>{category}</span> category not found
          </h1>
          <Link to="/posts" className="category-not-found-link">
            Go to posts page
          </Link>
        </>
      ) : (
        <>
          <h1 className="category-title">Posts based on {category}</h1>
          <PostList posts={postsCategory} />
        </>
      )}
    </section>
  );
};

export default Category;
