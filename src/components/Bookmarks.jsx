import React from "react";
import { useState, useEffect } from "react";
import { isValidHttpUrl, doesURLExist } from "../utils/functions";

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

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (inputValue.length) {
      if (isValidHttpUrl(inputValue)) {
        fetch(inputValue, { mode: "no-cors" }).then((resolve) => {
          setBookmarks((prevBookmarks) => [
            ...prevBookmarks,
            {
              id: bookmarks.length + 1,
              text: inputValue,
            },
          ]);
        });
      }
    }
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
      </section>
    </div>
  );
};

export default Bookmarks;
