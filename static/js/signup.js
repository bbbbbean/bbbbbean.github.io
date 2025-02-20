const emailAuthBtn = document.querySelector('#email-auth-btn');
const emailAuthInput = document.querySelector('#email-auth-input');
const emailInput = document.querySelector('#email-input');
const userNameInput = document.querySelector('#name');
const nickNameInput = document.querySelector('#nickname');
const userPassWordInput = document.querySelector('#pwd');
const submitBtn = document.querySelector('.submit');
let emailAuthValue = 694063409423;
emailAuthBtn.addEventListener('click', () => {
    emailAuthValue = Math.floor(Math.random() * 55535 + 10000);
    alert(`인증번호는 ${emailAuthValue} 입니다.`);
});
submitBtn.addEventListener('click', () => {
    if (emailAuthInput.value != emailAuthValue) {
        emailAuthInput.focus();
        alert("인증번호가 일치하지 않습니다.");
        return
    }
    const userInfo = {
        email: emailInput.value,
        name: userNameInput.value,
        nickname: nickNameInput.value,
        password: userPassWordInput.value
    }
    console.log(userInfo);
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    alert('회원가입 성공');
    window.history.back();
    console.log(sessionStorage.getItem('userInfo'));
});