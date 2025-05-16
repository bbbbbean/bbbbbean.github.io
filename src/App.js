import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

import MainHeader from "./components/MainHeader";
import Main from "./components/Main";
import Footer from "./components/Footer";
import MatchList from "./components/match/matchList";
import EventList from "./components/event/Event";
import MyPageLayout from "./components/layout/MypageLayout";
import AdminPage from './AdminPage';
import Friend from './components/message/Friend'
import UserLayout from './components/layout/UserLayout'
import SuccessLogin from './SuccessLogin'


function AppComponent() {

  //로그인 여부 확인
  if (localStorage.getItem("isAuth")) {
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
              <Route path="/friend" element={<Friend />} />              
              <Route path="/mypage/*" element={<MyPageLayout />} />
              <Route path="/user/*" element={<UserLayout />} />
              <Route path="/ok" element={<SuccessLogin />} />
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
