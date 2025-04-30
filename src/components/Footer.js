import { NavLink } from "react-router-dom";
import "../css/common_css/main_footer.css";
import logo from "../image/로고_w.png";

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrap">
        <div className="footer-up">
          <div className="footer-logo">
            <img src={logo} alt="로고" />
          </div>
          <span className="footer-info">
            보통어떤말이들어가있지대충회사정보랑이런저런정보들을넣어놓은장소입니다
          </span>
          <ul className="footer-sns">
            <li>
              <a href="">
                <span>유툽</span>
              </a>
            </li>
            <li>
              <a href="">
                <span>트위터</span>
              </a>
            </li>
            <li>
              <a href="">
                <span>페이스북</span>
              </a>
            </li>
            <li>
              <a href="">
                <span>인스타</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-down">
          <span className="footer-info">CompanyName @ 202X. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;