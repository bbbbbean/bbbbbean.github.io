import { useEffect, useState } from "react";
import "../../css/CSS_community-page/comment.css";
import api from "../../axios"

const Comment = () => {
    const [comment, setComment] = useState("");
    const [childComment, setChildComment] = useState("");

    const [showChildInput, setShowChildInput] = useState({});

    useEffect(() => {
        api.post("/get/comment", { "postId": 1 })
            .then((respone) => {
                console.log(respone.data);
            }).catch((error) => {

            });
    }, [])

    const handlerSubmit = (e) => {
        e.preventDefault();
        console.log(comment);
        api.post("/add/comment", { "postId": 1, "content": comment }).then((response) => {

        }).catch((error) => {

        });
    };

    const handlerChildSubmit = (e, parentId) => {
        e.preventDefault();
        console.log("parentId:", parentId);
        console.log(childComment);
        api.post("/add/comment", { "postId": 1, "content": childComment, parentId }).then((response) => {

        }).catch((error) => {

        });
    };

    const openChildInput = (id) => {
        setShowChildInput(prev => {
            const newState = {};
            if (!prev[id]) {
                newState[id] = true;
            }
            return newState;
        });
        setChildComment("");
    };

    const comments = [
        {
            id: 1,
            userId: "user1",
            nickName: "user1",
            content: "안녕하세요",
            createdAt: "2015년",
            children: [
                {
                    id: 2,
                    userId: "user1",
                    nickName: "user1",
                    content: "네.",
                    createdAt: "2016년"
                }
            ]
        },
        {
            id: 3,
            userId: "user1",
            nickName: "user1",
            content: "안녕하세요",
            createdAt: "2015년",
            children: [
                {
                    id: 4,
                    userId: "user1",
                    nickName: "user1",
                    content: "네.",
                    createdAt: "2016년"
                }
            ]
        }
    ];

    return (
        <div className="comment-container">
            <div className="comment-form">
                <form onSubmit={handlerSubmit}>
                    <textarea
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <br />
                    <button type="submit">작성</button>
                </form>
            </div>

            <div className="comment-content">
                {comments.map(parent => (
                    <div className="parent-comment" key={parent.id}>
                        <div className="comment-img">
                            <img src={`http://localhost:8100/profile/${parent.userId}`} alt="profile" />
                        </div>
                        <div className="comment-body">
                            <div className="comment-nickName">{parent.nickName}</div>
                            <div className="comment-content-value">{parent.content}</div>
                            <div className="comment-createAt">{parent.createdAt}</div>
                            <div className="comment-button-div">
                                <button>답글수정</button>
                                <button>답글삭제</button>
                                <button onClick={() => openChildInput(parent.id)}>답글</button>
                            </div>
                            {showChildInput[parent.id] && (
                                <div className="child-comment-form">
                                    <form onSubmit={(e) => handlerChildSubmit(e, parent.id)}>
                                        <textarea
                                            name="comment"
                                            value={childComment}
                                            onChange={(e) => setChildComment(e.target.value)}
                                        />
                                        <button type="submit">작성</button>
                                    </form>
                                </div>
                            )}
                            <div className="child-comment">
                                {parent.children.map(child => (
                                    <div className="child-comment-item" key={child.id}>
                                        <div className="comment-img">
                                            <img src={`http://localhost:8100/profile/${child.userId}`} alt="profile" />
                                        </div>
                                        <div className="comment-body">
                                            <div className="comment-nickName">{child.nickName}</div>
                                            <div className="comment-content-value">{child.content}</div>
                                            <div className="comment-createAt">{child.createdAt}</div>
                                            <div className="comment-button-div">
                                                <button>답글수정</button>
                                                <button>답글삭제</button>
                                                <button onClick={() => openChildInput(child.id)}>답글</button>
                                            </div>
                                            {showChildInput[child.id] && (
                                                <div className="child-comment-form">
                                                    <form onSubmit={(e) => handlerChildSubmit(e, parent.id)}>
                                                        <textarea
                                                            name="comment"
                                                            value={childComment}
                                                            onChange={(e) => setChildComment(e.target.value)}
                                                        />
                                                        <button type="submit">작성</button>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comment;
