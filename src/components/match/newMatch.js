import { useState } from "react";


const NewMatch = ()=>{

    return(

        <>
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
            <div>
                <label>익명 여부</label>
                {/* 기본 상태 설명 */}
                <input type="radio" name="anonymous_condi" value="Y"/> O
                <input type="radio" name="anonymous_condi" value="N" checked/> X
            </div>
            <div>
                <label>매너 제한</label>
                {/* 기본 상태 설명 */}
                <input type="text" name="manner_condi"/>
            </div>
            <div>
                <label>동성 여부</label>
                {/* 기본 상태 설명 */}
                <input type="radio" name="gender_condi" value="Y"/> O
                <input type="radio" name="gender_condi" value="N" checked/> X
            </div>
            <div>
                <label>태그</label>
                <input type="text" name="tag" placeholder="최대 5개까지 입력 가능합니다."/>
                <p>공백으로 태그 구분 가능</p>
            </div>
            <div>
                <button>매칭 등록</button>
            </div>
        </>
    )
}

export default NewMatch;