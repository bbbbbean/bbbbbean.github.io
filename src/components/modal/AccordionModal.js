import { useEffect, useState } from "react";
import chatIcon from "../../image/image_main/chat-icon.svg";
import calendarIcon from "../../image/image_main/calendar-icon.svg";
import callIcon from "../../image/image_main/call-icon.svg";
import UserCalendar from "../calendar/UserCalendar";
import "../../css/modal/accordionModal.css";
import { useLocation } from "react-router-dom";


const AccordionModal = () => {

    const isAuth = localStorage.getItem("isAuth");

    const location = useLocation().pathname;


    // 상태 관리: accordion 열기/닫기
    const [activeAccordion, setActiveAccordion] = useState(null);

    useEffect(() => {
        setActiveAccordion(null);
    }, [location]);

    // 상태 관리: accordion modal 열기/닫기
    const [isOpen, setIsOpen] = useState(true);

    const handleAccordionClick = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const AccordionMenu =
        isAuth
            ? [
                { title: "채팅", icon: chatIcon, index: 1 },
                { title: "달력", icon: calendarIcon, index: 2 },
                { title: "1:1 문의", icon: callIcon, index: 3 }
            ]
            : [];

    const AccordionFilter = AccordionMenu.filter(item => {
        if (item.title === "달력" && location.includes("mypage")) {
            return false;
        } else if (item.title === "채팅" && location.includes("friend")) {
            return false;
        }
        return true;
    })
    return (
        <div className="Accordion-modal">
            <div id="Accordion_wrap" className={activeAccordion === 2 ? 'caldendar' : ""}
                style={{ width: isOpen ? '140px' : '0px' }}>
                <button className="accordion-button" onClick={() => {
                    setIsOpen(!isOpen)
                    setActiveAccordion(null);
                }}
                    style={{ height: !isOpen && AccordionFilter.length * 45, top: isOpen && '-20px', right: isOpen && '0px' }}>
                    {isOpen ? ">" : "<"}
                </button>
                {/* Accordion */}
                {AccordionFilter.map((item) => (
                    <div key={item.index}>
                        <div className={`que ${activeAccordion === item.index ? 'on' : ''}`} onClick={() => handleAccordionClick(item.index)}>
                            <img
                                src={item.icon} alt="아이콘" />
                            <span>{item.title}</span>
                        </div>
                        {item.title === "채팅" &&
                            <div className="anw" style={{ height: activeAccordion === item.index ? '40px' : '0px' }}>
                                <div>채팅 연결</div>
                            </div>}
                        {item.title === "달력" &&
                            <div className="anw" style={{ width: '500px', height: activeAccordion === item.index ? '530px' : '0px' }}>
                                <UserCalendar />
                            </div>}
                        {item.title === "1:1 문의" &&
                            <div className="anw" style={{ height: activeAccordion === item.index ? '40px' : '0px' }}>
                                <div>챗봇 연결</div>
                            </div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AccordionModal;