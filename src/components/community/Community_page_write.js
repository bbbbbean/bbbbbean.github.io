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
  const [currentTempPostId, setTempPostId] = useState("temp");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.warn("로그인된 사용자 ID를 찾을 수 없습니다.");
      window.location.href = "/user/login"; // 로그인 페이지로 이동
    }
  }, []);

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    (quill, currentUserId, currentTempPostId) => {
      let isMounted = true;

      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = () => {
        if (!isMounted) return;

        const file = input.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("userId", currentUserId);
          formData.append("postId", currentTempPostId);

          imageApi
            .post(
              `/upload/image/${currentUserId}/${currentTempPostId}`,
              formData
            )
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
      };
    },
    []
  );

  // 파일 첨부 핸들러
  const handleFileAttachment = useCallback(
    (quill, currentUserId, currentTempPostId) => {
      let isMounted = true;

      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.click();

      input.onchange = () => {
        if (!isMounted) return;

        const file = input.files[0]; // 선택된 파일
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("userId", currentUserId);
          formData.append("postId", currentTempPostId);

          api
            .post(
              `/upload/file/${currentUserId}/${currentTempPostId}`,
              formData
            )
            .then((response) => {
              const data = response.data;
              const fileUrl = data.fileUrl;
              const fileName = data.fileName;

              const range = quill.getSelection(true);
              if (range) {
                const fileLinkText = `[${fileName}]`;
                quill.insertText(range.index, fileLinkText, "link", fileUrl);
                quill.setSelection(range.index + fileLinkText.length);
              }
              console.log("파일 업로드 성공:", data);
            })
            .catch((error) => {
              console.error("파일 업로드 중 오류 발생:", error);
              if (error.response) {
                console.error("오류 응답 데이터:", error.response.data);
                console.error("오류 응답 상태:", error.response.status);
              }
              alert("파일 업로드 중 오류가 발생했습니다.");
            });
        }
      };
    },
    []
  );

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
              image: () => {
                handleImageUpload(
                  quillInstance.current,
                  userId,
                  currentTempPostId
                );
              },
              file: () =>
                handleFileAttachment(
                  quillInstance.current,
                  userId,
                  currentTempPostId
                ),
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
  }, [userId, currentTempPostId]);

  const handleSaveContent = useCallback(() => {
    console.log("Editor Content:", editorContent);
  }, [editorContent]);

  const uploadpost = async () => {
    console.log("글 저장합니다");
    if (!userId || !currentTempPostId) {
      alert("로그인하세요!, 로그인하지 않은 상태로는 글을 저장할 수 없습니다.");
      window.location.href = "/user/login"; // 로그인 페이지로 이동
      return;
    }
    const postData = {
      userId: userId,
      title: title,
      content: editorContent,
      postCodeId: selectedPostCodeId,
      currentTempPostId: currentTempPostId,
    };
    try {
      // Postservice.savePost 호출
      const response = await api.post("/api/posts", postData);
      console.log("게시글 저장 : ", response.data);
      if (response.data.success) {
        const actualPostId = response.data.postId;
        await fileService.confirmAndMoveFiles(
          localStorage.getItem("userId"),
          actualPostId,
          String(currentTempPostId), // 임시 postId를 String으로 변환
          editorContent
        );
        alert("게시글 저장 성공!");
      } else {
        alert("오류발생! 게시글을 저장하지 못했습니다.");
      }
    } catch (error) {
      console.error("게시글 저장 중 오류 발생 : ", error);
      if (error.response) {
        console.error("게시글 오류 응답 데이터 : ", error.response.data);
        console.error("게시글 오류 응답 상태 : ", error.response.status);
      } else {
        console.log("게시글 저장 중 알 수 없는 오류 발생...");
      }
    }
  };

  return (
    <div>
      <h3>여기에 운동, 게임, 자유게시판 등 어느게시판에 올릴지 표시</h3>
      <select
        value={selectedPostCodeId}
        onChange={(e) => setSelectedPostCodeId(parseInt(e.target.value))}
      >
        <option value="5">자유게시판</option>
      </select>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
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
