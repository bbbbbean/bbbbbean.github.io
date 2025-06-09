import { Link, NavLink } from "react-router-dom";
import "../css/common_css/main_header.css";
import "../css/common_css/custom.css";
import logo from "../image/로고_color.png";
import loginIcon from "../image/image_index/login-b-icon.svg";
import noticeIcon from "../image/image_index/notice-b-icon.svg";
import menuIcon from "../image/image_index/menu-icon.svg";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuth } from "../store";
import { useEffect, useState, useContext } from "react";
import Alarm from "./Alert/Alarm";
import api from "../axios";
import { WebSocketContext } from '../WebSocket'


const MainHeader = () => {

  const dispatch = useDispatch();

  const isAuth = useSelector(state => state.auth.isAuth);

  const [openAlarm, setOpenAlarm] = useState(false);

  const [alarmList, setAlarmList] = useState([]);

  const [alarmCount, setAlarmCount] = useState(0);

  const { alarmUpdate } = useContext(WebSocketContext);

  const readAlarm = () => {
    api.post("/api/chat/alarm/read")
      .then(response => {
        setAlarmCount(0);
      })
      .catch(error => {
        console.error("알림 읽기 실패:", error);
      });
  }

  useEffect(() => {
    if (isAuth) {
      api.post("/api/chat/alarm/list")
        .then(response => {
          setAlarmList(response.data.notificationDTOList);
          setAlarmCount(response.data.noRead);
          //알람을 읽고 있을경우
          if (openAlarm) {
            readAlarm();
          }
        })
        .catch(error => {
        });
    }
  }, [alarmUpdate, isAuth, openAlarm]);

  const openAlarmShow = (open) => {
    if (open) {
      setOpenAlarm(prev => !prev)
    }
    if (alarmCount > 0) {
      readAlarm();
    }
  }


  useEffect(() => {
    dispatch(setIsAuth(localStorage.getItem("isAuth")));
  }, [])
  return (
    <header>
      <ul className="logo">
        <li>
          <Link to="/">
            <img src={logo} alt="로고고" />
          </Link>
        </li>
      </ul>

      <nav className="menu-box">
        <ul>
          <li className="mainmenu">
            <NavLink to="/match/list">매칭</NavLink>
            <ul className="submenu">
              <li><a href="#">운동</a></li>
              <div className="submenu-line"></div>
              <li><a href="#">여행</a></li>
              <div className="submenu-line"></div>
              <li><a href="#">게임</a></li>
              <div className="submenu-line"></div>
              <li><a href="#">기타</a></li>
            </ul>
          </li>
          <li className="mainmenu">
            <NavLink to="/friend">친구</NavLink>
          </li>
          <li className="mainmenu">
            <NavLink to="/community/list">커뮤니티</NavLink>
            <ul className="submenu">
              <li><a href="#">운동</a></li>
              <div className="submenu-line"></div>
              <li><a href="#">게임</a></li>
              <div className="submenu-line"></div>
              <li><a href="#">취미</a></li>
              <div className="submenu-line"></div>
              <li><a href="#">여행</a></li>
              <div className="submenu-line"></div>
              <li><a href="#">자유게시판</a></li>
            </ul>
          </li>
          <li className="mainmenu">
            <NavLink to="/event/list">이벤트</NavLink>
          </li>
        </ul>
      </nav>

      <nav className="icon">
        {isAuth ?
          <ul>
            <li>
              <NavLink to="/user/logout">
                <img src={loginIcon} alt="" />
                <span>로그아웃</span>
              </NavLink>
            </li>
            <li>
              <a className="chatnum-parent" onClick={openAlarmShow}>
                <img src={noticeIcon} alt="" />
                <span>알림</span>
                {alarmCount > 0 &&
                  <div className="chatnum">{alarmCount}</div>
                }
              </a>
            </li>
            <li>
              <NavLink to="/mypage/">
                <img src={menuIcon} alt="" />
              </NavLink>
            </li>
          </ul>
          :
          <ul>
            <li>
              <NavLink to="/user/login">
                <img src={loginIcon} alt="" />
                <span>로그인</span>
              </NavLink>
            </li>
          </ul>
        }
      </nav>
      <div className="line" />
      <Alarm openAlarm={openAlarm} alarmList={alarmList} />
    </header>
  );
};

export default MainHeader;