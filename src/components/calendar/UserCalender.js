import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../../css/calender_css/custom_calender.css";



function UserCalender() {
  const [value, onChange] = useState(new Date());

  return (
    <Calendar
      onChange={onChange}
      value={value}
      formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
      tileContent={({ date, view }) =>
        view === 'month' ? (
          <div>
            {/* 예: 특정 날짜에 표시할 내용 */}
            {date.getDate() === 15 && <p style={{ color: 'blue' }}>시흥 서울</p>}
          </div>
        ) : null
      }
    />
  );
}

export default UserCalender;