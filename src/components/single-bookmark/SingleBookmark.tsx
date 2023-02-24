import React from "react";
import BookmarkImg from "../../assets/images/bookmark.png";
import "./single-bookmark.css";

interface props {
  bookmark: { id: number; title: string; url: string };
  handleEditClick: (bookmark: {
    id: number;
    title: string;
    url: string;
  }) => void;
  handleDeleteClick: (id: number) => void;
}

const SingleBookmark = ({
  bookmark,
  handleEditClick,
  handleDeleteClick,
}: props) => {
  return (
    <section className="single-bookmark">
      <div className="single-bookmark__container">
        <img src={BookmarkImg} alt="bookmark" />
        {bookmark.title && <p>{bookmark.title.toUpperCase()}</p>}
        <a href={bookmark.url} target="_blank">
          {bookmark.url}
        </a>
      </div>
      <div className="single-bookmark__wrapper">
        <button
          onClick={() => {
            handleEditClick(bookmark);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            handleDeleteClick(bookmark.id);
          }}
        >
          X
        </button>
      </div>
    </section>
  );
};

export default SingleBookmark;
