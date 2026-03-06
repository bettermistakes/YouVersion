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
    const navbar = dropdown.closest(".navbar");
    if (navbar) navbar.classList.add("is--dropdown-active");
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
    // Only clear state when closing the dropdown that is actually open
    if (dropdown === currentOpen) {
      const navbar = dropdown.closest(".navbar");
      if (navbar) navbar.classList.remove("is--dropdown-active");
      currentOpen = null;
    }
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

  const navbar =
    document.querySelector(".navbar") ||
    document.querySelector(".nav") ||
    document.querySelector("nav");

  const dropdowns =
    menu?.querySelectorAll("[navbar=stagger]") ||
    menu?.querySelectorAll(".navbar--dropdown") ||
    menu?.querySelectorAll(".dropdown");

  console.log("Mobile menu elements found:", {
    trigger: !!trigger,
    triggerOpen: !!triggerOpen,
    triggerClose: !!triggerClose,
    menu: !!menu,
    navbar: !!navbar,
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
  let tl = null;

  // Function to initialize mobile menu timeline
  function initMobileMenuTimeline() {
    // Clear previous timeline if it exists
    if (tl) {
      tl.kill();
    }

    // Setup GSAP timeline
    tl = gsap.timeline({ paused: true, reversed: true });

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

    // Add class to navbar for black text styling
    if (navbar) {
      tl.add(() => {
        navbar.classList.add("mobile-menu-open");
      }, 0);
    }

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
  }

  // Function to handle viewport changes
  function handleViewportChange() {
    if (mm.matches) {
      // Mobile view - ensure timeline is initialized
      if (!tl) {
        initMobileMenuTimeline();
      }
    } else {
      // Desktop view - reset mobile menu state
      if (isOpen) {
        isOpen = false;
        if (tl) {
          tl.kill();
          tl = null;
        }
      }
      // Reset menu styles for desktop
      gsap.set(menu, { x: "0vw", display: "", clearProps: "x" });
      if (triggerOpen) {
        gsap.set(triggerOpen, { opacity: 1, y: 0, clearProps: "opacity,y" });
      }
      if (triggerClose) {
        gsap.set(triggerClose, {
          opacity: 0,
          y: "1rem",
          clearProps: "opacity,y",
        });
      }
      // Clear all GSAP inline styles from dropdowns to let desktop CSS/animations take over
      if (dropdowns && dropdowns.length > 0) {
        gsap.set(dropdowns, { clearProps: "all" });
      }
      // Remove mobile menu class
      if (navbar) {
        navbar.classList.remove("mobile-menu-open");
      }
    }
  }

  // Initialize on page load
  handleViewportChange();

  // Listen for viewport changes
  mm.addEventListener("change", handleViewportChange);

  // Toggle open/close
  trigger.addEventListener("click", () => {
    // Only work on mobile
    if (!mm.matches) return;

    console.log("Mobile menu trigger clicked! Current state:", isOpen);
    isOpen = !isOpen;

    if (isOpen) {
      console.log("Opening mobile menu");
      if (!tl) {
        initMobileMenuTimeline();
      }
      tl.play();
    } else {
      console.log("Closing mobile menu");
      if (tl) {
        tl.reverse().then(() => {
          gsap.set(menu, { display: "none" });
          // Remove class when menu is closed
          if (navbar) {
            navbar.classList.remove("mobile-menu-open");
          }
        });
      }
    }
  });

  // Optional: click outside to close
  document.addEventListener("click", (e) => {
    if (
      mm.matches &&
      isOpen &&
      !trigger.contains(e.target) &&
      !menu.contains(e.target)
    ) {
      if (tl) {
        tl.reverse().then(() => {
          isOpen = false;
          gsap.set(menu, { display: "none" });
          // Remove class when menu is closed
          if (navbar) {
            navbar.classList.remove("mobile-menu-open");
          }
        });
      }
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
      spaceBetween: 16,
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

// ------------------ accordion ------------------ //

// Function to update feature images opacity (single index or array of indices for "first in each group")
function updateFeatureImages(activeIndexOrIndices) {
  const indices = Array.isArray(activeIndexOrIndices)
    ? activeIndexOrIndices
    : [activeIndexOrIndices];
  const set = new Set(indices);
  $(".feature--img").each(function (index) {
    $(this).css("opacity", set.has(index) ? "1" : "0");
  });
}

// Function to open a specific FAQ item (instant = true skips animation, for reliable open-on-load)
function openFaqItem(faqItem, index, instant) {
  console.log("[FAQ] openFaqItem called", { index, instant: !!instant, faqItem: faqItem[0] });
  const response = faqItem.find(".faq--response");
  if (!response.length) {
    console.warn("[FAQ] openFaqItem: no .faq--response found inside item", faqItem[0]);
    return;
  }

  // Close other open items in the same group only (siblings under same parent)
  const groupParent = faqItem.parent()[0];
  $(".faq--item.open").each(function () {
    if (this === faqItem[0]) return;
    if ($(this).parent()[0] !== groupParent) return; // different group, leave it open
    const otherResponse = $(this).find(".faq--response");
    if (instant) {
      otherResponse.css("height", "0");
    } else {
      otherResponse.animate({ height: "0px" }, 500);
    }
    $(this).removeClass("open");
  });

  if (instant) {
    response.css("height", "auto");
    faqItem.addClass("open");
  } else {
    // Open with animation: measure content height (use scrollHeight if height is 0 before reflow)
    response.css("height", "auto");
    let autoHeight = response.height();
    if (autoHeight === 0 && response[0]) {
      autoHeight = response[0].scrollHeight;
    }
    console.log("[FAQ] openFaqItem height measurement", { autoHeight, scrollHeight: response[0]?.scrollHeight, responseEl: response[0] });
    response.css("height", "0px");
    response.animate({ height: autoHeight }, 500, () => {
      response.css("height", "auto");
    });
    faqItem.addClass("open");
  }

  // Update feature images
  updateFeatureImages(index);
}

// Initialize FAQ accordion
$(document).ready(function () {
  const faqItems = $(".faq--item");
  console.log("[FAQ] document.ready: .faq--item count =", faqItems.length, faqItems.length ? faqItems.toArray() : "(none found)");

  // Unique parent elements that contain .faq--item (each is one "group" of siblings)
  function getFaqGroups() {
    const parents = new Set();
    $(".faq--item").each(function () {
      const parent = $(this).parent()[0];
      if (parent) parents.add(parent);
    });
    return Array.from(parents);
  }

  // Open the first item in each group of siblings (each FAQ section)
  function openFirstInEachGroup() {
    const groups = getFaqGroups();
    const firstItemIndices = [];
    console.log("[FAQ] openFirstInEachGroup: found", groups.length, "group(s)");
    groups.forEach(function (parentEl) {
      const firstInGroup = $(parentEl).children(".faq--item").first();
      if (firstInGroup.length) {
        const index = $(".faq--item").index(firstInGroup[0]);
        firstItemIndices.push(index);
        openFaqItem(firstInGroup, index, true);
      }
    });
    if (firstItemIndices.length) {
      updateFeatureImages(firstItemIndices);
    }
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(openFirstInEachGroup);
  });

  // Retry after delay (handles pages where Webflow/other scripts run after us or FAQ section is revealed later)
  function ensureFirstFaqOpen() {
    const groups = getFaqGroups();
    let opened = 0;
    groups.forEach(function (parentEl) {
      const hasOpenInGroup = $(parentEl).children(".faq--item.open").length > 0;
      if (hasOpenInGroup) return;
      const firstInGroup = $(parentEl).children(".faq--item").first();
      if (firstInGroup.length) {
        const index = $(".faq--item").index(firstInGroup[0]);
        openFaqItem(firstInGroup, index, true);
        opened++;
      }
    });
    if (opened > 0) {
      console.log("[FAQ] ensureFirstFaqOpen: opened first in", opened, "group(s) (retry)");
    }
    // Sync feature images to all currently open items
    const openIndices = $(".faq--item.open")
      .toArray()
      .map(function (el) {
        return $(".faq--item").index(el);
      });
    if (openIndices.length) {
      updateFeatureImages(openIndices);
    }
  }
  setTimeout(ensureFirstFaqOpen, 400);
  setTimeout(ensureFirstFaqOpen, 1000);

  // Initial feature images set after openFirstInEachGroup (no pre-set; avoid flash of wrong image)
  $(".feature--img").css("opacity", "0");

  $(".faq--item").on("click", function () {
    const faqItems = $(".faq--item");
    const currentIndex = faqItems.index(this);

    // If this item is already open, close it
    if ($(this).hasClass("open")) {
      const response = $(this).find(".faq--response");
      response.animate({ height: "0px" }, 500);
      $(this).removeClass("open");

      // Hide all feature images when closing
      $(".feature--img").css("opacity", "0");
    } else {
      // Open this item
      openFaqItem($(this), currentIndex);
    }
  });
});

// ------------------ story popup animation ------------------ //

document.addEventListener("DOMContentLoaded", () => {
  // Function to open the story popup
  const openStoryPopup = () => {
    const contactParent = document.querySelector(".contact--parent");
    const contactParentBg = document.querySelector(".contact--parent-bg");
    const contactParentParent = document.querySelector(
      ".contact--parent-parent"
    );

    if (!contactParent || !contactParentBg || !contactParentParent) {
      console.warn("Story popup elements not found");
      return;
    }

    // Create GSAP timeline for opening animation
    const tl = gsap.timeline();

    tl
      // Show the popup container
      .set(contactParent, { display: "flex" })

      // Animate background opacity
      .fromTo(
        contactParentBg,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0
      )

      // Animate content slide in
      .fromTo(
        contactParentParent,
        { x: "100vw" },
        { x: "0vw", duration: 0.5, ease: "power3.out" },
        0.1
      );
  };

  // Function to close the story popup
  const closeStoryPopup = () => {
    const contactParent = document.querySelector(".contact--parent");
    const contactParentBg = document.querySelector(".contact--parent-bg");
    const contactParentParent = document.querySelector(
      ".contact--parent-parent"
    );

    if (!contactParent || !contactParentBg || !contactParentParent) {
      console.warn("Story popup elements not found");
      return;
    }

    // Create GSAP timeline for closing animation
    const tl = gsap.timeline();

    tl
      // Animate content slide out
      .to(contactParentParent, {
        x: "100vw",
        duration: 0.4,
        ease: "power3.in",
      })

      // Animate background opacity out
      .to(
        contactParentBg,
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        0.1
      )

      // Hide the popup container
      .set(contactParent, { display: "none" });
  };

  // Add click event listeners to elements with animate="storypopup"
  document.querySelectorAll('[animate="storypopup"]').forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      openStoryPopup();
    });
  });

  // Add click event listeners to close buttons
  document.querySelectorAll(".popup--close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeStoryPopup();
    });
  });

  // Add click event listener to background overlay
  const contactParentBg = document.querySelector(".contact--parent-bg");
  if (contactParentBg) {
    contactParentBg.addEventListener("click", (e) => {
      // Only close if clicking directly on the background (not on child elements)
      if (e.target === contactParentBg) {
        closeStoryPopup();
      }
    });
  }

  // Optional: Close popup with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const contactParent = document.querySelector(".contact--parent");
      if (contactParent && contactParent.style.display === "flex") {
        closeStoryPopup();
      }
    }
  });
});

