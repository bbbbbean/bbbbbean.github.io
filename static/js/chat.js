const mkchat = document.querySelector('.chat-pop-mkchat');
document.querySelector('.chat-back-tab').addEventListener('click', function () {
    mkchat.style.display = "none";
});
document.querySelectorAll('.chat-mk-chat').forEach((item) => {
    item.addEventListener('click', () => {
        mkchat.style.display = "block";
        mkfriend.style.display = "none";
    });
});

const mkfriend = document.querySelector('.chat-pop-mkfriend');
document.querySelectorAll('.chat-back-tab').forEach((item) => {
    item.addEventListener('click', () => {
        mkfriend.style.display = "none";
    });
});
document.querySelectorAll('.chat-mk-friend').forEach((item) => {
    item.addEventListener('click', () => {
        mkfriend.style.display = "block";
        mkchat.style.display = "none";
    });
});

// 임시(친구추가 -> 채팅방 생성)
const chatInput = document.querySelector('#chatsearchbar');
const friendInput = document.querySelector('#friendsearchbar');
const friendSearchResult = document.querySelector('.friend-search-result');
const friendAddBtn = document.querySelector('.friend-add');
const chatSearchResult = document.querySelector('.chat-search-result');
const chatTab = document.querySelector('.chat-tab');
const chatCreate = document.querySelector('.chat-create')
let username = 'admin'
let friendAddChk = 0;
friendInput.addEventListener('keyup', (e) => {
    if (!username.indexOf(friendInput.value) && friendInput.value != '') {
        friendSearchResult.style.display = "block";
    } else {
        friendSearchResult.style.display = "none";
    };
})
friendAddBtn.addEventListener('click', () => {
    alert("친구추가 성공");
    friendSearchResult.style.display = "none";
    chatSearchResult.style.display = 'block';
    username = '@@@@@@'
    
});
chatCreate.addEventListener('click', () => {
    const newUl = document.createElement('ul');
    newUl.classList.add("chat-a");
    newUl.innerHTML = `<li class="chat-b">
                    <a href="javascript:void(0)">
                        <span class="material-symbols-outlined">account_circle</span>
                    </a>
                </li>
                <div class="userName">admin</div>
                <li class="chat-pending-btn">
                    <a href="javascript:void(0)">
                        <span class="material-symbols-outlined">Pending</span>
                        <!-- 숨겨진 메뉴 -->
                        <ul class="chat-menu">
                            <li>채팅방 상단 고정</li>
                            <li>채팅방 나가기</li>
                            <li>채팅방 신고하기</li>
                        </ul>
                    </a>
                </li>`;
    chatTab.append(newUl);
    chatSearchResult.style.display = 'none';
    mkchat.style.display = "none";
    alert("성공");
});