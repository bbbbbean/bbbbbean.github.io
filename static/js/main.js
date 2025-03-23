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

$(".que").click(function() {
   $(this).next(".anw").stop().slideToggle(300);
  $(this).toggleClass('on').siblings().removeClass('on');
  $(this).next(".anw").siblings(".anw").slideUp(300); // 1개씩 펼치기
});