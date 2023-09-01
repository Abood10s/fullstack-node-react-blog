import React, { useState } from "react";
import "./style.css";
import { useEffect } from "react";
import PostList from "../../components/posts/postList";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, getPostsCount } from "../../redux/ApiCalls/PostsApiCalls";

const POSTS_PER_PAGE = 3;

const PostPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { postsCount, posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const pages = Math.ceil(postsCount / POSTS_PER_PAGE);

  // this first useEffect will fetch data every time pagination changes the current page
  useEffect(() => {
    dispatch(fetchPosts(currentPage));

    window.scrollTo(0, 0);
  }, [currentPage]);

  // this second useEffect because we want to get the total count of posts one time to divide it on the pagination
  useEffect(() => {
    dispatch(getPostsCount());
  }, []);

  return (
    <>
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar />
      </section>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default PostPage;
