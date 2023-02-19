import React from "react";

const AddBookmark = ({
  handleFormSubmit,
  titleInputValue,
  handleTitleInputChange,
  urlInputValue,
  handleUrlInputChange,
  errors,
}) => {
  return (
    <form onSubmit={handleFormSubmit}>
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

      <button type="submit">Add</button>

      {errors && <p>{errors}</p>}
    </form>
  );
};

export default AddBookmark;
