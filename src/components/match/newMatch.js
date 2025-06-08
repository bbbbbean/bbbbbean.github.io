import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import KakaoPostcodeMap from "../map/map"
import api from "../../axios"
import "../../css/matching_css/newMatch.css";


const NewMatch = ()=>{
 
    const [form, setForm] = useState({
        kategorie:'1',
        title: '',
        startTime: '',
        location: '온라인',
        people: '',
        // 0 : 익명 , 1 : 실명
        anonymousCondi: '1',
        mannerCondi: '50',
        // 0 : 동성 , 1 : 전체
        genderCondi: '1'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "title" && value.length > 30) return;
        setIsWarn("");
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [isOnline, setIsOnline] = useState(true);
    const [onKategorie, setOnKategorie] = useState(1);
    const [isWarn, setIsWarn] = useState("");
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate();

    const handleLocationSelect = (selectedAddress) => {
        setForm((prev) => ({ ...prev, location: selectedAddress }));
    };

    const MAX_TAGS = 5;

    const handleKeyDown = (e) => {
        setIsWarn("");
        const trimmed = inputValue.trim();

        if ((e.key === " " || e.key === "Enter") && trimmed !== "") {
            e.preventDefault();
            if (tags.length >= MAX_TAGS) {
                alert(`최대 ${MAX_TAGS}개의 태그만 입력할 수 있습니다.`);
                return;
            }
            if (!tags.includes(trimmed)) {
                setTags([...tags, trimmed]);
            }
            setInputValue("");
        }
        if (tags.length >= MAX_TAGS) {
            return;
        }
    };
    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, i) => i !== indexToRemove));
    };


    const openHelp = (e)=>{
        const helpEl=document.querySelectorAll(".new-match-help-el")
        console.log(e.target.dataset.condi);
        if(e.target.dataset.condi==='1'){
            helpEl[0].style.display="block";
        }else if(e.target.dataset.condi==='2'){
            helpEl[1].style.display="block";
        }else if(e.target.dataset.condi==='3'){
            helpEl[2].style.display="block";
        }else if(e.target.dataset.condi==='4'){
            helpEl[3].style.display="block";
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
        }else if(e.target.dataset.condi==='4'){
            helpEl[3].style.display="none";
        }
    }
    // 확인...
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("제목:", form.title);
        console.log("시작 시간:", form.startTime);
        console.log("온라인 여부:", isOnline ? "온라인" : "오프라인");
        console.log("위치:", form.location);
        console.log("익명 조건:", form.anonymousCondi);
        console.log("매너 조건:", form.mannerCondi);
        console.log("성별 조건:", form.genderCondi);
        console.log("태그:", tags);
        const requestData = {
            ...form,
            tags: tags
        };
        console.log(requestData);

        api.post("/match/list/newMatch",requestData)
            .then((resp)=>{
                if(resp.status==200)
                    navigate("/match/list");
                else{
                    setIsWarn(resp.data.warnning)
                }
            })
            .catch(()=>{
            })
    };

    return(
        
        <>
        <div className="new-match-wrap">
            <div className="new-match-title"><span>매칭</span><span> 등록</span></div>
            <form className="new-match-form" onSubmit={handleSubmit}>
                <span className="new-match-warn">{isWarn}</span>
                <div className="new-match-kategorie">
                    <label>카테고리</label>
                    <div>
                        <div>
                            <span className={onKategorie==1 ? "new-match-check" : ""} value="1"
                                onClick={() => {setOnKategorie(1); setForm((prev)=>({...prev, kategorie: 1}))}}>운동</span>
                            <span className={onKategorie==2 ? "new-match-check" : ""} value="2"
                                onClick={() => {setOnKategorie(2); setForm((prev)=>({...prev, kategorie: 2}))}}>여행</span>
                            <span className={onKategorie==3 ? "new-match-check" : ""} value="3"
                                onClick={() => {setOnKategorie(3); setForm((prev)=>({...prev, kategorie: 3}))}}>게임</span>
                            <span className={onKategorie==4 ? "new-match-check" : ""} value="4"
                                onClick={() => {setOnKategorie(4); setForm((prev)=>({...prev, kategorie: 4}))}}>기타</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label>제목</label>
                    <input type="text" name="title" placeholder="30자까지 입력 가능합니다" value={form.title} onChange={handleChange} />
                    {form.title.length >= 30 && (<span className="new-match-warning">30자까지 입력 가능합니다.</span>)}
                </div>
                <div>
                    <label>날짜</label>
                    <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange}/>
                </div>
                <div className={isOnline ? "new-match-on new-match-defalt" : "new-match-off new-match-defalt"}>
                    <label>위치</label>
                    <div>
                        <div>
                            <span className={isOnline ? "new-match-check" : ""}
                                onClick={() => {setIsOnline(true); setForm((prev)=>({...prev, location: "온라인"}))}}>온라인</span>
                            <span className={!isOnline ? "new-match-check" : ""}
                                onClick={() => setIsOnline(false)}>오프라인</span>
                        </div>
                        <div style={isOnline ? {display:"none"} : {display:"block"}}>
                            <KakaoPostcodeMap onSelectLocation={handleLocationSelect}/>
                        </div>
                    </div>
                </div>
                <div>
                    <label>전체 인원 <span className="new-match-help" data-condi="1" onMouseEnter={openHelp} onMouseLeave={closeHelp}>?</span></label>
                    <input type="number" max={50} min={1} placeholder="최대 50명까지 가능합니다" name="people" onChange={handleChange}/>
                    <p className="new-match-help-el">본인 포함 전체 인원수를 선택해주세요</p>
                </div>
                <div className="new-match-radio">
                    <label>익명 여부 <span className="new-match-help" data-condi="2" onMouseEnter={openHelp} onMouseLeave={closeHelp}>?</span> </label>
                    <input type="radio" name="anonymousCondi" value="0" checked={form.anonymousCondi === "0"} onChange={handleChange}/> <span>O</span>
                    <input type="radio" name="anonymousCondi" value="1" checked={form.anonymousCondi === "1"} onChange={handleChange}/> <span>X</span>
                    <p className="new-match-help-el">익명 설정 시 닉네임만 보여집니다</p>
                    
                </div>  
                <div>
                    <label>매너 제한 <span className="new-match-help" data-condi="3" onMouseEnter={openHelp} onMouseLeave={closeHelp}>?</span></label>
                    <input type="text" name="manner_condi"/>
                    <p className="new-match-help-el">기본 설정 안내</p>
                </div>
                <div className="new-match-radio">
                    <label>동성 여부 <span className="new-match-help" data-condi="4" onMouseEnter={openHelp} onMouseLeave={closeHelp}>?</span> </label>
                    <input type="radio" name="genderCondi" value="0" checked={form.genderCondi === "0"} onChange={handleChange}/> <span>O</span>
                    <input type="radio" name="genderCondi" value="1" checked={form.genderCondi === "1"} onChange={handleChange}/> <span>X</span>
                    <p className="new-match-help-el">호스트 성별을 기준으로 설정됩니다</p>
                    
                </div>
                <div>
                    <label>태그</label>
                        <input
                            type="text"
                            className=""
                            name="tag"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="최대 5개까지 입력 가능합니다."
                        />
                        <p className="match-tag-help">공백으로 태그 구분 가능</p>
                </div>
                <div>
                    {tags.map((tag, index) => (
                        <span key={index}>
                            {tag}
                            <button onClick={() => removeTag(index)} type="button">×</button>
                        </span>
                    ))}
                </div>
                <button type="submit">매칭 등록</button>

            </form>
        </div>
        </>
    )
}

export default NewMatch;