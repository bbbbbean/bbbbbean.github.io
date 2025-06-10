import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

import MainHeader from "./components/MainHeader";
import Main from "./components/Main";
import Footer from "./components/Footer";
import EventList from "./components/event/Event";
import MyPageLayout from "./components/layout/MypageLayout";
import MatchLayout from "./components/layout/MatchLayout";
import AdminPage from './AdminPage';
import FriendLoyout from './components/layout/FriendLayout'
import UserLayout from './components/layout/UserLayout'
import SuccessLogin from './SuccessLogin'
import AccordionModal from './components/modal/AccordionModal';
import CommunityLayout from './components/layout/CommunityLayout';
import { WebSocketProvider } from './WebSocket';
import InformationPro from './components/myInfo/InformationPro'


function AppComponent() {

  //로그인 여부 확인
  const isAuth = localStorage.getItem("isAuth");

  //어드민 페이지 여부 확인용
  const location = useLocation().pathname;
  return (
    <WebSocketProvider>
      {!location.includes('admin') ? (
        <>
          <div className="wrapper">
            <MainHeader />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/event/list" element={<EventList />} />
              <Route path="/friend" element={<FriendLoyout />} />
              <Route path="/match/*" element={<MatchLayout />} />
              <Route path="/mypage/*" element={<MyPageLayout />} />
              <Route path="/community/*" element={<CommunityLayout />} />
              <Route path="/user/*" element={<UserLayout />} />
              <Route path="/ok" element={<SuccessLogin />} />
            </Routes>
          </div>
          <Footer />
          {isAuth && <AccordionModal />}
        </>
      )
        :
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      }
      <InformationPro />

    </WebSocketProvider>
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
