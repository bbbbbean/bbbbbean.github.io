import { Link } from "react-router-dom";
import "../../css/common_css/alarm.css"
import api from "../../axios"
import { WebSocketContext } from '../../WebSocket'
import { useContext } from "react";

const Alarm = ({ openAlarm, alarmList, setOpenAlarm }) => {

    const { setAlarmUpdate } = useContext(WebSocketContext);

    const delNotification = (notificationId) =>{
        api.post("api/chat/alarm/del",{notificationId})
        .then(response =>{
            setAlarmUpdate(prev => (!prev));
        }).catch(error =>{

        })
    }

    const delAllNotification = () =>{
        api.post("api/chat/alarm/del",{"notificationId":null})
        .then(response =>{
            setAlarmUpdate(prev => (!prev));
        }).catch(error =>{

        })
    }

    return (
        <div className="alert-container" style={{ width: openAlarm ? "300px" : "0px"}}>
            <div className="alert-content">
                <div className="alert-header">
                    <h2>알림</h2>
                    <button className="close" onClick={() => setOpenAlarm(false)}>x</button>
                </div>
                <div className="alert-list">
                    {alarmList.length != 0 && <button onClick={delAllNotification}>전체삭제</button>}
                    <ul>
                        {alarmList.map((item) => {
                            return (
                                <li className="alert-item" key={item.notificationId}>
                                    <div className="alert-item-header">
                                        <div className="alert-type">{item.type}</div>
                                        <button className="close" onClick={() => delNotification(item.notificationId)}>x</button>
                                    </div>
                                    <div className="alert-message" dangerouslySetInnerHTML={{ __html: item.content }} />
                                    {item.from !== null &&
                                        <Link to={`/community/select/${item.from}`}>
                                            <span>바로가기</span>
                                        </Link>
                                    }
                                    <span className="alert-time">{item.time}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Alarm;