// ------------------ popup animation (vertical slide) ------------------ //

document.addEventListener("DOMContentLoaded", () => {
  // Function to open the popup
  const openPopup = () => {
    const contactParent = document.querySelector(".contact--parent");
    const contactParentBg = document.querySelector(".contact--parent-bg");
    const contactParentParent = document.querySelector(
      ".contact--parent-parent"
    );

    if (!contactParent || !contactParentBg || !contactParentParent) {
      console.warn("Popup elements not found");
      return;
    }

    // Create GSAP timeline for opening animation
    const tl = gsap.timeline();

    tl
      // Show the popup container
      .set(contactParent, { display: "flex" })

      // Animate background opacity and content slide in simultaneously
      .fromTo(
        contactParentBg,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        0
      )
      .fromTo(
        contactParentParent,
        { x: "100vw" },
        { x: "0vw", duration: 0.5, ease: "power3.out" },
        0
      );
  };

  // Function to close the popup
  const closePopup = () => {
    const contactParent = document.querySelector(".contact--parent");
    const contactParentBg = document.querySelector(".contact--parent-bg");
    const contactParentParent = document.querySelector(
      ".contact--parent-parent"
    );

    if (!contactParent || !contactParentBg || !contactParentParent) {
      console.warn("Popup elements not found");
      return;
    }

    // Create GSAP timeline for closing animation
    const tl = gsap.timeline();

    tl
      // Animate content slide out and background fade out simultaneously
      .to(
        contactParentParent,
        { x: "100vw", duration: 0.4, ease: "power3.in" },
        0
      )
      .to(contactParentBg, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0)

      // Hide the popup container after animation
      .set(contactParent, { display: "none" });
  };

  // Add click event listeners to elements with animate="popup"
  document.querySelectorAll('[animate="popup"]').forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      openPopup();
    });
  });

  // Add click event listeners to close buttons
  document.querySelectorAll(".popup--close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closePopup();
    });
  });

  // Add click event listener to background overlay
  const contactParentBg = document.querySelector(".contact--parent-bg");
  if (contactParentBg) {
    contactParentBg.addEventListener("click", (e) => {
      // Only close if clicking directly on the background (not on child elements)
      if (e.target === contactParentBg) {
        closePopup();
      }
    });
  }

  // Optional: Close popup with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const contactParent = document.querySelector(".contact--parent");
      if (contactParent && contactParent.style.display === "flex") {
        closePopup();
      }
    }
  });
});

