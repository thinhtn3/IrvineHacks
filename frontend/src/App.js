import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
