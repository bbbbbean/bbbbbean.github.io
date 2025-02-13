$(document).ready(function () {
    const URLSearchParam = new URLSearchParams(window.location.search);
    const param = URLSearchParam.toString();

    console.log(param);
    let page = param.split('=');
    const html = (page[1] == undefined) ? "./main.html" : "./"+page[1] + ".html";
    $('header').load("./header.html");
    $('main').load(html);
});