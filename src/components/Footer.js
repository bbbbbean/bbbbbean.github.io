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
            회사소개 | 비즈니스 | 맞춤형광고 | 제휴문의 | 인재채용
          </span>
          <ul className="footer-sns">
            <li>
              <a href="">
                <span>유투브</span>
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
          <span className="footer-info">CompanyName @ 2025. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;