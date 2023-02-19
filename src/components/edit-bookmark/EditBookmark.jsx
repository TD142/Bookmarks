import React from "react";

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
      <div className="edit-bookmark-single">
        <form onSubmit={handleEditFormSubmit}>
          <p>{errors}</p>
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
          <button type="submit">update</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditBookmark;
