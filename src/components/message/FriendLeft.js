import searchIcon from "../../image/image_message/search-icon.svg";
import { useEffect, useState, useContext, useRef, use } from "react";
import moreIcon from "../../image/image_message/more-icon.svg";
import api from "../../axios";
import { WebSocketContext } from "../../WebSocket";
import addpersonIcon from "../../image/image_message/addperson-icon.svg";

const FriendLeft = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const [bestFriends, setBestFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState([]);
  const [friendfindValue, setFriendfindValue] = useState("");
  const [openMenuKey, setOpenMenuKey] = useState(null);
  const handleMenuToggle = (key) => {
    setOpenMenuKey((prev) => (prev === key ? null : key));
  };

  const { client, friendUpdate, setUserInfomation } =
    useContext(WebSocketContext);

  useEffect(() => {
    api.post("/api/friend/list").then((response) => {
      const data = response.data ?? {};
      console.log(response.data.commonFriend);
      setFriends(response.data.commonFriend ?? []);
      setBestFriends(response.data.bestFriend ?? []);
      setFriendRequest(response.data.friendRequest ?? []);
    });
  }, [friendUpdate]);
  //유저찾기
  const friendfind = () => {
    console.log(friendfindValue);

    if (friendfindValue.trim() === "") {
      // 입력이 없으면 아무 동작 안 함 + 검색 결과 숨김
      setFriendSearch([]);
      return;
    }
    api
      .post("/api/friend/findFriend", { nickName: friendfindValue })
      .then((response) => {
        console.log(response.data.friendFind);
        setFriendSearch(response.data.friendFind);
      });
  };
  useEffect(() => {
    if (friendfindValue.trim() === "") {
      setFriendSearch([]);
    }
  }, [friendfindValue]);
  //요청보내기
  const sendFriendRequest = (friendId) => {
    api
      .post("/api/friend/addFriend", {
        friendId: friendId,
        status: 3,
      })
      .then((response) => {
        console.log("친구 요청 보냄:", response.data);
        // 검색 목록에서 제거
        setFriendSearch((prev) =>
          prev.filter((friend) => friend.userId !== friendId)
        );

        // 친구쪽 프론트 갱신 및 알람
        client.publish({
          destination: "/pub/friend",
          body: JSON.stringify({ friendId: friendId, status: "add" }),
        });
      })
      .catch((error) => {
        console.error("친구 요청 실패:", error);
      });
  };
  //친구 신청 수락
  const acceptFriend = (friendId) => {
    api
      .post("/api/friend/accept", {
        friendId: friendId,
      })
      .then((response) => {
        console.log("친구 요청 수락 완료:", response.data);
        // 친구 요청 목록에서 제거
        setFriendRequest((prev) =>
          prev.filter((friend) => friend.userId !== friendId)
        );

        // 친구 목록 갱신
        api.post("/api/friend/list").then((response) => {
          setFriends(response.data.commonFriend);
          setBestFriends(response.data.bestFriend);
          setFriendRequest(response.data.friendRequest);
        });

        // 친구쪽 프론트 갱신
        client.publish({
          destination: "/pub/friend",
          body: JSON.stringify({ friendId: friendId, status: "acc" }),
        });

        // 메뉴 닫기
        setOpenMenuKey(null);
      })
      .catch((error) => {
        console.error("친구 요청 수락 실패:", error);
      });
  };

  //요청 거절
  const rejectFriend = (friendId) => {
    console.log("rejectFriend 보내는 값:", friendId);
    api
      .post("/api/friend/reject", {
        friendId: friendId,
      })
      .then((response) => {
        console.log("친구 요청 거절:", response.data);
        setFriendRequest((prev) =>
          prev.filter((friend) => friend.userId !== friendId)
        );
      })
      .catch((error) => {
        console.error("친구 요청 거절 실패:", error);
      });
  };
  //즐겨찾기, 삭제 상태 변경
  const friendStatus = (userId, newStatus) => {
    console.log("변경할 친구 ID:", userId);
    console.log("새로운 상태 값:", newStatus);

    api
      .post("/api/friend/friendStatus", {
        friendId: userId,
        status: newStatus,
      })
      .then((response) => {
        console.log("상태 변경 완료:", response.data);

        // 상태에 따라 friends / bestFriends 목록 갱신
        if (newStatus === 1) {
          // 즐겨찾기 설정: friends → bestFriends
          console.log(movedFriend);
          const movedFriend = friends.find((f) => f.friendId === userId);
          if (movedFriend) {
            setFriends((prev) => prev.filter((f) => f.friendId !== userId));
            setBestFriends((prev) => [...prev, movedFriend]);
          }
        } else if (newStatus === 0) {
          console.log(movedFriend);
          // 즐겨찾기 해제: bestFriends → friends
          const movedFriend = bestFriends.find((f) => f.friendId === userId);
          if (movedFriend) {
            setBestFriends((prev) => prev.filter((f) => f.friendId !== userId));
            setFriends((prev) => [...prev, movedFriend]);
          }
        }

        api.post("/api/friend/list").then((response) => {
          setFriends(response.data.commonFriend);
          setBestFriends(response.data.bestFriend);
          setFriendRequest(response.data.friendRequest);
        });

        // 메뉴 닫기 (UX 개선용)
        setOpenMenuKey(null);

        if (newStatus === 4) {
          client.publish({
            destination: "/pub/friend",
            body: JSON.stringify({ friendId: userId }),
          });
        }
      })
      .catch((error) => {
        console.error("상태 변경 실패:", error);
      });
  };

  const friendMenuRef = useRef(null);
  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (friendMenuRef.current && !friendMenuRef.current.contains(e.target)) {
        setOpenMenuKey(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFriendSearch([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="left">
      <div className="all">
        <div className="friend">
          <h1>친구</h1>
        </div>
        <div className="find">
          <div className="findinput">
            <input
              type="text"
              placeholder="친구 검색하기"
              value={friendfindValue}
              onChange={(e) => {
                setFriendfindValue(e.target.value);
              }}
            />
            <button onClick={friendfind}>
              <img src={searchIcon} alt="친구찾기" />
            </button>
          </div>
          <div
            ref={searchRef}
            style={{ display: friendSearch.length !== 0 ? "block" : "none" }}
            className="searchResult"
          >
            {friendSearch.map((friend, idx) => (
              <div className="person">
                <img
                  onClick={() => {
                    setUserInfomation(friend.userId);
                  }}
                  src={friend.profile}
                  className="profile"
                ></img>
                <div className="word1">
                  <p className="name">{friend.nickName}</p>
                  <p className="oneline">{friend.introduction}</p>
                </div>
                <button
                  className="requestbuttons-accept"
                  onClick={() => sendFriendRequest(friend.userId)}
                >
                  신청
                </button>
              </div>
            ))}
          </div>
        </div>
        {friendRequest.length > 0 && (
          <div className="friendalart">
            <div className="friendalart-title">
              <h1>친구 요청</h1>
            </div>
            {friendRequest.map((friend, idx) => (
              <div className="person">
                <img
                  onClick={() => {
                    setUserInfomation(friend.userId);
                  }}
                  src={friend.profile}
                  className="profile"
                ></img>
                <div className="word1">
                  <div className="name">{friend.nickName}</div>
                  <div className="oneline">{friend.introduction}</div>
                </div>
                <div className="requestbuttons">
                  <button
                    className="accept"
                    onClick={() => acceptFriend(friend.userId)}
                  >
                    수락
                  </button>
                  <button
                    className="reject"
                    onClick={() => rejectFriend(friend.userId)}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {bestFriends.length > 0 && (
          <>
            <div className="friendalart-title">
              <h1>즐겨찾는 친구</h1>
            </div>
            {bestFriends.map((friend, idx) => (
              <div className="person" key={`best-${idx}`}>
                <img src={friend.profile} className="profile"></img>
                <div className="word1">
                  <div className="name">{friend.nickName}</div>
                  <div className="oneline">{friend.introduction}</div>
                </div>
                <button onClick={() => handleMenuToggle(`best-${idx}`)}>
                  <img src={moreIcon} alt="친구메뉴" />
                </button>
                <div
                  ref={friendMenuRef}
                  className={`friendmenu ${
                    openMenuKey === `best-${idx}` ? "show" : ""
                  }`}
                >
                  <ul>
                    <li onClick={() => friendStatus(friend.userId, 0)}>
                      즐겨찾기 해제
                    </li>
                    <li onClick={() => friendStatus(friend.userId, 4)}>
                      친구 삭제
                    </li>
                    <li onClick={() => alert("아직 준비중인 기능이에요")}>
                      신고하기
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </>
        )}
        {friends.length > 0 && (
          <>
            <hr />
            {friends.map((friend, idx) => (
              <div className="person">
                <img
                  onClick={() => {
                    setUserInfomation(friend.userId);
                  }}
                  src={friend.profile}
                  className="profile"
                ></img>
                <div className="word1">
                  <div className="name">{friend.nickName}</div>
                  <div className="oneline">{friend.introduction}</div>
                </div>
                <button onClick={() => handleMenuToggle(`common-${idx}`)}>
                  <img src={moreIcon} alt="친구메뉴" />
                </button>
                <div
                  ref={friendMenuRef}
                  className={`friendmenu ${
                    openMenuKey === `common-${idx}` ? "show" : ""
                  }`}
                >
                  <ul>
                    <li onClick={() => friendStatus(friend.userId, 1)}>
                      즐겨찾기 설정
                    </li>
                    <li onClick={() => friendStatus(friend.userId, 4)}>
                      친구 삭제
                    </li>
                    <li onClick={() => alert("아직 준비중인 기능이에요")}>
                      신고하기
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </>
        )}
        {/* 친구가 아예 없는 상태일 때 */}
        {friends.length === 0 &&
          bestFriends.length === 0 &&
          friendRequest.length === 0 && (
            <div className="no-friend">
              <img src={addpersonIcon} alt="친구없음"></img>
              <div className="no-friends-message">
                <p>친구가 없습니다</p>
                <p>친구를 추가해보세요!</p>
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default FriendLeft;
