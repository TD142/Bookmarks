import React from "react";

const SingleBookmark = ({ bookmark, handleEditClick, handleDeleteClick }) => {
  return (
    <div>
      <p>{bookmark.title}</p>
      <a href={bookmark.url}>{bookmark.url}</a>

      <button
        onClick={() => {
          handleEditClick(bookmark);
        }}
      >
        Edit
      </button>
      <button onClick={() => handleDeleteClick(bookmark.id)}>X</button>
    </div>
  );
};

export default SingleBookmark;
