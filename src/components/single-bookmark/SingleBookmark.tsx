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

function SingleBookmark({
  bookmark,
  handleEditClick,
  handleDeleteClick,
}: props) {
  return (
    <div className="single-bookmark">
      <div className="single-bookmark__container">
        <img src={BookmarkImg} alt="bookmark" />
        {bookmark.title && <p>{bookmark.title.toUpperCase()}:</p>}
        <a href={bookmark.url}>{bookmark.url}</a>
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
    </div>
  );
}

export default SingleBookmark;
