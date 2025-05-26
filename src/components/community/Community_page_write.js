import React, { useRef, useEffect, useState } from "react";
import Quill from "quill"; // Make sure to install quill: npm install quill
import "../../css/CSS_community-page/community_page_write.css";

// 커스텀 폰트 사이즈 등록

// Import Quill styles (you might need to adjust the path based on your project setup)
import "quill/dist/quill.snow.css"; // For Snow theme

function Community_page_write() {
  const SizeStyle = Quill.import("attributors/style/size");
  const fontSize = ["small", "normal", "large"]; // 사이즈 조절
  SizeStyle.whitelist = fontSize;
  Quill.register(SizeStyle, true);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "내용을 입력하세요",
        modules: {
          toolbar: [
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
            ["image", "code-block"],
            ["file"],
            ["video"],
            ["formula"],
            ["clean"],
          ],
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
  }, []); // Empty dependency array ensures this runs only once on mount

  // Optional: If you want to see the HTML content
  const handleSaveContent = () => {
    console.log("Editor Content:", editorContent);
    // You could send this content to a server, save to localStorage, etc.
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
