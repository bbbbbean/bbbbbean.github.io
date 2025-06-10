import { Route, Routes } from "react-router-dom";

import MatchList from "../match/matchList";
import NewMatch from '../match/newMatch';

const MatchLayout = () => {
    return (
        <Routes>
            <Route path="/list/:type" element={<MatchList />} />
            <Route path="/newMatch" element={<NewMatch />} />
        </Routes>
    );
};
export default MatchLayout;
