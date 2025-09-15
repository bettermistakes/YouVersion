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

// --------------------- mobile menu --------------------- //

document.addEventListener("DOMContentLoaded", () => {
  const mm = window.matchMedia("(max-width: 991px)");

  if (!mm.matches) return; // Skip if screen is larger than 991px

  const trigger = document.querySelector(".nav--menu-trigger");
  const triggerOpen = trigger?.querySelector(".trigger--open");
  const triggerClose = trigger?.querySelector(".trigger--close");
  const menu = document.querySelector(".navbar--menu");
  const dropdowns = menu?.querySelectorAll("[navbar=stagger]");

  if (!trigger || !triggerOpen || !triggerClose || !menu || !dropdowns.length)
    return;

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
    )

    // Animate trigger icons
    .fromTo(
      triggerOpen,
      { opacity: 1, y: 0 },
      { opacity: 0, y: "-1rem", duration: 0.3, ease: "power4.out" },
      0
    )
    .fromTo(
      triggerClose,
      { opacity: 0, y: "1rem" },
      { opacity: 1, y: "0rem", duration: 0.3, ease: "power4.out" },
      0
    )

    // Dropdowns stagger in
    .fromTo(
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

  // Toggle open/close
  trigger.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      tl.play();
    } else {
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

// ---------------- Lightbox YouTube URL Handler ---------------- //

document.addEventListener("DOMContentLoaded", function () {
  // Function to extract YouTube video ID from URL
  function getYouTubeVideoId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Function to create YouTube embed URL
  function createYouTubeEmbedUrl(videoId) {
    return `https://www.youtube.com/embed/${videoId}?feature=oembed`;
  }

  // Function to update lightbox iframe with new YouTube URL
  function updateLightboxIframe(youtubeUrl) {
    const videoId = getYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      console.warn("Invalid YouTube URL:", youtubeUrl);
      return;
    }

    const embedUrl = createYouTubeEmbedUrl(videoId);

    // Wait for lightbox to be fully loaded
    const checkForLightbox = () => {
      const lightboxIframe = document.querySelector(".w-lightbox-embed");
      if (lightboxIframe) {
        lightboxIframe.src = embedUrl;
        console.log("Updated lightbox iframe with URL:", embedUrl);
      } else {
        // If lightbox not found yet, try again after a short delay
        setTimeout(checkForLightbox, 100);
      }
    };

    checkForLightbox();
  }

  // Add click event listeners to all lightbox slides
  document.querySelectorAll(".lightbox--slide").forEach((slide) => {
    slide.addEventListener("click", function (e) {
      // Find the YouTube link within this slide
      const youtubeLinkElement = this.querySelector(".youtube--link");

      if (youtubeLinkElement) {
        const youtubeUrl = youtubeLinkElement.textContent.trim();

        if (youtubeUrl) {
          // Store the YouTube URL for when the lightbox opens
          this.setAttribute("data-youtube-url", youtubeUrl);

          // Use a small delay to ensure the lightbox has time to initialize
          setTimeout(() => {
            updateLightboxIframe(youtubeUrl);
          }, 200);
        }
      }
    });
  });

  // Alternative approach: Listen for Webflow lightbox events
  // This is a more reliable method as it waits for the actual lightbox to open
  document.addEventListener("click", function (e) {
    const lightboxSlide = e.target.closest(".lightbox--slide");
    if (lightboxSlide) {
      const youtubeLinkElement = lightboxSlide.querySelector(".youtube--link");

      if (youtubeLinkElement) {
        const youtubeUrl = youtubeLinkElement.textContent.trim();

        if (youtubeUrl) {
          // Use MutationObserver to watch for lightbox appearance
          const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.type === "childList") {
                const lightboxIframe =
                  document.querySelector(".w-lightbox-embed");
                if (lightboxIframe) {
                  updateLightboxIframe(youtubeUrl);
                  observer.disconnect(); // Stop observing once we've updated
                }
              }
            });
          });

          // Start observing the document body for changes
          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });

          // Disconnect observer after 5 seconds to prevent memory leaks
          setTimeout(() => {
            observer.disconnect();
          }, 5000);
        }
      }
    }
  });
});
