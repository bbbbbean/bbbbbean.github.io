import React, { useRef, useEffect, useState, useCallback } from "react";
import Quill from "quill";
import "../../css/CSS_community-page/community_page_write.css";
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

// 이미지 업로드 핸들러
function Community_page_write() {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const [editorContent, setEditorContent] = useState(""); // 게시글 제목 상태
  const [selectedPostCodeId, setSelectedPostCodeId] = useState("");
  const currentPostId = 1;
  const handleImageUpload = useCallback((quill, postId) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        console.log(postId);
        imageApi
          .post(`/upload/image/${postId}`, formData)
          .then((response) => {
            const data = response.data;
            const imageUrl = data.fileUrl;
            const postAttachmentId = data.postAttachmentId;

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
  }, []);

  const handleFileAttachment = useCallback((quill, userId, postId) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.onchange = () => {
      const file = input.files[0]; // 선택된 파일
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        imageApi
          .post(`/upload/file/${postId}`, formData)
          .then((response) => {
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
  }, []);

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
                handleImageUpload(quillInstance.current, currentPostId);
              },
              file: () =>
                handleFileAttachment(quillInstance.current, currentPostId),
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

    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, []);

  const handleSaveContent = () => {
    console.log("Editor Content:", editorContent);
  };

  const uploadpost = async () => {
    // console.log("글 저장합니다");
    // const postData = {
    //   title: title,
    //   content: editorContent,
    // };
    // try {
    //   const response = await imageApi.post("/api/posts", postData);
    // } catch {}
  };

  return (
    <div>
      <h3>여기에 운동, 게임, 자유게시판 등 어느게시판에 올릴지 표시</h3>

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
