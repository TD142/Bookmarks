import "./paginate.css";

interface props {
  bookmarks: { id: number; title: string; url: string }[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Paginate = ({
  bookmarks,
  totalPages,
  currentPage,
  setCurrentPage,
}: props) => {
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
          currentPage < totalPages && bookmarks.length > 20
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
