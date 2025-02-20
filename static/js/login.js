
function Login() {
    const idInput = document.querySelector('#userid');
    const passwordInput = document.querySelector('#pwd');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    console.log(userInfo);
    const userEmail = userInfo.email;
    const userPassword = userInfo.password;

    if (idInput.value === userEmail && passwordInput.value === userPassword) {
        alert('로그인 성공');
        window.location.href = "https://bbbbbean.github.io/";
    }

}