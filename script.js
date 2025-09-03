// ---------------- code ------------------- //

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".is--testimonials-slider").forEach((sliderEl) => {
    const paginationEl = sliderEl.querySelector(".swiper-pagination");
    const prevEl = sliderEl.querySelector(".swiper-button-prev");
    const nextEl = sliderEl.querySelector(".swiper-button-next");

    new Swiper(sliderEl, {
      loop: true,
      slidesPerView: 1,
      pagination: {
        el: paginationEl,
        clickable: true,
      },
      navigation: {
        nextEl: nextEl,
        prevEl: prevEl,
      },
    });
  });
});
