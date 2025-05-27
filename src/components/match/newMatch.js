import { useState } from "react";
import "../../css/matching_css/newMatch.css";


const NewMatch = ()=>{

    return(
        
        <>
        <div className="new-match-wrap">
            <div className="new-match-title"><span>매칭</span><span> 등록</span></div>
            <form className="new-match-form">
                <div>
                    <label>제목</label>
                    <input type="text" name="title" placeholder="30자까지 입력 가능합니다."/>
                    {/* {title.length > 30 && <span>30자까지 입력 가능합니다</span>} */}
                </div>
                <div>
                    <label>날짜</label>
                    <input type="datetime-local" name="startTime"/>
                </div>
                <div>
                    <label>위치</label>
                    <input type="text" name="location"/>
                </div>
                <div className="new-match-radio">
                    <label>익명 여부</label>
                    {/* 기본 상태 설명 */}
                    <input type="radio" name="anonymous_condi" value="Y"/> <span>O</span>
                    <input type="radio" name="anonymous_condi" value="N" checked/> <span>X</span>
                </div>
                <div>
                    <label>매너 제한</label>
                    {/* 기본 상태 설명 */}
                    <input type="text" name="manner_condi"/>
                </div>
                <div className="new-match-radio">
                    <label>동성 여부</label>
                    {/* 기본 상태 설명 */}
                    <input type="radio" name="gender_condi" value="Y"/> <span>O</span>
                    <input type="radio" name="gender_condi" value="N" checked/> <span>X</span>
                </div>
                <div>
                    <label>태그</label>
                    <input type="text" name="tag" placeholder="최대 5개까지 입력 가능합니다."/>
                    <p>공백으로 태그 구분 가능</p>
                </div>
                <div>
                    <button>매칭 등록</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default NewMatch;