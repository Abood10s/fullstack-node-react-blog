import React from "react";
import "./style.css";
const Pagination = ({ pages, currentPage, setCurrentPage }) => {
  const generatedPages = [];
  for (let i = 1; i <= pages; i++) {
    generatedPages.push(i);
  }
  return (
    <div className="pagination">
      <button
        className="page previous"
        onClick={() => setCurrentPage((current) => current - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {generatedPages.map((page) => (
        <div
          className={currentPage === page ? "page active" : "page"}
          key={page}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </div>
      ))}
      <button
        className="page next"
        onClick={() => setCurrentPage((current) => current + 1)}
        disabled={currentPage === pages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
