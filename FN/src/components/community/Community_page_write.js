import React, { useRef, useEffect, useState, useCallback } from "react";
import Quill from "quill";
import "../../css/CSS_community-page/community_page_write.css";
import postImageApi from "../../postImageAxios";
import file_icons from "./images/file_icon.svg";

import "quill/dist/quill.snow.css"; // For Snow theme
import { ImageResize } from "quill-image-resize-module-ts";
import { Navigate, useNavigate, useParams } from "react-router-dom";

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
  const [uploadFiles, setUploadFiles] = useState([]);
  const navigate = useNavigate();
  const { postId, postCodeNumber } = useParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이미지 업로드 핸들러
  const handleFileUpload = useCallback(() => {
    const quill = quillInstance.current;
    let isMounted = true;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*"); // 이미지 파일만 선택하도록 제한
    input.click();

    input.onchange = async () => {
      if (!isMounted) return;

      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await postImageApi.post(`/upload/file`, formData);
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
        } catch (error) {
          console.error("이미지 업로드 중 오류 발생:", error);
          if (error.response) {
            console.error("오류 응답 데이터:", error.response.data);
            console.error("오류 응답 상태:", error.response.status);
          }
          alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        }
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

  // 게시글 데이터 불러와서 수정
  useEffect(() => {
    if (postId) {
      setIsEditMode(true);
      setLoading(true);
      setError(null);

      const fetchPost = async () => {
        try {
          const response = await postImageApi.get(`/post/${postId}`);
          const postData = response.data;

          setTitle(postData.title);
          setSelectedPostCodeId(postData.postCodeId);

          if (quillInstance.current) {
            quillInstance.current.root.innerHTML = postData.content;
            setEditorContent(postData.content);
          } else {
            setEditorContent(postData.content);
          }
        } catch (err) {
          console.error("게시글 불러오기 실패:", err);
          setError("게시글을 불러오는 데 실패했습니다.");
          setEditorContent(""); // 에러 발생 시 내용 비우기
          setTitle("");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else {
      // postId가 없으면 글쓰기 모드
      setIsEditMode(false);
      setTitle("");
      setSelectedPostCodeId(postCodeNumber ? parseInt(postCodeNumber, 10) : 5); // 기본 카테고리 '자유게시판'으로 초기화
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = ""; // 에디터 내용 비우기
      }
      setEditorContent("");
      setUploadFiles([]); // 파일 목록 초기화
      setLoading(false); // 글쓰기 모드는 즉시 로딩 완료
    }
  }, [postId, postCodeNumber]);

  // 저장 버튼 누르면 실행
  const handleSubmit = async () => {
    if (!title.trim() || !quillInstance.current.root.innerHTML.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const currentEditorContent = quillInstance.current.root.innerHTML;

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

    try {
      let response;
      if (isEditMode) {
        response = await postImageApi.put(`/post/update/${postId}`, formData); // API 경로 확인
        alert("게시글이 성공적으로 수정되었습니다.");
      } else {
        response = await postImageApi.post("/post/save", formData);
        alert("게시글이 성공적으로 작성되었습니다.");
      }
      console.log("게시글 처리 성공 : ", response.data);
      const newPostId = response.data.postId || postId; // 새 글은 response.data.postId, 수정은 기존 postId
      navigate(`/community/select/${newPostId}`);
    } catch (error) {
      console.error("게시글 저장/수정 중 오류 발생 : ", error);
      if (error.response) {
        console.error("게시글 오류 응답 데이터 : ", error.response.data);
        console.error("게시글 오류 응답 상태 : ", error.response.status);
        alert(
          `오류 발생! 게시글을 ${
            isEditMode ? "수정" : "저장"
          }하지 못했습니다. (응답 상태: ${error.response.status})`
        );
      } else {
        console.log("게시글 처리 중 알 수 없는 오류 발생...");
        alert(
          `오류 발생! 게시글 ${
            isEditMode ? "수정" : "저장"
          } 중 알 수 없는 오류 발생...`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 취소 버튼 핸들러 추가
  const handleCancel = () => {
    if (isEditMode && postId) {
      navigate(`/community/select/${postId}`); // 수정 모드면 상세 페이지로 돌아가기
    } else {
      navigate(`/community/list/${selectedPostCodeId}`); // 글쓰기 모드면 해당 카테고리 목록으로 돌아가기
    }
  };

  const handleAttachedFileChange = (e) => {
    // 기존 파일에 새로운 파일들을 추가합니다.
    setUploadFiles((prevFiles) => [
      ...prevFiles,
      ...Array.from(e.target.files),
    ]);
  };

  return (
    <div className="community-write-wrap">
      <div className="community-write-container">
        <h2>{isEditMode ? "게시글 수정" : "새 게시글 작성"}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="form-group">
            <label htmlFor="category">카테고리:</label>
            <select
              id="category"
              value={selectedPostCodeId}
              onChange={(e) => setSelectedPostCodeId(parseInt(e.target.value))}
              disabled={isEditMode}
            >
              <option value="1">운동</option>
              <option value="2">게임</option>
              <option value="3">취미</option>
              <option value="4">여행</option>
              <option value="5">자유게시판</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">제목:</label>
            <input
              type="text"
              id="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="attach-file">첨부 파일:</label>
            <input
              type="file"
              id="attach-file"
              multiple // 여러 파일 선택 가능하도록
              onChange={handleAttachedFileChange} // 파일 목록을 배열로 저장
              style={{ marginTop: "1px" }}
            />
            {/* ⭐ 현재 첨부된 파일 목록 표시 */}
            {uploadFiles.length > 0 && (
              <div style={{ marginTop: "5px" }}>
                <p>첨부된 파일:</p>
                <ul>
                  {uploadFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div
            ref={editorRef}
            style={{ height: "300px", border: "1px solid #ccc" }}
          ></div>

          <div className="button-area">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-button"
            >
              취소
            </button>
            <button type="submit" className="uploadpost" disabled={loading}>
              {isEditMode ? "수정 완료" : "작성 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Community_page_write;
