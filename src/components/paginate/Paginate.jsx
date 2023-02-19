import { useState } from "react";
import "./paginate.css";

const Paginate = ({ bookmarks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarksPerPage] = useState(20);

  const lastBookmarkIndex = currentPage * bookmarksPerPage;

  const firstBookmarkIndex = lastBookmarkIndex - bookmarksPerPage;

  const currentBookmarks = bookmarks.slice(
    firstBookmarkIndex,
    lastBookmarkIndex
  );

  const totalPages = Math.ceil(bookmarks.length / bookmarksPerPage);

  console.log(currentBookmarks);

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <p
        className={
          currentPage > 1 && bookmarks.length > 20
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