// ------------------ banner close functionality ------------------ //

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".navbar--banner");
  const closeTrigger = document.querySelector(".banner--close-trigger");

  if (!banner || !closeTrigger) {
    return; // Exit if elements don't exist
  }

  // Check if banner was previously closed and when
  const bannerClosedTimestamp = localStorage.getItem("bannerClosedTimestamp");

  if (bannerClosedTimestamp) {
    const closedTime = parseInt(bannerClosedTimestamp, 10);
    const currentTime = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if 24 hours have passed
    if (currentTime - closedTime < twentyFourHours) {
      // If less than 24 hours, keep banner hidden
      gsap.set(banner, { height: 0, overflow: "hidden" });
    } else {
      // If 24 hours have passed, clear the timestamp to show banner again
      localStorage.removeItem("bannerClosedTimestamp");
    }
  }

  // Add click event to close trigger
  closeTrigger.addEventListener("click", () => {
    // Animate banner to height 0
    gsap.to(banner, {
      height: 0,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        // Set overflow hidden to prevent content from showing
        gsap.set(banner, { overflow: "hidden" });
      },
    });

    // Save current timestamp to localStorage
    localStorage.setItem("bannerClosedTimestamp", Date.now().toString());
  });
});

// ------------------ news social sharing ------------------ //

