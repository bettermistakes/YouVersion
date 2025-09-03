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

// --------------------- navbar scroll background --------------------- //

$(document).ready(function () {
  var scrollTop = 0;
  $(window).scroll(function () {
    scrollTop = $(window).scrollTop();
    if (scrollTop >= 50) {
      $(".navbar").addClass("is--scrolled");
    } else if (scrollTop < 50) {
      $(".navbar").removeClass("is--scrolled");
    }
  });
});

// --------------------- navbar scroll down --------------------- //

let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    // Scrolling down and past 200px
    navbar.classList.add("hidden");
  } else {
    // Scrolling up
    navbar.classList.remove("hidden");
  }

  lastScrollY = currentScrollY;
});

// ---------------- navbar dropdown ---------------- //

document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".navbar--dropdown-trigger");
  let currentOpen = null;

  const openDropdown = (dropdown) => {
    const list = dropdown.querySelector(".navbar--dropdown-list");
    const columnParents = dropdown.querySelectorAll(
      ".navbar--dropdown-list-column-parent"
    );
    const imgWrapper = dropdown.querySelector(".navbar--dropdown-img-wrapper");
    const trigger = dropdown.querySelector(".navbar--dropdown-trigger");

    // Set height to auto then animate from 0
    gsap.set(list, { height: "auto" });
    const fullHeight = list.offsetHeight;

    gsap.fromTo(
      list,
      { height: 0 },
      {
        height: fullHeight,
        duration: 0.5,
        ease: "power4.out",
        onComplete: () => {
          gsap.set(list, { height: "auto" });
        },
      }
    );

    gsap.fromTo(
      [...columnParents, imgWrapper],
      { opacity: 0, y: "1rem" },
      {
        opacity: 1,
        y: "0rem",
        duration: 0.5,
        delay: 0.15,
        stagger: 0.05,
        ease: "power4.out",
      }
    );

    trigger.classList.add("is--active");
    currentOpen = dropdown;
  };

  const closeDropdown = (dropdown) => {
    if (!dropdown) return;

    const list = dropdown.querySelector(".navbar--dropdown-list");
    const columnParents = dropdown.querySelectorAll(
      ".navbar--dropdown-list-column-parent"
    );
    const imgWrapper = dropdown.querySelector(".navbar--dropdown-img-wrapper");
    const trigger = dropdown.querySelector(".navbar--dropdown-trigger");

    gsap.to([...columnParents, imgWrapper], {
      opacity: 0,
      y: "1rem",
      duration: 0.35,
      ease: "power4.out",
    });

    gsap.to(list, {
      height: 0,
      duration: 0.4,
      ease: "power4.out",
    });

    trigger.classList.remove("is--active");
    currentOpen = null;
  };

  triggers.forEach((trigger) => {
    const parent = trigger.closest(".navbar--dropdown");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      if (currentOpen && currentOpen !== parent) {
        closeDropdown(currentOpen);
        openDropdown(parent);
      } else if (currentOpen === parent) {
        closeDropdown(parent);
      } else {
        openDropdown(parent);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (currentOpen && !currentOpen.contains(e.target)) {
      closeDropdown(currentOpen);
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
