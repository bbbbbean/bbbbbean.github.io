import { Link, NavLink } from "react-router-dom";
import "../css/common_css/main_header.css";
import "../css/common_css/custom.css";
import logo from "../image/로고_color.png";
import loginIcon from "../image/image_index/login-b-icon.svg";
import noticeIcon from "../image/image_index/notice-b-icon.svg";
import menuIcon from "../image/image_index/menu-icon.svg";
import { useSelector, useDispatch } from "react-redux";
import {setIsAuth} from "../store";
import { useEffect } from "react";




const MainHeader = () => {

  const dispatch = useDispatch();

  const isAuth = useSelector(state => state.auth.isAuth);

  useEffect(()=>{
    dispatch(setIsAuth(localStorage.getItem("isAuth")));
  },[])
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
              <Link to="/user/logout">
                <img src={loginIcon} alt="" />
                <span>로그아웃</span>
              </Link>
            </li>
            <li>
              <a href="#"><img src={noticeIcon} alt="" /><span>알림</span></a>
            </li>
            <li>
              <Link to="/mypage/">
                <img src={menuIcon} alt="" />
              </Link>
            </li>
          </ul>
          :
          <ul>
            <li>
              <Link to="/user/login">
                <img src={loginIcon} alt="" />
                <span>로그인</span>
              </Link>
            </li>
          </ul>
        }
      </nav>

      <div className="line" />
    </header>
  );
};

export default MainHeader;