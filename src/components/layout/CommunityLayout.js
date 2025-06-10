import { Route, Routes } from "react-router-dom";
import Community_page_list from "../community/Community_page_list";
import Community_page_select from "../community/Community_page_select";
import Community_page_write from "../community/Community_page_write";

const CommunityLayout = () => {
  return (
    <Routes>
      <Route path="/list/:postCodeNumber" element={<Community_page_list />} />
      <Route path="/select/:postNumber" element={<Community_page_select />} />
      <Route path="/write" element={<Community_page_write />} />
      <Route path="/edit/:postId" element={<Community_page_write />} />
    </Routes>
  );
};
export default CommunityLayout;
