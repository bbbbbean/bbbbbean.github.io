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
                <div className="new-match-on">
                    <label>위치</label>
                    {/* 토글, 오프일 때 위치칸 아래로 늘어나면서 주소 입력 칸 생성 */}
                    <div>
                        <div>
                            <input type="radio" name="match-off" value="Y" checked/><span className="new-match-check">온라인</span>
                            <input type="radio" name="match-off" value="N" /><span>오프라인</span>
                        </div>
                        <input type="text" name="location" className="new-match-on-el"/>
                    </div>
                </div>
                <div className="new-match-radio">
                    <label>익명 여부 <span className="new-match-help">?</span> </label>
                    <input type="radio" name="anonymous_condi" value="Y"/> <span>O</span>
                    <input type="radio" name="anonymous_condi" value="N" checked/> <span>X</span>

                    <p className="new-match-help-el">익명 설정 시 닉네임만 보여집니다</p>
                    
                </div>
                <div>
                    <label>매너 제한 <span className="new-match-help">?</span></label>
                    <input type="text" name="manner_condi"/>
                    <p className="new-match-help-el">기본 설정 안내</p>
                </div>
                <div className="new-match-radio">
                    <label>동성 여부 <span className="new-match-help">?</span></label>
                    <input type="radio" name="gender_condi" value="Y"/> <span>O</span>
                    <input type="radio" name="gender_condi" value="N" checked/> <span>X</span>
                    <p className="new-match-help-el">O 입력시 호스트와 동일한 성별만 참가 가능합니다</p>
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