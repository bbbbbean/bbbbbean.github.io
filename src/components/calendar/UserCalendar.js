import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../../css/calender_css/custom_calender.css";
import CalendarModal from '../modal/CalendarMemoModal';
import api from '../../axios';



function UserCalendar() {
  const [value, onChange] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setviewModal] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [note, setNote] = useState([]);
  const [keyEvent, setKeyEvent] = useState(false);
  const [calendarId, setCalendarId] = useState(0);

  const handleRightClick = (e) => {
    e.preventDefault();
    console.log(e.target.dataset.id);
      setCalendarId(e.target.dataset.id);
    if (keyEvent) {
      api.post("api/calendar/deleteMemo", { "calendarId":e.target.dataset.id })
        .then((response) => {
          setHasUpdated(!hasUpdated);
        });
    } else {
      setviewModal(true);
      setAddModal(false);
    }
  }

  const dummy = (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Shift") {
        setKeyEvent(true);
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "Shift") {
        setKeyEvent(false);
      }
    });
  }, []);

  useEffect(() => {
    api.post("api/calendar/getMemo", { userId: localStorage.getItem("userId"), "year": selectedDate.getFullYear(), "month": selectedDate.getMonth() + 1 })
      .then((response) => {
        setNote(response.data.noteData);
      });
  }, [selectedDate, hasUpdated]);

  return (
    <div onContextMenu={dummy} style={{ position: "relative" }}>
      {viewModal && <CalendarModal.CalendarMemoViewModal calendarId={calendarId} setviewModal={setviewModal} setHasUpdated={setHasUpdated} />}
      {addModal && <CalendarModal.CalendarMemoAddModal date={date} setAddModal={setAddModal} setHasUpdated={setHasUpdated} />}
      <Calendar
        onChange={onChange}
        value={value}
        next2Label={null}
        prev2Label={null}
        showFixedNumberOfWeeks={true}
        nextLabel={<span className="next-label">다음</span>}
        prevLabel={<span className="prev-label">이전</span>}
        formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
        calendarType={'iso8601'}
        navigationLabel={({ date, label, locale, view }) => {
          const month = date.toLocaleString(locale, { month: 'long' });
          const year = date.getFullYear();
          return `${year}년 ${month}`;
        }}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            // 특정 날짜에 클래스 추가
            if (date.getDate() === 15) {
              return 'highlight';
            }
          }
          return null;
        }}
        onActiveStartDateChange={({ action, activeStartDate, value, view }) => {
          if (view === 'month') {
            setSelectedDate(activeStartDate);
            setAddModal(false);
          }

        }}
        tileContent={({ date, view }) =>
          view === 'month' ? (
            <div className='calendar-content'>
              {/* 예: 특정 날짜에 표시할 내용 */}
              {note.map((item) => {
                const itemDate = new Date(item.date);
                if (itemDate.getFullYear() === date.getFullYear() && itemDate.getMonth() === date.getMonth() && itemDate.getDate() === date.getDate()) {
                  return <p key={item.calendarId} data-id={item.calendarId} style={{ color: 'orange' }} onContextMenu={handleRightClick}>{item.content}</p>;
                }
                return null;
              })}
            </div>
          ) : null
        }
        onClickDay={(value) => {
          setAddModal(true);
          setviewModal(false);
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
          const day = String(value.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          setDate(formattedDate);
        }}
      />
    </div>
  );
}

export default UserCalendar;