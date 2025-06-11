import { useEffect, useState, useRef } from "react";
import chatIcon from "../../image/image_main/chat-icon.svg";
import calendarIcon from "../../image/image_main/calendar-icon.svg";
import callIcon from "../../image/image_main/call-icon.svg";
import UserCalendar from "../calendar/UserCalendar";
import "../../css/modal/accordionModal.css";
import { useLocation } from "react-router-dom";
import FriendRight from "../message/FriendRight";
import '../../css/message_css/message.css';

const AccordionModal = () => {
  const isAuth = localStorage.getItem("isAuth");
  const location = useLocation().pathname;

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const prevYOffset = useRef(window.pageYOffset);

  useEffect(() => {
    setActiveAccordion(null);
  }, [location]);

  const handleAccordionClick = (index, e) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const AccordionMenu = isAuth
    ? [
      { title: "채팅", icon: chatIcon, index: 1 },
      { title: "달력", icon: calendarIcon, index: 2 },
      { title: "1:1 문의", icon: callIcon, index: 3 }
    ]
    : [];

  const AccordionFilter = AccordionMenu.filter(item => {
    if (item.title === "달력" && location.includes("mypage")) return false;
    if (item.title === "채팅" && location.includes("friend")) return false;
    return true;
  });

  return (
    <div className="Accordion-modal">
      <div
        id="Accordion_wrap"
        className={
          activeAccordion === 1 ? "accChat" :
            activeAccordion === 2 ? "accCalendar" :
              activeAccordion === 3 ? "" : ""
        }
        style={{ width: isOpen ? '140px' : '40px' }}
      >
        <button
          className="accordion-button"
          onClick={(e) => {
            setIsOpen(!isOpen);
            setActiveAccordion(null);
          }}
          style={{
            height: !isOpen && AccordionFilter.length * 45,
            top: isOpen && '-20px',
            right: isOpen && '0px'
          }}
        >
          {isOpen ? ">" : "<"}
        </button>

        {/* Accordion 리스트 */}
        {AccordionFilter.map((item) => (
          <div key={item.index}>
            <div
              className={`que ${activeAccordion === item.index ? 'on' : ''}`}
              onClick={(e) => handleAccordionClick(item.index, e)}
            >
              <img src={item.icon} alt="아이콘" className="main-aco-icon" />
              <span>{item.title}</span>
            </div>

            {/* 채팅 */}
            {item.title === "채팅" && (
              <div className="anw" style={{ height: activeAccordion === item.index ? '600px' : '0px' }}>
                <div className="friend-container">
                  <FriendRight
                    style1={{ width: '100%' }}
                    style2={{ height: '440px' }}
                    style3={{ height: '450px' }}
                  />
                </div>
              </div>
            )}

            {/* 달력 */}
            {item.title === "달력" && (
              <div className="anw" style={{
                height: activeAccordion === item.index ? '530px' : '0px'
              }}>
                <UserCalendar />
              </div>
            )}

            {/* 1:1 문의 */}
            {item.title === "1:1 문의" && (
              <div className="anw" style={{ height: activeAccordion === item.index ? '40px' : '0px' }}>
                <div>챗봇 연결</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccordionModal;
