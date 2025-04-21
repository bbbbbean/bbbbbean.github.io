

if (typeof prevMatchScroll == 'undefined') {
    const prevMatchScroll = document.querySelector('.prev-match');
    const bookMarkScroll = document.querySelector('.book-mark-container');

    prevMatchScroll.addEventListener("wheel", (e) => {
        e.preventDefault();
        prevMatchScroll.scrollTop += e.deltaY / 5;
    });
    bookMarkScroll.addEventListener("wheel", (e) => {
        e.preventDefault();
        bookMarkScroll.scrollTop += e.deltaY / 5;
    });
}
