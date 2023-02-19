import React from "react";
import { useState, useEffect } from "react";
import { isValidHttpUrl } from "../../utils/functions";
import Paginate from "../paginate/Paginate";
import "./bookmarks.css";

const Bookmarks = () => {
  const [urlInputValue, seturlInputValue] = useState("");
  const [titleInputValue, setTitleInputValue] = useState("");
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

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleUrlInputChange = (event) => {
    seturlInputValue(event.target.value);
    setErrors("");
  };

  const handleTitleInputChange = (event) => {
    setTitleInputValue(event.target.value);
  };

  const handleEditTitleChange = (event) => {
    setCurrentBookmark({ ...currentBookmark, title: event.target.value });
  };

  const handleEditUrlChange = (event) => {
    setCurrentBookmark({ ...currentBookmark, url: event.target.value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setErrors("");

    if (urlInputValue.length) {
      if (isValidHttpUrl(urlInputValue)) {
        await fetch(urlInputValue, { mode: "no-cors" })
          .then((response) => {
            const test = response.text();

            console.log(test);
            setBookmarks((prevBookmarks) => [
              ...prevBookmarks,
              {
                id: bookmarks.length + 1,
                title: titleInputValue,
                url: urlInputValue,
                isEditing: false,
              },
            ]);
          })
          .then((responseText) => {
            const parsedResponse = new window.DOMParser().parseFromString(
              responseText,
              "text/html"
            );

            console.log(parsedResponse.title);
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

    seturlInputValue("");
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

    if (currentBookmark.url) {
      if (isValidHttpUrl(currentBookmark.url)) {
        fetch(currentBookmark.url, { mode: "no-cors" })
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

  const handleUpdateBookMark = (id, updatedBookmark) => {
    const updatedItem = bookmarks.map((bookmark) => {
      return bookmark.id === id ? updatedBookmark : bookmark;
    });

    setIsEditing(false);

    setBookmarks(updatedItem);
  };

  const handCancelEdit = () => {
    setIsEditing(false);
    setErrors("");
  };

  return (
    <div>
      <section>
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

        <div className="bookmarks-list">
          {bookmarks.map((bookmark) => {
            return (
              <div key={bookmark.id} className="single-bookmark">
                {isEditing && currentBookmark.id === bookmark.id ? (
                  <div className="edit-bookmark">
                    <div className="edit-bookmark-single">
                      <form onSubmit={handleEditFormSubmit}>
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
                        <button onClick={handCancelEdit}>Cancel</button>
                        <p>{errors}</p>
                      </form>
                    </div>
                  </div>
                ) : (
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
