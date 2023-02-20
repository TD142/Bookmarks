import React from "react";
import "./EditBookmark.css";

const EditBookmark = ({
  handleEditFormSubmit,
  errors,
  handleEditTitleChange,
  currentBookmark,
  handleEditUrlChange,
  handleCancelEdit,
}) => {
  return (
    <div className="edit-bookmark">
      <div className="edit-single-bookmark">
        <h2>Edit Bookmark</h2>
        <form onSubmit={handleEditFormSubmit}>
          <p className="error">{errors}</p>
          <input
            name="edit-url"
            value={currentBookmark.title}
            onChange={handleEditTitleChange}
          />
          <input
            name="edit-url"
            value={currentBookmark.url}
            onChange={handleEditUrlChange}
          />
          <div className="buttons">
            <button type="submit">update</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookmark;
