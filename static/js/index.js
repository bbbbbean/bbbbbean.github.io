$(document).ready(function () {
    const URLSearchParam = new URLSearchParams(window.location.search);
    const param = URLSearchParam.toString();

    console.log(param);
    let page = param.split('=');
    const html = (page[1] == undefined) ? "../pages/main/main.html" : "../pages/"+page[1] + ".html";
    $('header').load("../pages/common/header.html");
    $('main').load(html);
    $('footer').load("../pages/common/footer.html");
});