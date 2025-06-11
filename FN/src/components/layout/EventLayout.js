import { Route, Routes } from "react-router-dom";
import EventList from "../event/EventList";
import EventSelect from "../event/EventSelect";

const EventLayout = () => {
  return (
    <Routes>
      <Route path="/list" element={<EventList />} />
      <Route path="/list/:postCodeId" element={<EventList />} />
      <Route path="/select/:postNumber" element={<EventSelect />} />
      {/* <Route path="/write/:postCodeNumber" element={<Community_page_write />} />
      <Route path="/edit/:postId" element={<Community_page_write />} /> */}
    </Routes>
  );
};
export default EventLayout;
