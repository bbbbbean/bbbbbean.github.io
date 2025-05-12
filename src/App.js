import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { login } from "./store"

import MainHeader from "./components/MainHeader";
import Main from "./components/Main";
import Footer from "./components/Footer";
import MatchList from "./components/match/matchList";
import EventList from "./components/event/Event";
import Login from "./components/user/Login";
import MyPageLayout from "./components/user/MypageLayout";
import AdminPage from './AdminPage';
import Logout from "./components/user/Logout"


function AppComponent() {

  //로그인 여부 확인
    const dispatch = useDispatch();
  if(localStorage.getItem("isAuth")){
    dispatch(login());
  }

  //어드민 페이지 여부 확인용
  const location = useLocation().pathname;
  return (
    <>
      {!location.includes('admin') ? (
        <>
          <div className="wrapper">
            <MainHeader />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/match/list" element={<MatchList />} />
              <Route path="/event/list" element={<EventList />} />
              <Route path="/user/login" element={<Login />} />
              <Route path="/user/logout" element={<Logout />} />
              <Route path="/user/mypage/*" element={<MyPageLayout />} />
            </Routes>
          </div>
          <Footer />
        </>
        )
        :
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      }

    </>
  );
}

function App() {

  return (
    <Router>
      <AppComponent />
    </Router>
  );
}

export default App;
