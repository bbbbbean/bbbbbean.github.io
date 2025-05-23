import { Route, Routes } from "react-router-dom";
import Community_list from "../community/Community_list";
import Community_page_select from "../community/Community_page_select";
import Community_page_write from "../community/Community_page_write";

const communityLayout = () => {
  return (
    <Routes>
      <Route path="/list" element={<Community_list />} />
      <Route path="/select" element={<Community_page_select />} />
      <Route path="/write" element={<Community_page_write />} />
    </Routes>
  );
};
export default communityLayout;
