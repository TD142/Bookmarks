import React from "react";
import "./add-bookmark.css";

interface props {
  handleFormSubmit: (event: React.FormEvent) => void;
  clearBookmarks: (event: React.FormEvent) => void;
  handleTitleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  titleInputValue: string;
  urlInputValue: string;
  errors: string;
  added: boolean;
}

const AddBookmark = ({
  handleFormSubmit,
  clearBookmarks,
  handleTitleInputChange,
  handleUrlInputChange,
  titleInputValue,
  urlInputValue,
  errors,
  added,
}: props) => {
  return (
    <section className="add-bookmark">
      {/* conditionally show errors or success message */}
      {errors && <p className="error">{errors}</p>}
      {added && <p className="added">Bookmark added!</p>}
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
    </section>
  );
};

export default AddBookmark;
