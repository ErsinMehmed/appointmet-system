import React from "react";

import PrimaryButton from "./PrimaryButton";

function Pagination(props) {
  // The range of displayed pages
  let startPage = Math.max(props.currentPage - 2, 1);
  let endPage = Math.min(props.currentPage + 2, props.totalPages);

  // Check for first and last page
  if (props.currentPage <= 2) {
    endPage = Math.min(props.totalPages, 5);
  } else if (props.currentPage >= props.totalPages - 1) {
    startPage = Math.max(1, props.totalPages - 4);
  }

  const pageButtons = [];

  // Generate buttons for pages in the range
  for (let page = startPage; page <= endPage; page++) {
    pageButtons.push(
      <button
        key={page}
        className={`btn btn-primary mx-1 ${
          props.currentPage === page ? "active" : ""
        }`}
        onClick={() => props.handlePageClick(page)}
      >
        {page}
      </button>
    );
  }

  return (
    <div className="pagination">
      <PrimaryButton
        onClick={() => props.handlePageClick(1)}
        disabled={props.currentPage < 4}
        text="First"
      />

      <PrimaryButton
        onClick={props.handlePrevPage}
        disabled={props.currentPage === 1}
        text="Prev"
      />

      {pageButtons}

      <PrimaryButton
        onClick={props.handleNextPage}
        disabled={props.currentPage === props.totalPages}
        text="Next"
      />

      <PrimaryButton
        onClick={() => props.handlePageClick(props.totalPages)}
        disabled={
          props.currentPage === props.totalPages ||
          props.currentPage >= props.totalPages - 2
        }
        text="Last"
      />
    </div>
  );
}

export default Pagination;
