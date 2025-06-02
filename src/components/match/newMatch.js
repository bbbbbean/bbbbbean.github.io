import { useState } from "react";
import KakaoPostcodeMap from "../map/map"
import "../../css/matching_css/newMatch.css";


const NewMatch = ()=>{
    
    const [title, setTitle] = useState("");
    const [isOnline, setIsOnline] = useState(true);

    const openHelp = (e)=>{
        const helpEl=document.querySelectorAll(".new-match-help-el")
        console.log(e.target.dataset.condi);
        if(e.target.dataset.condi==='1'){
            helpEl[0].style.display="block";
        }else if(e.target.dataset.condi==='2'){
            helpEl[1].style.display="block";
        }else if(e.target.dataset.condi==='3'){
            helpEl[2].style.display="block";
        }
    }
    const closeHelp = (e)=>{
        const helpEl=document.querySelectorAll(".new-match-help-el")
        console.log(e.target.dataset.condi);
        if(e.target.dataset.condi==='1'){
            helpEl[0].style.display="none";
        }else if(e.target.dataset.condi==='2'){
            helpEl[1].style.display="none";
        }else if(e.target.dataset.condi==='3'){
            helpEl[2].style.display="none";
        }
    }

    return(
        
        <>
        <div className="new-match-wrap">
            <div className="new-match-title"><span>매칭</span><span> 등록</span></div>
            <form className="new-match-form">
                <div>
                    <label>제목</label>
                    <input type="text" name="title" placeholder="30자까지 입력 가능합니다." value={title} onChange={(e) => {if (e.target.value.length <= 30) {setTitle(e.target.value);}}}/>
                    {title.length >= 30 && (<span className="new-match-warning">30자까지 입력 가능합니다.</span>)}
                </div>
                <div>
                    <label>날짜</label>
                    <input type="datetime-local" name="startTime"/>
                </div>
                <div className={isOnline ? "new-match-on new-match-defalt" : "new-match-off new-match-defalt"}>
                    <label>위치</label>
                    <div>
                        <div>
                            <span className={isOnline ? "new-match-check" : ""}
                                onClick={() => setIsOnline(true)}>온라인</span>
                            <span className={!isOnline ? "new-match-check" : ""}
                                onClick={() => setIsOnline(false)}>오프라인</span>
                        </div>
                        <div>
                            <input type="text" name="location" className={isOnline ? "new-match-on-el" : ""} placeholder="주소를 입력하세요"/>
                            <KakaoPostcodeMap/>
                        </div>
                    </div>
                </div>
                <div className="new-match-radio">
                    <label>익명 여부 <span className="new-match-help" data-condi="1" onMouseEnter={openHelp} onMouseLeave={closeHelp}>?</span> </label>
                    <input type="radio" name="anonymous_condi" value="Y"/> <span>O</span>
                    <input type="radio" name="anonymous_condi" value="N" checked/> <span>X</span>
                    <p className="new-match-help-el">익명 설정 시 닉네임만 보여집니다</p>
                    
                </div>  
                <div>
                    <label>매너 제한 <span className="new-match-help" data-condi="2" onMouseEnter={openHelp} onMouseLeave={closeHelp}>?</span></label>
                    <input type="text" name="manner_condi"/>
                    <p className="new-match-help-el">기본 설정 안내</p>
                </div>
                <div className="new-match-radio">
                    <label>동성 여부 <span className="new-match-help" data-condi="3" onMouseEnter={openHelp} onMouseLeave={closeHelp}>?</span></label>
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