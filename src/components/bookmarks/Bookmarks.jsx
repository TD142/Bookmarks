import React from "react";
import { useState, useEffect } from "react";
import { isValidHttpUrl } from "../../utils/functions";
import AddBookmark from "../add-bookmark/AddBookmark";
import EditBookmark from "../edit-bookmark/EditBookmark";
import Paginate from "../paginate/Paginate";
import SingleBookmark from "../single-bookmark/SingleBookmark";
import "./bookmarks.css";

const Bookmarks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarksPerPage] = useState(20);
  const [urlInputValue, seturlInputValue] = useState("");
  const [titleInputValue, setTitleInputValue] = useState("");
  const [currentBookmark, setCurrentBookmark] = useState({});
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [added, setAdded] = useState(false);
  const [updated, setUpdated] = useState(false);
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
    setAdded(false);
    setErrors("");

    if (urlInputValue.length) {
      if (isValidHttpUrl(urlInputValue)) {
        await fetch(urlInputValue, { mode: "no-cors" })
          .then((response) => {
            setBookmarks((prevBookmarks) => [
              ...prevBookmarks,
              {
                id: bookmarks.length + 1,
                title: titleInputValue,
                url: urlInputValue,
                isEditing: false,
              },
            ]);

            setAdded(true);
            setTimeout(() => {
              setAdded(false);
            }, "1500");
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
    setErrors("");
    const body = document.querySelector("body");
    window.scrollTo(0, 0);
    body.classList.add("body--hidden");
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

    setUpdated(true);

    setTimeout(() => {
      setIsEditing(false);
      setUpdated(false);
    }, "1000");

    setBookmarks(updatedItem);

    const body = document.querySelector("body");

    body.classList.remove("body--hidden");
  };

  const handCancelEdit = () => {
    setIsEditing(false);

    setErrors("");
    const body = document.querySelector("body");

    body.classList.remove("body--hidden");
  };

  const clearBookmarks = (event) => {
    event.preventDefault();
    setBookmarks([]);
  };

  const lastBookmarkIndex = currentPage * bookmarksPerPage;

  const firstBookmarkIndex = lastBookmarkIndex - bookmarksPerPage;

  const currentBookmarks = bookmarks.slice(
    firstBookmarkIndex,
    lastBookmarkIndex
  );

  const totalPages = Math.ceil(bookmarks.length / bookmarksPerPage);

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
        added={added}
      />

      <div className="container">
        {currentBookmarks.map((bookmark) => {
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
                  updated={updated}
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

      <Paginate
        bookmarks={bookmarks}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </main>
  );
};

export default Bookmarks;
