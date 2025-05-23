
import { useEffect, useState } from "react";
import "../../css/modal/calendarMemo.css"
import api from "../../axios";

const CalendarMemoViewModal = ({ calendarId, setviewModal, setHasUpdated }) => {

    const [content, setContent] = useState("");
    const [oldContent, setOldContent] = useState("");
    const [date, setDate] = useState("");
    const [editMemo, setEditMemo] = useState(false);

    useEffect(() => {
        api.post("api/calendar/getMemo", { calendarId })
            .then((response) => {
                setDate(response.data.noteData.date);
                setContent(response.data.noteData.content);
                setOldContent(response.data.noteData.content);
            });
    }, [calendarId]);

    const handleButton = (e) => {
        if (editMemo) {
            if (content === oldContent) {
                setEditMemo(!editMemo);
                return;
            }
            api.post("api/calendar/editMemo", { calendarId, content })
                .then((response) => {
                    if (response.status === 200) {
                        setHasUpdated(prev => !prev);
                    } else {
                        setContent(oldContent);
                    }
                });
        }
        setEditMemo(!editMemo);
    }

    return (
        <div className="memo-modal">
            <button onClick={() => setviewModal(false)}>X</button>
            <div className="memo-modal-content">
                <div>{date}</div>
                {editMemo ?
                    <div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="text" name="content" value={content}
                                onChange={
                                    (e) => setContent(e.target.value)
                                } />
                            <div>
                                <button onClick={handleButton}>저장</button>
                            </div>
                        </form>
                    </div>
                    :
                    <div>{content}</div>}
                {!editMemo &&<div>
                    <br></br>
                    <button onClick={handleButton}>수정</button></div>}
            </div>
        </div>
    );
}


const CalendarMemoAddModal = ({ date, setAddModal, setHasUpdated }) => {

    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post("api/calendar/addMemo", {
            "userId": localStorage.getItem("userId"),
            "date": date,
            "content": content
        }).then((response) => {
            setAddModal(false);
            setHasUpdated((prev) => !prev);
        });
    }

    return (
        <div className="memo-modal">
            <button onClick={() => setAddModal(false)}>X</button>
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

export default { CalendarMemoAddModal, CalendarMemoViewModal };
