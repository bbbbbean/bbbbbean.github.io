const swiper_banner = new Swiper('.banner-section>.swiper', {
    // Optional parameters
    direction: 'horizontal',
    autoplay:{  // 자동 스와이프
        delay: 3000,
        pauseOnMouseEnter : true,
    },
    loop: true,

    effect : 'slide',

    // Navigation arrows
    navigation: {
        nextEl: '.banner-section .swiper-button-next',
        prevEl: '.banner-section .swiper-button-prev',
    },
});