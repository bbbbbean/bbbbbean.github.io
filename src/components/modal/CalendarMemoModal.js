
import { useState } from "react";
import "../../css/modal/calendarMemo.css"
import api from "../../axios";

const CalendarMemoModal = ({ date, setShowModal, setAddMemo }) => {

    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post("api/calendar/addMemo", {
            "userId": localStorage.getItem("userId"),
            "date": date,
            "content": content
        }).then((response) => {
            setShowModal(false);
            setAddMemo((prev) => prev + 1);
        });
    }

    return (
        <div className="memo-modal">
            <button onClick={() => setShowModal(false)}>X</button>
            <div className="memo-modal-content">
                {date}
                <div className="memo-modal-input">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="메모를 입력하세요"
                            onChange={(e) => setContent(e.target.value)} value={content} />
                            <br />
                        <button type="submit">저장</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CalendarMemoModal;
