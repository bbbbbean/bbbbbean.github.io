import { useEffect, useState } from "react";
import "../../css/common_css/alarm.css"
import api from "../../axios";

const Alarm = ({openAlarm, alarmList}) => {

    return (
        <div className="alert-container" style={{width: openAlarm ? "300px" : "0px"}}>
            <div className="alert-content">
                <div className="alert-header">
                    <h2>알림</h2>
                </div>
                <div className="alert-list">
                    <ul>
                        {alarmList.map((item) => {
                            return (
                                <li className="alert-item" key={item.notificationId}>
                                    <div className="alert-item-header">
                                        <div className="alert-type">{item.type}</div>
                                        <button className="close">x</button>
                                    </div>
                                    <span className="alert-message">{item.content}</span>
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