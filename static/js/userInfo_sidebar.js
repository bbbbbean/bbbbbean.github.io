const infoMenuBtn = document.querySelectorAll('.info-menu>.item>a');
infoMenuBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
        userInfoMenuBtn(item.parentElement.dataset.url);
        const active = document.querySelector('.info-menu>.active');
        active.classList.remove('active');
        item.parentElement.classList.add('active');
    });
});

function userInfoMenuBtn(url) {
    $('.info-right').load("./pages/user/" + url + ".html");
}

