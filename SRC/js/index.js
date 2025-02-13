$(document).ready(function () {
    let param = $(URLSearchParams)[0].location.search;
    let page = param.replace('?', " ").split('=');
    const html = (page[1] == undefined) ? "./main.html" : "./"+page[1] + ".html";
    $('header').load("./header.html");
    $('main').load(html);
});