import { useEffect, useState } from "react";
import "../../css/CSS_community-page/comment.css";
import api from "../../axios";

const Comment = ({ postId }) => {
  // 답글 열기 버튼 생성 기준
  const CHILD_OPEN_BUTTON_COUNT = 3;

  const [showChildComment, setShowChildComment] = useState({});

  const [showChildInput, setShowChildInput] = useState({});

  const [startEditComment, setStartEditComment] = useState({});

  const [originalCommentValue, setOriginalCommentValue] = useState("");

  const [originalCommentId, setOriginalCommentId] = useState();

  const [originalSpan, setOriginalSpan] = useState();

  const [comments, setComments] = useState([]);

  const [who, setWho] = useState("");

  const [total, setTotal] = useState(0);

  const [commentRe, setCommentRe] = useState(true);

  useEffect(() => {
    api
      .post("/get/comment", { postId: postId })
      .then((response) => {
        console.log(response.data.commentDTOs);
        setTotal(response.data.total);
        setComments(response.data.commentDTOs);
      })
      .catch((error) => {});
  }, [commentRe, postId]);

  const handlerSubmit = () => {
    const commentEl = document.querySelector(".comment-input-div");
    const comment = commentEl.innerHTML;
    const check = document.querySelector(".comment-input-div").innerText.trim();
    if (check) {
      api
        .post("/add/comment", { postId, content: comment })
        .then((response) => {
          setCommentRe((prev) => !prev);
          setShowChildInput({});
          commentEl.innerHTML = "";
        })
        .catch((error) => {});
    }
  };

  const handlerChildSubmit = (parentId, childId) => {
    const comment = document.querySelector(`.child${childId}`).innerHTML;
    const check = document.querySelector(`.child${childId}`).innerText.trim();
    if (check) {
      api
        .post("/add/comment", {
          postId: 1,
          commentTo: who,
          content: comment,
          parentId,
        })
        .then((response) => {
          setCommentRe((prev) => !prev);
          setShowChildInput({});
        })
        .catch((error) => {});
    }
  };

  const openChildInput = (id, nickName) => {
    setWho(nickName);
    setShowChildInput((prev) => {
      const newState = {};
      if (!prev[id]) {
        newState[id] = true;
      } else {
        setWho("");
      }
      return newState;
    });
  };

  const openChildComment = (id) => {
    setShowChildComment((prev) => {
      const newState = {};
      if (!prev[id]) {
        newState[id] = true;
      }
      return newState;
    });
  };

  const commentEdit = (id) => {
    const commentEl = document.querySelector(`.edit${id}`);
    const editCommentValue = commentEl.innerHTML;

    setStartEditComment((prev) => {
      // 이미 다른 댓글이 열려있으면 아무것도 하지 않음
      if (Object.values(prev).some((v) => v)) return prev;
      const newState = { ...prev };
      if (!prev[id]) {
        newState[id] = true;
      }
      return newState;
    });

    if (Object.keys(startEditComment).length) {
      // 다른 댓글을 동시에 수정 못하게 방지
      if (originalCommentId !== id) return;

      // 값이 변경되었을 경우 전송

      console.log(editCommentValue);
      console.log(originalCommentValue);

      if (editCommentValue !== originalCommentValue) {
        //값이 비었을 경우
        if (!commentEl.innerText.trim()) {
          // 기존값 복구
          if (originalSpan) {
            commentEl.insertBefore(originalSpan, commentEl.firstChild);
          }
          commentEl.innerHTML += originalCommentValue;
          // 상태 초기화
          setStartEditComment({});
          setOriginalCommentId(null);
          setOriginalCommentValue("");
          setOriginalSpan(null);
          return;
        }
        api
          .post("/edit/comment", { content: editCommentValue, commentId: id })
          .then((response) => {
            // 전송 성공 시 span 복원
            if (originalSpan) {
              commentEl.insertBefore(
                document.createElement("br"),
                commentEl.firstChild
              );
              commentEl.insertBefore(originalSpan, commentEl.firstChild);
            }

            // 상태 초기화
            setStartEditComment({});
            setOriginalCommentId(null);
            setOriginalCommentValue("");
            setOriginalSpan(null);
          })
          .catch((error) => {
            console.error("수정 실패", error);
          });
      } else {
        // 값이 안 바뀐 경우 => 수정 취소
        if (originalSpan) {
          commentEl.insertBefore(
            document.createElement("br"),
            commentEl.firstChild
          );
          commentEl.insertBefore(originalSpan, commentEl.firstChild);
        }

        // 상태 초기화
        setStartEditComment({});
        setOriginalCommentId(null);
        setOriginalCommentValue("");
        setOriginalSpan(null);
      }
    } else {
      // 수정 시작 시 span 제거
      const span = commentEl.querySelector("span");
      const br = commentEl.querySelector("br");

      if (span) {
        setOriginalSpan(span.cloneNode(true)); // 복제본 저장
        span.remove();
      }
      if (br) br.remove();

      setOriginalCommentValue(commentEl.innerHTML);
      setOriginalCommentId(id);
      commentEl.focus();
    }
  };

  const delComment = (id) => {
    console.log("삭제");
    api
      .post("/del/comment", { commentId: id })
      .then((response) => {
        setCommentRe((prev) => !prev);
      })
      .catch((error) => {
        console.error("삭제 실패", error);
      });
  };

  return (
    <div className="comment-container">
      <h3 style={{ width: "100%" }}>댓글{total !== 0 && "(" + total + ")"}</h3>
      <div className="comment-form">
        <div
          contentEditable="true"
          suppressContentEditableWarning={true}
          className="comment-input-div"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
        ></div>
        <button onClick={handlerSubmit}>등록</button>
      </div>
      <div className="comment-content">
        {comments.map((parent) => (
          <div
            className={"del" + parent.commentId + " parent-comment"}
            key={parent.commentId}
          >
            <div className="comment-img">
              <img
                src={`http://localhost:8100/profile/${parent.userId}`}
                alt="profile"
              />
            </div>
            <div className="comment-body">
              <div className="comment-nickName">{parent.nickName}</div>
              <div
                contentEditable={startEditComment[parent.commentId]}
                className={"edit" + parent.commentId + " comment-content-value"}
                dangerouslySetInnerHTML={{ __html: parent.content }}
              />
              <div className="comment-createAt">{parent.time}</div>
              <div className="comment-button-div">
                {parent.userId === localStorage.getItem("userId") && (
                  <>
                    <button onClick={() => commentEdit(parent.commentId)}>
                      {startEditComment[parent.commentId]
                        ? "수정완료"
                        : "답글수정"}
                    </button>
                    <button onClick={() => delComment(parent.commentId)}>
                      답글삭제
                    </button>
                  </>
                )}
                {parent.childCount >= CHILD_OPEN_BUTTON_COUNT && (
                  <button onClick={() => openChildComment(parent.commentId)}>
                    {showChildComment[parent.commentId]
                      ? `닫기`
                      : `답글열기(${parent.childCount})`}
                  </button>
                )}
                <button
                  onClick={() =>
                    openChildInput(parent.commentId, parent.nickName)
                  }
                >
                  {showChildInput[parent.commentId] ? "작성취소" : "답글작성"}
                </button>
              </div>
              {showChildInput[parent.commentId] && (
                <div className="child-comment-form">
                  <div
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    className={
                      "child" + parent.commentId + " comment-input-div"
                    }
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                  ></div>
                  <button
                    onClick={() =>
                      handlerChildSubmit(parent.commentId, parent.commentId)
                    }
                  >
                    등록
                  </button>
                </div>
              )}
              {(showChildComment[parent.commentId] ||
                parent.childCount < CHILD_OPEN_BUTTON_COUNT) && (
                <div className="child-comment">
                  {parent.commentDTOs &&
                    parent.commentDTOs.map((child) => (
                      <div
                        className={
                          "del" + child.commentId + " child-comment-item"
                        }
                        key={child.commentId}
                      >
                        <div className="comment-img">
                          <img
                            src={`http://localhost:8100/profile/${child.userId}`}
                            alt="profile"
                          />
                        </div>
                        <div className="comment-body">
                          <div className="comment-nickName">
                            {child.nickName}
                          </div>
                          <div
                            contentEditable={startEditComment[child.commentId]}
                            className={
                              "edit" +
                              child.commentId +
                              " comment-content-value"
                            }
                            dangerouslySetInnerHTML={{ __html: child.content }}
                          />
                          <div className="comment-createAt">{child.time}</div>
                          <div className="comment-button-div">
                            {child.userId ===
                              localStorage.getItem("userId") && (
                              <>
                                <button
                                  onClick={() => commentEdit(child.commentId)}
                                >
                                  {startEditComment[child.commentId]
                                    ? "수정완료"
                                    : "답글수정"}
                                </button>
                                <button
                                  onClick={() => delComment(child.commentId)}
                                >
                                  답글삭제
                                </button>
                              </>
                            )}
                            <button
                              onClick={() =>
                                openChildInput(child.commentId, child.nickName)
                              }
                            >
                              답글작성
                            </button>
                          </div>
                          {showChildInput[child.commentId] && (
                            <div className="child-comment-form">
                              <div
                                contentEditable="true"
                                suppressContentEditableWarning={true}
                                className={
                                  "child" +
                                  child.commentId +
                                  " comment-input-div"
                                }
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-all",
                                }}
                              ></div>
                              <button
                                onClick={() =>
                                  handlerChildSubmit(
                                    parent.commentId,
                                    child.commentId
                                  )
                                }
                              >
                                등록
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
