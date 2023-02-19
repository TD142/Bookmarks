import React from "react";
import { useState, useEffect } from "react";
import { isValidHttpUrl } from "../../utils/functions";
import Paginate from "../paginate/Paginate";

const Bookmarks = () => {
  const [inputValue, setInputValue] = useState("");
  const [currentBookmark, setCurrentBookmark] = useState({});
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");

    if (savedBookmarks) {
      return JSON.parse(savedBookmarks);
    } else {
      return [];
    }
  });

  const ValidationCheck = (input, callback, valueCheck) => {
    if (valueCheck) {
      if (isValidHttpUrl(input.text)) {
        fetch(input.text, { mode: "no-cors" })
          .then((resolve) => {
            callback();
          })
          .catch((err) => {
            setErrors("Not a live website!");
          });
      } else {
        setErrors("Not a valid url!");
      }
    } else {
      setErrors("Empty bookmark!");
    }
  };

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEditInputChange = (event) => {
    setCurrentBookmark({ ...currentBookmark, text: event.target.value });
  };

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
                isEditing: false,
              },
            ]);
          })
          .catch((err) => {
            setErrors("Not a live website!");
          });
      } else {
        setErrors("Not a valid url!");
      }
    } else {
      setErrors("Empty bookmark!");
    }

    setInputValue("");
  };

  const handleEditClick = (bookmark) => {
    setCurrentBookmark({ ...bookmark });
    setIsEditing(true);
  };

  const handleDeleteClick = (id) => {
    const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.id != id);
    setBookmarks(filteredBookmarks);
  };

  function handleEditFormSubmit(event) {
    event.preventDefault();

    setErrors("");

    if (currentBookmark.text) {
      if (isValidHttpUrl(currentBookmark.text)) {
        fetch(currentBookmark.text, { mode: "no-cors" })
          .then((resolve) => {
            handleUpdateBookMark(currentBookmark.id, currentBookmark);
          })
          .catch((err) => {
            setErrors("Not a live website!");
          });
      } else {
        setErrors("Not a valid url!");
      }
    } else {
      setErrors("Empty bookmark!");
    }
  }

  function handleUpdateBookMark(id, updatedBookmark) {
    const updatedItem = bookmarks.map((bookmark) => {
      return bookmark.id === id ? updatedBookmark : bookmark;
    });

    setIsEditing(false);

    setBookmarks(updatedItem);
  }

  return (
    <div>
      <section>
        <form onSubmit={handleFormSubmit}>
          <input
            name="add-bookmark"
            placeholder="Add a Bookmark"
            value={inputValue}
            onChange={handleInputChange}
            type="text"
          />

          <button>Add</button>

          {errors && <p>{errors}</p>}
        </form>

        <div className="bookmarks-list">
          {bookmarks.map((bookmark) => {
            return (
              <div key={bookmark.id} className="single-bookmark">
                {isEditing && currentBookmark.id === bookmark.id ? (
                  <div>
                    <form onSubmit={handleEditFormSubmit}>
                      <input
                        name="edit-bookmark"
                        value={currentBookmark.text}
                        onChange={handleEditInputChange}
                      />
                      <button>update</button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <a href={bookmark.text}>{bookmark.text}</a>
                    <button
                      onClick={() => {
                        handleEditClick(bookmark);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(bookmark.id)}>
                      X
                    </button>
                  </div>
                )}
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
