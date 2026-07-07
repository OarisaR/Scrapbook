import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import home from "./images/Home.png";
// import click from "./images/click.png";
// import journal1 from "./images/journal1.png";
// import notebook from "./images/notebook.png";
import {Home} from "./Home";
import {Journal} from "./Journal";

// We use named export --> export function ... like this
// Named export means we have to use the exact same name while importing
// Default export means we can use any name while importing
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
