$(document).ready(function () {
    let param = $(URLSearchParams)[0].location.search;
    console.log(param);
    let page = param.replace('?', " ").split('=');
    console.log(page[1]);
    const html = (page[1] == undefined) ? "./main.html" : "./"+page[1] + ".html";
    console.log(html);
    $('header').load("./header.html");
    $('main').load(html);
});