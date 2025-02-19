$(document).ready(function () {
    const URLSearchParam = new URLSearchParams(window.location.search);
    console.log(URLSearchParam);
    const param = URLSearchParam.toString();

    console.log(param);
    let page = param.split('=');
    const html = (page[1] == undefined) ? "../Team2/pages/main/main.html" : "../Team2/pages/"+page[1] + ".html";
    $('header').load("../Team2/pages/common/header.html");
    $('main').load(html);
    $('footer').load("../Team2/pages/common/footer.html");
});