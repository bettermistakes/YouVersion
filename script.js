// ---------------- navbar dropdown ---------------- //

document.addEventListener("DOMContentLoaded", () => {
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

  // Get all dropdown containers instead of just triggers
  const dropdowns = document.querySelectorAll(".navbar--dropdown");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".navbar--dropdown-trigger");
    let hoverTimeout;

    if (trigger) {
      // Open dropdown on hover over trigger
      trigger.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimeout);
        if (currentOpen && currentOpen !== dropdown) {
          closeDropdown(currentOpen);
        }
        openDropdown(dropdown);
      });
    } else {
      // If no specific trigger, make the entire dropdown hoverable
      dropdown.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimeout);
        if (currentOpen && currentOpen !== dropdown) {
          closeDropdown(currentOpen);
        }
        openDropdown(dropdown);
      });
    }

    // Close dropdown when leaving the entire dropdown container
    dropdown.addEventListener("mouseleave", () => {
      hoverTimeout = setTimeout(() => {
        closeDropdown(dropdown);
      }, 150); // Small delay to prevent accidental closes
    });

    // Cancel close if mouse re-enters before timeout
    dropdown.addEventListener("mouseenter", () => {
      clearTimeout(hoverTimeout);
    });
  });

  // Optional: Keep click-outside-to-close functionality
  // document.addEventListener("click", (e) => {
  //   if (currentOpen && !currentOpen.contains(e.target)) {
  //     closeDropdown(currentOpen);
  //   }
  // });
});

// --------------------- mobile menu --------------------- //

