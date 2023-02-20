import React from "react";
import "./add-bookmark.css";

const AddBookmark = ({
  handleFormSubmit,
  titleInputValue,
  handleTitleInputChange,
  urlInputValue,
  handleUrlInputChange,
  errors,
  clearBookmarks,
}) => {
  return (
    <div className="add-bookmark">
      {errors && <p className="error">{errors}</p>}
      <form className="form" onSubmit={handleFormSubmit}>
        <input
          name="add-title"
          placeholder="Add Title"
          value={titleInputValue}
          onChange={handleTitleInputChange}
          type="text"
        />
        <input
          name="add-bookmark"
          placeholder="Add url"
          value={urlInputValue}
          onChange={handleUrlInputChange}
          type="text"
        />
        <div className="buttons">
          <button type="submit">Add</button>
          <button onClick={clearBookmarks}>Clear Bookmarks</button>
        </div>
      </form>
    </div>
  );
};

export default AddBookmark;
