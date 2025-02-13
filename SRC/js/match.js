const matchInfoContianer = document.querySelector('.match-info-contianer');
document.querySelector('.match-info-close').addEventListener('click',function(){
    matchInfoContianer.style.display = "none";
});
function matchInfoOpen(){
    matchInfoContianer.style.display = "grid";
}