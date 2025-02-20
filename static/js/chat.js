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
