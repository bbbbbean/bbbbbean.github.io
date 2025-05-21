import { useCallback, useState } from "react";
import "../../css/modal/imageChange.css"
import imageApi from "../../ImageAxios";
import { useDropzone } from 'react-dropzone'
import addImg from "../../image/add_img.svg"

const ChangeImage = ({setProfile}) => {

    const [selImage, setSelImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const onDrop = useCallback(acceptedFiles => {
        setErrorMessage("");
        if (!acceptedFiles[0].type.indexOf("image")) {
            setSelImage(acceptedFiles[0]);
        } else {
            setErrorMessage("이미지파일이 아닙니다.");
            setSelImage(null);
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handleImageChange = (e) => {
        e.preventDefault();
        imageApi.post("/api/user/updateImg", { "userId": localStorage.getItem("userId"), "image": selImage })
            .then((response) => {
                console.log(response.status);
                if (response.status == 200) {
                    setProfile("");
                    setTimeout(() => {setProfile(localStorage.getItem("profile"));},0);
                } else {
                    setErrorMessage("이미지파일이 아니거나 파일이 등록되지 않았습니다.");
                }
            }).catch((error) => {
                console(error);
            });
    }

    return (
        <div className="image-modal">
            <div className="image-modal-content">
                <div className="image-drag" {...getRootProps()}>
                    <img className={!selImage && "no"} src={selImage ? URL.createObjectURL(selImage) : addImg} alt="Select" />
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>이 이미지 맞아?</p> :	// 파일이 박스 안에 있을 때
                            <p>파일을 드래그하거나 클릭하여 이미지를 업로드하세요.</p>
                    }
                    {errorMessage ? <span style={{ color: "#dd3e3e", fontWeight: "bold" }}>{errorMessage}</span> : <br></br>}
                </div>
                <button type="button" onClick={handleImageChange}>저장</button>
            </div>
        </div>
    );
}

export default ChangeImage;