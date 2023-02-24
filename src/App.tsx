import React from "react";
import "./App.css";
import Bookmarks from "./components/bookmarks/Bookmarks";

const App = () => {
  return (
    <div className="app">
      <header className="header">
        <h1>Bookmarks</h1>
      </header>
      <Bookmarks />
    </div>
  );
};

export default App;
