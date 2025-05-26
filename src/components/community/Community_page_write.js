import React, { useRef, useEffect, useState } from "react";
import Quill from "quill"; // Make sure to install quill: npm install quill
import "../../css/CSS_community-page/community_page_write.css";

// 커스텀 폰트 사이즈 등록

// Import Quill styles (you might need to adjust the path based on your project setup)
import "quill/dist/quill.snow.css"; // For Snow theme

function Community_page_write() {
  const SizeStyle = Quill.import("attributors/style/size");
  const fontSize = ["8px", "10px", "14px", "18px", "32px"];
  SizeStyle.whitelist = fontSize;
  Quill.register(SizeStyle, true);
  const editorRef = useRef(null); // Ref for the editor div
  const quillInstance = useRef(null); // Ref to store the Quill instance

  // State to hold the content, if you want to control it from React
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    // Initialize Quill only once after the component mounts
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Compose an epic story...",
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
            ["clean"],
            ["image", "code-block"],
            ["file"],
            ["video"],
            ["formula"],
          ],
        },
      });

      // Optional: Set initial content
      quillInstance.current.root.innerHTML = editorContent;

      // Optional: Listen for text changes to update React state
      quillInstance.current.on("text-change", () => {
        setEditorContent(quillInstance.current.root.innerHTML);
      });
    }

    // Cleanup function: Destroy Quill instance when the component unmounts
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
      <h2>My Rich Text Editor</h2>
      {/* The div where Quill will be initialized */}
      <div
        ref={editorRef}
        style={{ height: "300px", border: "1px solid #ccc" }}
      ></div>
      <p>Current Content (HTML):</p>
      <div style={{ border: "1px solid #eee", padding: "10px" }}>
        {editorContent}
      </div>
      <button onClick={handleSaveContent}>Log Editor Content</button>
    </div>
  );
}

export default Community_page_write;
