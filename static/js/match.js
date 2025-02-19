const matchInfoContianer = document.querySelector('.match-info-contianer');
document.querySelector('.match-info-close').addEventListener('click', function () {
    matchInfoContianer.style.display = "none";
});
document.querySelectorAll('.match-content-btn').forEach((item) => {
    item.addEventListener('click', () => {
        matchInfoContianer.style.display = "grid";
    });
});
window.addEventListener('scroll',()=>{
    matchInfoContianer.style.top = scrollY+50+'px';
});
