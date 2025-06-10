import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Community_list from "./Community_page_list";
import Community_page_write from "./Community_page_write";
import Community_page_select from "./Community_page_select";
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Community = () => {
  return (
    <Routes>
      <Route path="/" element={<Community_list />} />
      <Route path="/write" element={<Community_page_write />} />
      <Route path="/select/:postId" element={<Community_page_select />} />
    </Routes>
  );
};

export default Community;
