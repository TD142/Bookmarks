import React from "react";
import { useState, useEffect } from "react";
import { isValidHttpUrl } from "../../utils/functions";
import Paginate from "../paginate/Paginate";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");

    if (savedBookmarks) {
      return JSON.parse(savedBookmarks);
    } else {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState("");
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    setErrors("");

    if (inputValue.length) {
      if (isValidHttpUrl(inputValue)) {
        fetch(inputValue, { mode: "no-cors" })
          .then((resolve) => {
            setBookmarks((prevBookmarks) => [
              ...prevBookmarks,
              {
                id: bookmarks.length + 1,
                text: inputValue,
              },
            ]);
          })
          .catch((err) => {
            setErrors("Not a live website!");
          });
      }
    } else {
      setErrors("Empty bookmark!");
    }

    setInputValue("");
  };

  const handleDeleteClick = (id) => {
    const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.id != id);
    setBookmarks(filteredBookmarks);
  };

  return (
    <div>
      <section>
        <form onSubmit={handleFormSubmit}>
          <input
            placeholder="Add a Bookmark"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            type="text"
          />

          <button>Add</button>

          {errors && <p>{errors}</p>}
        </form>

        <div className="bookmarks-list">
          {bookmarks.map((bookmark) => {
            return (
              <div key={bookmark.id} className="single-bookmark">
                <a href={bookmark.text}>{bookmark.text}</a>
                <button onClick={() => handleDeleteClick(bookmark.id)}>
                  X
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setBookmarks([]);
          }}
        >
          Clear Bookmarks
        </button>
        <Paginate bookmarks={bookmarks} />
      </section>
    </div>
  );
};

export default Bookmarks;
