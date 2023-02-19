import React from "react";
import { useState, useEffect } from "react";
import { isValidHttpUrl } from "../../utils/functions";
import AddBookmark from "../add-bookmark/AddBookmark";
import EditBookmark from "../edit-bookmark/EditBookmark";
import Paginate from "../paginate/Paginate";
import SingleBookmark from "../single-bookmark/SingleBookmark";
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
  console.log(currentBookmark);
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
    setCurrentBookmark(bookmark);

    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    const updatedBookmarks = bookmarks.filter(
      (bookmark, index) => (bookmark.id = index)
    );

    setBookmarks(updatedBookmarks);
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

  const clearBookmarks = (event) => {
    event.preventDefault();
    setBookmarks([]);
  };

  return (
    <main className="bookmarks">
      <AddBookmark
        handleFormSubmit={handleFormSubmit}
        titleInputValue={titleInputValue}
        handleTitleInputChange={handleTitleInputChange}
        handleUrlInputChange={handleUrlInputChange}
        urlInputValue={urlInputValue}
        errors={errors}
        clearBookmarks={clearBookmarks}
      />

      <div className="container">
        {bookmarks.map((bookmark) => {
          return (
            <div key={bookmark.id}>
              {isEditing && currentBookmark.id === bookmark.id ? (
                <EditBookmark
                  handleEditFormSubmit={handleEditFormSubmit}
                  handleEditUrlChange={handleEditUrlChange}
                  handleCancelEdit={handCancelEdit}
                  handleEditTitleChange={handleEditTitleChange}
                  currentBookmark={currentBookmark}
                  errors={errors}
                />
              ) : (
                <SingleBookmark
                  bookmark={bookmark}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                />
              )}
            </div>
          );
        })}
      </div>

      <Paginate bookmarks={bookmarks} />
    </main>
  );
};

export default Bookmarks;
