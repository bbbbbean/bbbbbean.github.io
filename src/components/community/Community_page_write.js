import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import "../../css/CSS_community-page/community_page_write.css";
import imageApi from "../../ImageAxios";

import "quill/dist/quill.snow.css"; // For Snow theme

const SizeStyle = Quill.import("attributors/style/size");
const fontSize = ["small", "normal", "large"]; // 사이즈 조절
SizeStyle.whitelist = fontSize;
Quill.register(SizeStyle, true);

// 파일 아이콘을 위한 SVG 직접 등록
const Icons = Quill.import("ui/icons");
Icons[
  "file"
] = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>`;

// 이미지 업로드 핸들러
const handleImageUpload = (quill, userId, postId) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      imageApi
        .post(`/upload/image/${userId}/${postId}`, formData)
        .then((response) => {
          if (response.ok) {
            const data = response.data;
            const imageUrl = data.fileUrl; // 서버에서 반환된 이미지 URL
            const postAttachmentId = data.postAttachmentId; // 서버에서 반환된 첨부파일 ID

            // Quill에 이미지 삽입
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, "image", imageUrl);
              quill.setSelection(range.index + 1); // 커서 위치 조정
            }
          } else {
            console.error(
              "이미지 업로드 실패:",
              response.status,
              response.statusText || response.data.message || "Unknown error"
            );
            alert("이미지 업로드에 실패했습니다.");
          }
        })
        .catch((error) => {
          console.error("이미지 업로드 중 오류 발생:", error);
          alert("이미지 업로드 중 오류가 발생했습니다.");
        });
    }
  };

  // --- 파일 업로드 핸들러
  const handleFileAttachment = (quill, userId, postId) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.onchange = () => {
      const file = input.files[0]; // 선택된 파일
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        imageApi
          .post(`/upload/file/${userId}/${postId}`, formData)
          .then((response) => {
            if (response.status === 200) {
              const data = response.data;
              const fileUrl = data.fileUrl;
              const fileName = data.fileName;
              const postAttachmentId = data.postAttachmentId;

              const range = quill.getSelection(true);
              if (range) {
                const fileLinkText = `[${fileName}]`;
                quill.insertText(range.index, fileLinkText, "link", fileUrl);
                quill.setSelection(range.index + fileLinkText.length);
              }
              console.log("파일 업로드 성공:", data);
            } else {
              console.error(
                "파일 업로드 실패 :",
                response.status,
                response.statusText || response.data.message || "Unknown error"
              );
              alert("파일 업로드 실패");
            }
          })
          .catch((error) => {
            console.error("파일 업로드 중 오류 발생:", error);
            alert("파일 업로드 중 오류가 발생했습니다.");
          });
      }
    };
  };
};

function Community_page_write() {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const [editorContent, setEditorContent] = useState("");

  const currentUserId = "testUser";
  const currentPostId = 1; // "1L"은 JavaScript에서 문자열이므로 숫자로 변경 (백엔드 Long 타입에 맞춰)

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "내용을 입력하세요",
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
                  currentUserId,
                  currentPostId
                );
              },
              file: () =>
                handleFileAttachment(
                  quillInstance.current,
                  currentUserId,
                  currentPostId
                ),
            },
          },
        },
      });

      quillInstance.current.root.innerHTML = editorContent;
      quillInstance.current.on("text-change", () => {
        setEditorContent(quillInstance.current.root.innerHTML);
      });
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, []);

  const handleSaveContent = () => {
    console.log("Editor Content:", editorContent);
  };

  return (
    <div>
      <h3>여기에 운동, 게임, 자유게시판 등 어느게시판에 올릴지 표시</h3>

      <div
        ref={editorRef}
        style={{ height: "300px", border: "1px solid #ccc" }}
      ></div>
      <p>↓↓↓↓HTML 표시형식(나중에 삭제 또는 invisible)</p>
      <div style={{ border: "1px solid #eee", padding: "10px" }}>
        {editorContent}
      </div>
      <button onClick={handleSaveContent}>Log Editor Content</button>
    </div>
  );
}

export default Community_page_write;
