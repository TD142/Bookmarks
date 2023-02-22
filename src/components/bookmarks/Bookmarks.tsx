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
    // clearing any previous authentication messages.
    setAdded(false);
    setErrors("");

    // only submit if the url form holds a value.
    if (urlInputValue.length) {
      // use helper constructor function to check if valid http or https request.
      if (isValidHttpUrl(urlInputValue)) {
        await fetch(urlInputValue, { mode: "no-cors" })
          // send request to server, if response received, the website is live. Disable cors to allow opaque cross origin response.
          .then((response) => {
            // update state with new bookmark.

            setBookmarks((prevBookmarks) => [
              ...prevBookmarks,
              {
                id: bookmarks.length + 1,
                title: titleInputValue,
                url: urlInputValue,
              },
            ]);
            // clear form values and set added to true to display success message.
            seturlInputValue("");
            setTitleInputValue("");
            setAdded(true);
          })

          .catch((err) => {
            console.log(err);
            // no response from the server website is not live.
            setErrors("Not a live website!");
          });
      } else {
        // if fails constructor test.
        setErrors("Not a valid url!");
      }
    } else {
      // if no url input value
      setErrors("Empty url!");
    }
  };

  const handleEditClick = (bookmark: Bookmark) => {
    // getting bookmark details and setting in state for edit. Clearing any errors and then scrolling to top of screen where error page is set.
    setCurrentBookmark(bookmark);
    // alter display
    setIsEditing(true);
    setErrors("");
    // save previous position prior to clicking
    setScrollPosition(window.scrollY);
    window.scrollTo(0, 0);
    // disable scroll for absoloute position edit component.
    const root = document.getElementById("root") as HTMLDivElement;
    root.classList.add("root");
  };

  const handleDeleteClick = (id: number) => {
    // remove bookmark using passed id.
    const filteredBookmarks = bookmarks.filter(
      (bookmark) => bookmark.id !== id
    );
    // updated id's so id is relative to index and there's no missing numbers
    if (filteredBookmarks.length) {
      filteredBookmarks.forEach((bookmark, index) => (bookmark.id = index + 1));
    }

    // update state.
    setBookmarks(filteredBookmarks);
  };

  function handleEditFormSubmit(event: React.FormEvent) {
    event.preventDefault();

    setErrors("");
    // same proccess as adding but with an update function in the resolve
    if (currentBookmark.url) {
      if (isValidHttpUrl(currentBookmark.url)) {
        fetch(currentBookmark.url, { mode: "no-cors" })
          .then((resolve) => {
            handleUpdateBookMark(currentBookmark);
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

  const handleUpdateBookMark = (updatedBookmark: {
    id: number;
    title: string;
    url: string;
  }) => {
    // copy the bookmarks whilst updating the edited bookmark

    const updatedItem = bookmarks.map((bookmark) => {
      return bookmark.id === currentBookmark.id ? updatedBookmark : bookmark;
    });
    // Alter display to all bookmarks
    setUpdated(true);
    // slight delay for update message to show, and then scroll to previous position when clicking edit.
    setTimeout(() => {
      setIsEditing(false);
      setUpdated(false);
      window.scrollTo(0, scrollPosition);
    }, 1000);

    setBookmarks(updatedItem);

    const root = document.getElementById("root") as HTMLDivElement;
    root.classList.remove("root");
  };

  const handleCancelEdit = () => {
    // change display
    setIsEditing(false);
    // clear any errors on display.
    setErrors("");
    const root = document.getElementById("root") as HTMLBodyElement;
    root.classList.remove("root");
    window.scrollTo(0, scrollPosition);
  };

  const clearBookmarks = (event: React.FormEvent) => {
    event.preventDefault();
    // setting bookmarks to empty array to clear them.
    setBookmarks([]);
  };

  // last bookmark on current page index.

  const lastBookmarkIndex = currentPage * bookmarksPerPage;
  // first bookmark on current page index.
  const firstBookmarkIndex = lastBookmarkIndex - bookmarksPerPage;

  // copying from first index up until last.
  const currentBookmarks = bookmarks.slice(
    firstBookmarkIndex,
    lastBookmarkIndex
  );
  // get total pages, rounding up if odd.
  const totalPages = Math.ceil(bookmarks.length / bookmarksPerPage);

  return (
    <main className="bookmarks">
      <AddBookmark
        handleFormSubmit={handleFormSubmit}
        handleTitleInputChange={handleTitleInputChange}
        handleUrlInputChange={handleUrlInputChange}
        clearBookmarks={clearBookmarks}
        titleInputValue={titleInputValue}
        urlInputValue={urlInputValue}
        errors={errors}
        added={added}
      />

      <div className="container">
        {currentBookmarks.map((bookmark) => {
          return (
            <div className="inner-container" key={bookmark.id}>
              {/* conditional rendering */}
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
        setCurrentPage={setCurrentPage}
        bookmarks={bookmarks}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </main>
  );
};

export default Bookmarks;
