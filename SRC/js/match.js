const matchInfoContianer = document.querySelector('.match-info-contianer');
document.querySelector('.match-info-close').addEventListener('click',function(){
    matchInfoContianer.style.display = "none";
});
document.querySelector('.match-content-btn').addEventListener('click',()=>{
    matchInfoContianer.style.display = "grid";
})
function matchInfoOpen(){
    
}