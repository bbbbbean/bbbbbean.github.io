import { useEffect, useState, useRef } from "react";
import chatIcon from "../../image/image_main/chat-icon.svg";
import calendarIcon from "../../image/image_main/calendar-icon.svg";
import callIcon from "../../image/image_main/call-icon.svg";
import UserCalendar from "../calendar/UserCalendar";
import "../../css/modal/accordionModal.css";
import { useLocation } from "react-router-dom";
import FriendRight from "../message/FriendRight";
import '../../css/message_css/message.css';

import Draggable from 'react-draggable';

const AccordionModal = () => {
  const isAuth = localStorage.getItem("isAuth");
  const location = useLocation().pathname;

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [wasDragging, setWasDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const prevYOffset = useRef(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentYOffset = window.pageYOffset;
      const delta = currentYOffset - prevYOffset.current;
      setPosition(prev => ({
        x: prev.x,
        y: prev.y + delta
      }));
      prevYOffset.current = currentYOffset;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveAccordion(null);
  }, [location]);

  const handleAccordionClick = (index, e) => {
    if (wasDragging) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
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
    <>
      <Draggable
        position={position}
        onStart={() => {
          setDragging(true);
          setWasDragging(false);
        }}
        onDrag={() => {
          setWasDragging(true);
        }}
        onStop={(e, data) => {
          setDragging(false);
          setPosition({ x: data.x, y: data.y });
          setTimeout(() => setWasDragging(false), 100);
        }}
      >
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
                if (wasDragging) {
                  e.stopPropagation();
                  e.preventDefault();
                  return;
                }
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
                  <img src={item.icon} alt="아이콘" />
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
      </Draggable>

      {wasDragging && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            backgroundColor: 'transparent',
            cursor: 'grabbing',
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
    </>
  );
};

export default AccordionModal;
