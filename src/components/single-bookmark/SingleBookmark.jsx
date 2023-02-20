import React from "react";
import BookmarkImg from "../../assets/images/bookmark.png";
import "./single-bookmark.css";

const SingleBookmark = ({ bookmark, handleEditClick, handleDeleteClick }) => {
  return (
    <div className="single-bookmark">
      <img src={BookmarkImg} alt="bookmark" />
      <p>{bookmark.title.toUpperCase()}:</p>
      <a href={bookmark.url}>{bookmark.url}</a>

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
  );
};

export default SingleBookmark;
