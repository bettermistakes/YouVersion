// ------------------ Hover bg buttons ------------------ //

document.querySelectorAll("[animation=hover-bg]").forEach((element) => {
  const hoverBg = element.querySelector(".hover--bg");

  element.addEventListener("mouseenter", (event) => {
    const { top, bottom } = element.getBoundingClientRect();
    const mousePosition = event.clientY;

    if (mousePosition < (top + bottom) / 2) {
      // Mouse enters from the top
      hoverBg.style.top = "0";
      hoverBg.style.height = "0";
      requestAnimationFrame(() => {
        hoverBg.style.transition = "height 0.3s ease, top 0.3s ease";
        hoverBg.style.height = "100%";
      });
    } else {
      // Mouse enters from the bottom
      hoverBg.style.top = "auto";
      hoverBg.style.bottom = "0";
      hoverBg.style.height = "0";
      requestAnimationFrame(() => {
        hoverBg.style.transition = "height 0.3s ease, bottom 0.3s ease";
        hoverBg.style.height = "100%";
      });
    }
  });

  element.addEventListener("mouseleave", (event) => {
    const { top, bottom } = element.getBoundingClientRect();
    const mousePosition = event.clientY;

    if (mousePosition < (top + bottom) / 2) {
      // Mouse leaves from the top
      hoverBg.style.top = "0";
      hoverBg.style.transition = "height 0.3s ease, top 0.3s ease";
      hoverBg.style.height = "0";
    } else {
      // Mouse leaves from the bottom
      hoverBg.style.top = "auto";
      hoverBg.style.bottom = "0";
      hoverBg.style.transition = "height 0.3s ease, bottom 0.3s ease";
      hoverBg.style.height = "0";
    }
  });
});

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
