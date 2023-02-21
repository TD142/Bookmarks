import React from "react";
import "./EditBookmark.css";

interface props {
  handleEditFormSubmit: (event: React.FormEvent) => void;
  handleEditTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancelEdit: () => void;
  errors: string;
  currentBookmark: { id?: number; title?: string; url?: string };
  updated: boolean;
}

const EditBookmark = ({
  handleEditFormSubmit,
  handleEditTitleChange,
  handleEditUrlChange,
  handleCancelEdit,
  errors,
  currentBookmark,
  updated,
}: props) => {
  return (
    <div className="edit-bookmark">
      <div className="edit-single-bookmark">
        <h2>Edit Bookmark</h2>
        {/* conditionally render update message */}
        {updated && <p className="update">Bookmark updated!</p>}
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
