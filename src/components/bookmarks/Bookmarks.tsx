import React from "react";
import { useState, useEffect } from "react";
import { isValidHttpUrl } from "../../utils/functions";
import AddBookmark from "../add-bookmark/AddBookmark";
import EditBookmark from "../edit-bookmark/EditBookmark";
import Paginate from "../paginate/Paginate";
import SingleBookmark from "../single-bookmark/SingleBookmark";
import "./bookmarks.css";

const Bookmarks = () => {
  interface Bookmark {
    id: number;
    title: string;
    url: string;
  }

  const [currentPage, setCurrentPage] = useState<number>(1);
  // page number
  const [bookmarksPerPage] = useState<number>(20);
  // how many items on page
  const [urlInputValue, seturlInputValue] = useState<string>("");
  const [titleInputValue, setTitleInputValue] = useState<string>("");
  const [currentBookmark, setCurrentBookmark] = useState<Bookmark>({
    id: 0,
    title: "",
    url: "",
  });
  // single book mark for editing
  const [errors, setErrors] = useState<string>("");
  // authentication errors
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // to display all bookmarks or edited book marks
  const [added, setAdded] = useState<boolean>(false);
  // whether bookmark added message is displayed
  const [updated, setUpdated] = useState<boolean>(false);
  // whether updated bookmark message is deplayed
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    // checking for local storage items
    if (savedBookmarks) {
      return JSON.parse(savedBookmarks);
    } else {
      return [];
    }
  });
  // all book marks
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  // previous scroll position stored when exiting edit book mark

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    // every time there is a change to book marks they are persisted in local storage.
  }, [bookmarks]);

  // input values held in state

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    seturlInputValue(event.target.value);
    setErrors("");
  };

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };
  // taking previous state values and updating title or url
  const handleEditTitleChange = (event: React.FormEvent) => {
    setCurrentBookmark((prevBookmark) => ({
      ...prevBookmark,
      title: (event.target as HTMLInputElement).value,
    }));
  };

  const handleEditUrlChange = (event: React.FormEvent) => {
    setCurrentBookmark((prevBookmark) => ({
      ...prevBookmark,
      url: (event.target as HTMLInputElement).value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
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
              },
            ]);
            seturlInputValue("");
            setTitleInputValue("");
            setAdded(true);
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

  const handleEditClick = (bookmark: Bookmark) => {
    setCurrentBookmark(bookmark);
    setIsEditing(true);
    setErrors("");
    setScrollPosition(window.scrollY);
    window.scrollTo(0, 0);
    const body = document.querySelector("body") as HTMLBodyElement;
    body.classList.add("body--hidden");
  };

  const handleDeleteClick = (id: number) => {
    const filteredBookmarks = bookmarks.filter(
      (bookmark) => bookmark.id !== id
    );

    if (filteredBookmarks.length) {
      filteredBookmarks.forEach((bookmark, index) => (bookmark.id = index));
    }
    setBookmarks(filteredBookmarks);
  };

  function handleEditFormSubmit(event: React.FormEvent) {
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

  const handleUpdateBookMark = (
    id: number,
    updatedBookmark: { id: number; title: string; url: string }
  ) => {
    const updatedItem = bookmarks.map((bookmark) => {
      return bookmark.id === id ? updatedBookmark : bookmark;
    });

    setUpdated(true);

    setTimeout(() => {
      setIsEditing(false);
      setUpdated(false);
      window.scrollTo(0, scrollPosition);
    }, 1000);

    setBookmarks(updatedItem);

    const body = document.querySelector("body") as HTMLBodyElement;
    body.classList.remove("body--hidden");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors("");
    const body = document.querySelector("body") as HTMLBodyElement;
    body.classList.remove("body--hidden");
    window.scrollTo(0, scrollPosition);
  };

  const clearBookmarks = (event: React.FormEvent) => {
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
                  handleCancelEdit={handleCancelEdit}
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
