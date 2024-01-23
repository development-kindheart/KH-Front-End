import React from "react";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination justify-content-end">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {paginationItems.map((item, index) => (
          <li
            key={index}
            className={`page-item ${item === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageChange(item)}>
              {item}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
