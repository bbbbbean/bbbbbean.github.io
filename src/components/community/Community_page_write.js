import React, { useRef, useEffect, useState, useCallback } from "react";
import Quill from "quill";
import "../../css/CSS_community-page/community_page_write.css";
import api from "../../axios";
import imageApi from "../../ImageAxios";
import file_icons from "./images/file_icon.svg";

import "quill/dist/quill.snow.css"; // For Snow theme
import { ImageResize } from "quill-image-resize-module-ts";

if (typeof window !== "undefined" && window.Quill) {
  window.Quill = Quill;
}

Quill.register("modules/ImageResize", ImageResize);

const SizeStyle = Quill.import("attributors/style/size");
const fontSize = ["small", "normal", "large"]; // 사이즈 조절
SizeStyle.whitelist = fontSize;

// 파일 아이콘을 위한 SVG 직접 등록
const Icons = Quill.import("ui/icons");
Icons["file"] = `<img src=${file_icons}/>`;

function Community_page_write() {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState(""); // 게시글 제목
  const [selectedPostCodeId, setSelectedPostCodeId] = useState(5); // 게시판 코드 ID, 5는 자유게시판(디폴트)
  const [uploadFiles, setUploadFile] = useState([]);

  // 이미지 업로드 핸들러
  const handleFileUpload = useCallback(() => {
    const quill = quillInstance.current;
    let isMounted = true;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.onchange = () => {
      if (!isMounted) return;

      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        imageApi
          .post(`/upload/file`, formData)
          .then((response) => {
            const data = response.data;
            const imageUrl = data.fileUrl;

            // Quill에 이미지 삽입
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, "image", imageUrl);
              quill.setSelection(range.index + 1); // 커서 위치 조정
            } else {
              // 커서가 없을 경우 (예: 에디터가 비어있을 때) 맨 마지막에 삽입
              quill.insertEmbed(quill.getLength(), "image", imageUrl);
              quill.setSelection(quill.getLength() + 1);
            }
            console.log("이미지 업로드 성공:", imageUrl);
          })
          .catch((error) => {
            console.error("이미지 업로드 중 오류 발생:", error);
            if (error.response) {
              console.error("오류 응답 데이터:", error.response.data);
              console.error("오류 응답 상태:", error.response.status);
            }
            alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
          });
      }
      return () => {
        isMounted = false;
      };
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "내용을 입력하세요.",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ size: fontSize }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["link"],
              ["image"],
              ["file"],
              ["video"],
              ["code-block", "formula"],
              ["clean"],
            ],
            handlers: {
              image: handleFileUpload,
              file: handleFileUpload,
            },
          },
          ImageResize: {
            modules: ["Resize", "DisplaySize"],
          },
        },
      });

      quillInstance.current.root.innerHTML = editorContent;
      quillInstance.current.on("text-change", () => {
        setEditorContent(quillInstance.current.root.innerHTML);
      });
    }

    // cleanup 함수: 컴포넌트 언마운트 시 Quill 인스턴스 정리
    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, []);

  // 밑에 단순 보여주기용. 나중에 삭제하거나 해야함
  const handleSaveContent = useCallback(() => {
    console.log("Editor Content:", editorContent);
  }, [editorContent]);

  // 저장 버튼 누르면 실행
  const uploadpost = () => {
    console.log("글 저장합니다");
    const currentEditorContent = quillInstance.current
      ? quillInstance.current.root.innerHTML
      : "";
    setEditorContent(currentEditorContent);

    const formData = new FormData();
    formData.append(
      "postDTO",
      new Blob(
        [
          JSON.stringify({
            title: title,
            content: currentEditorContent,
            postCodeId: selectedPostCodeId,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (!quillInstance.current) {
      console.error("Quill 인스턴스가 초기화되지 않았습니다.");
      return;
    }

    // 일반 첨부 파일들을 FormData에 추가
    if (uploadFiles && uploadFiles.length > 0) {
      uploadFiles.forEach((file) => {
        formData.append("files", file);
      });
    }

    // Postservice.savePost 호출
    api
      .post("/post/save", formData, {
        // headers: {
        // "Content-Type": "multipart/form-data", // 파일 업로드를 위해 content-type 변경. 그런데 브라우저가 자동으로 설정하므로 제거하라함
        // },
      })
      .then((response) => {
        console.log("게시글 저장 : ", response.data);
        if (response.data.success) {
          alert("게시글 저장 성공!");
          window.location.href = "/community"; // 성공 시 이동. 나중에 방금 쓴 글로 이동하게 하기
        } else {
          alert("오류발생! 게시글을 저장하지 못했습니다.");
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류 발생 : ", error);
        if (error.response) {
          console.error("게시글 오류 응답 데이터 : ", error.response.data);
          console.error("게시글 오류 응답 상태 : ", error.response.status);
          alert(
            "오류발생! 게시글을 저장하지 못했습니다. (응답 상태: " +
              error.response.status +
              ")"
          );
        } else {
          console.log("게시글 저장 중 알 수 없는 오류 발생...");
          alert("오류발생! 게시글 저장 중 알 수 없는 오류 발생...");
        }
      });
  };

  return (
    <div>
      <h3>여기에 운동, 게임, 자유게시판 등 어느게시판에 올릴지 표시</h3>
      <select
        value={selectedPostCodeId}
        onChange={(e) => setSelectedPostCodeId(parseInt(e.target.value))}
      >
        <option value="1">운동</option>
        <option value="2">게임</option>
        <option value="3">취미</option>
        <option value="4">여행</option>
        <option value="5">자유게시판</option>
      </select>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <input
        type="file"
        multiple // 여러 파일 선택 가능하도록
        onChange={(e) => setUploadFile(Array.from(e.target.files))} // 파일 목록을 배열로 저장
        style={{ marginTop: "1px" }}
      />
      <div
        ref={editorRef}
        style={{ height: "300px", border: "1px solid #ccc" }}
      ></div>

      <div className="button_area">
        <button className="uploadpost" onClick={uploadpost}>
          저장하기
        </button>
      </div>

      <p>↓↓↓↓HTML 표시형식(나중에 삭제 또는 invisible)</p>
      <div style={{ border: "1px solid #eee", padding: "10px" }}>
        {editorContent}
      </div>
      <button onClick={handleSaveContent}>Log Editor Content</button>
    </div>
  );
}

export default Community_page_write;
