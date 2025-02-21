
function Login() {
    const idInput = document.querySelector('#userid');
    const passwordInput = document.querySelector('#pwd');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (userInfo == undefined || userInfo == null) {
        return;
    }
    console.log(userInfo);
    const userEmail = userInfo.email;
    const userPassword = userInfo.password;
    if (idInput.value === userEmail && passwordInput.value === userPassword) {
        alert('로그인 성공');
        window.location.href = "https://bbbbbean.github.io/";
    } else{
        alert('아이디 혹은 비밀번호가 틀렸습니다.');
    }

}