import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SnapURL from "./components/snapUrl";
import UrlPreview from "./components/Preview";
const App = () => {
  return (
    <BrowserRouter basename="snapurl">
      <Routes>
        <Route path="/" element={<SnapURL />} />
        <Route path="/preview/:id" element={<UrlPreview />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