document.addEventListener("DOMContentLoaded", () => {
  const mm = window.matchMedia("(max-width: 991px)");

  if (!mm.matches) return; // Skip if screen is larger than 991px

  // Try multiple possible selectors for mobile menu trigger
  const trigger =
    document.querySelector(".nav--menu-trigger") ||
    document.querySelector(".mobile-menu-trigger") ||
    document.querySelector(".menu-trigger") ||
    document.querySelector("[data-mobile-menu-trigger]");

  const triggerOpen =
    trigger?.querySelector(".trigger--open") ||
    trigger?.querySelector(".menu-open") ||
    trigger?.querySelector(".hamburger-open");

  const triggerClose =
    trigger?.querySelector(".trigger--close") ||
    trigger?.querySelector(".menu-close") ||
    trigger?.querySelector(".hamburger-close");

  const menu =
    document.querySelector(".navbar--menu") ||
    document.querySelector(".mobile-menu") ||
    document.querySelector(".nav-menu");

  const dropdowns =
    menu?.querySelectorAll("[navbar=stagger]") ||
    menu?.querySelectorAll(".navbar--dropdown") ||
    menu?.querySelectorAll(".dropdown");

  console.log("Mobile menu elements found:", {
    trigger: !!trigger,
    triggerOpen: !!triggerOpen,
    triggerClose: !!triggerClose,
    menu: !!menu,
    dropdowns: dropdowns?.length || 0,
    screenWidth: window.innerWidth,
    isMobile: mm.matches,
  });

  if (!trigger || !menu) {
    console.warn("Mobile menu elements not found. Available elements:", {
      triggers: document.querySelectorAll(
        "[class*='trigger'], [class*='menu']"
      ),
      menus: document.querySelectorAll("[class*='menu'], [class*='nav']"),
    });
    return;
  }

  let isOpen = false;

  // Setup GSAP timeline
  const tl = gsap.timeline({ paused: true, reversed: true });

  tl
    // Show menu container
    .set(menu, { display: "flex" })

    // Slide menu in
    .fromTo(
      menu,
      { x: "100vw" },
      { x: "0vw", duration: 0.6, ease: "power4.out" },
      0
    );

  // Only animate trigger icons if they exist
  if (triggerOpen && triggerClose) {
    tl.fromTo(
      triggerOpen,
      { opacity: 1, y: 0 },
      { opacity: 0, y: "-1rem", duration: 0.3, ease: "power4.out" },
      0
    ).fromTo(
      triggerClose,
      { opacity: 0, y: "1rem" },
      { opacity: 1, y: "0rem", duration: 0.3, ease: "power4.out" },
      0
    );
  }

  // Only animate dropdowns if they exist
  if (dropdowns && dropdowns.length > 0) {
    tl.fromTo(
      dropdowns,
      { opacity: 0, y: "1rem" },
      {
        opacity: 1,
        y: "0rem",
        duration: 0.6,
        ease: "power4.out",
        stagger: 0.05,
      },
      0.2
    );
  }

  // Toggle open/close
  trigger.addEventListener("click", () => {
    console.log("Mobile menu trigger clicked! Current state:", isOpen);
    isOpen = !isOpen;

    if (isOpen) {
      console.log("Opening mobile menu");
      tl.play();
    } else {
      console.log("Closing mobile menu");
      tl.reverse().then(() => {
        gsap.set(menu, { display: "none" });
      });
    }
  });

  // Optional: click outside to close
  document.addEventListener("click", (e) => {
    if (isOpen && !trigger.contains(e.target) && !menu.contains(e.target)) {
      tl.reverse().then(() => {
        isOpen = false;
        gsap.set(menu, { display: "none" });
      });
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

// --------------------- hover text buttons --------------------- //

function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll("[data-button-animate-chars]");

  buttons.forEach((button) => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ""; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === " ") {
        span.style.whiteSpace = "pre"; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}

// Initialize Button Character Stagger Animation
document.addEventListener("DOMContentLoaded", () => {
  initButtonCharacterStagger();
});

// ------------------ Hover bg buttons ------------------ //

document.querySelectorAll("[animation=hover-bg]").forEach((element2) => {
  const hoverBg2 = element2.querySelector(".hover--bg");

  element2.addEventListener("mouseenter", (event2) => {
    const { top: top2, bottom: bottom2 } = element2.getBoundingClientRect();
    const mousePosition2 = event2.clientY;

    if (mousePosition2 < (top2 + bottom2) / 2) {
      // Mouse enters from the top
      hoverBg2.style.top = "0";
      hoverBg2.style.height = "0";
      requestAnimationFrame(() => {
        hoverBg2.style.transition = "height 0.3s ease, top 0.3s ease";
        hoverBg2.style.height = "100%";
      });
    } else {
      // Mouse enters from the bottom
      hoverBg2.style.top = "auto";
      hoverBg2.style.bottom = "0";
      hoverBg2.style.height = "0";
      requestAnimationFrame(() => {
        hoverBg2.style.transition = "height 0.3s ease, bottom 0.3s ease";
        hoverBg2.style.height = "100%";
      });
    }
  });

  element2.addEventListener("mouseleave", (event2) => {
    const { top: top2, bottom: bottom2 } = element2.getBoundingClientRect();
    const mousePosition2 = event2.clientY;

    if (mousePosition2 < (top2 + bottom2) / 2) {
      // Mouse leaves from the top
      hoverBg2.style.top = "0";
      hoverBg2.style.transition = "height 0.3s ease, top 0.3s ease";
      hoverBg2.style.height = "0";
    } else {
      // Mouse leaves from the bottom
      hoverBg2.style.top = "auto";
      hoverBg2.style.bottom = "0";
      hoverBg2.style.transition = "height 0.3s ease, bottom 0.3s ease";
      hoverBg2.style.height = "0";
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

// ---------------- Checkbox toggle functionality ---------------- //

document
  .querySelectorAll('.checkbox-field-2 input[type="radio"]')
  .forEach((radio) => {
    radio.addEventListener("change", function () {
      // Remove is--checked from all siblings with the same name
      document
        .querySelectorAll(`input[name="${this.name}"]`)
        .forEach((input) => {
          input.closest(".checkbox-field-2")?.classList.remove("is--checked");
        });

      // Add is--checked to the selected one
      if (this.checked) {
        this.closest(".checkbox-field-2")?.classList.add("is--checked");
      }
    });
  });