// News Template Social Sharing Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get all social share links (new class structure)
  const socialShareLinks = document.querySelectorAll(
    ".new--share-link.is--post"
  );
  const popupCopy = document.querySelector(".popup--copy");

  // Get current page URL and title
  const currentUrl = window.location.href;
  const currentTitle = document.title;

  // Social sharing URLs
  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(currentTitle)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`,
  };

  // Function to show copy popup
  function showCopyPopup() {
    if (popupCopy) {
      popupCopy.style.display = "flex";
      popupCopy.style.opacity = "1";
      popupCopy.style.transform = "translateY(0)";

      // Hide popup after 2 seconds
      setTimeout(() => {
        popupCopy.style.opacity = "0";
        popupCopy.style.transform = "translateY(-10px)";

        setTimeout(() => {
          popupCopy.style.display = "none";
        }, 300);
      }, 2000);
    }
  }

  // Function to copy URL to clipboard
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      showCopyPopup();
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showCopyPopup();
    }
  }

  // Function to open social sharing window
  function openSocialShare(url) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      url,
      "social-share",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  // Add click event listeners to each social share link
  socialShareLinks.forEach((link, index) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      switch (index) {
        case 0: // First link - Copy to clipboard
          copyToClipboard();
          break;
        case 1: // Second link - LinkedIn
          openSocialShare(shareUrls.linkedin);
          break;
        case 2: // Third link - X (Twitter)
          openSocialShare(shareUrls.twitter);
          break;
        case 3: // Fourth link - Facebook
          openSocialShare(shareUrls.facebook);
          break;
      }
    });
  });

  // Initialize popup as hidden
  if (popupCopy) {
    popupCopy.style.display = "none";
    popupCopy.style.opacity = "0";
    popupCopy.style.transform = "translateY(-10px)";
    popupCopy.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  }
});
