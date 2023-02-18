import { useState } from "react";

const Paginate = ({ bookmarks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const lastPostIndex = currentPage * postsPerPage;

  const firstPostIndex = lastPostIndex - postsPerPage;

  const currentBookmarks = bookmarks.slice(firstPostIndex, lastPostIndex);

  const totalPages = Math.ceil(currentBookmarks.length / postsPerPage);

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <p
        className={
          currentPage > 1 && bookmarks.length > 6
            ? "pagination__text"
            : "pagination__text--hidden"
        }
        onClick={() => {
          setCurrentPage((previousPage) => previousPage - 1);
          window.scrollTo(0, 0);
        }}
      >
        &lt;
      </p>

      <ul className="pagination__list">
        {pageNumbers.map((number) => (
          <li
            onClick={() => {
              setCurrentPage(number);
              window.scrollTo(0, 0);
            }}
            className={`pagination__list__item ${
              number === currentPage && "pagination__list__item--highlight"
            }`}
            key={number}
          >
            {number}
          </li>
        ))}
      </ul>

      <p
        className={
          currentPage < totalPages && bookmarks.length > 6
            ? "pagination__text"
            : "pagination__text--hidden"
        }
        onClick={() => {
          setCurrentPage((previousPage) => previousPage + 1);
          window.scrollTo(0, 0);
        }}
      >
        &gt;
      </p>
    </div>
  );
};

export default Paginate;
