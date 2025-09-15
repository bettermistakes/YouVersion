// ---------------- Custom YouTube Popup Handler ---------------- //

document.addEventListener("DOMContentLoaded", function () {
  // Set up permissions policy to allow YouTube iframe features
  function setupPermissionsPolicy() {
    // Create a meta tag for permissions policy if it doesn't exist
    let permissionsPolicy = document.querySelector(
      'meta[http-equiv="Permissions-Policy"]'
    );

    if (!permissionsPolicy) {
      permissionsPolicy = document.createElement("meta");
      permissionsPolicy.setAttribute("http-equiv", "Permissions-Policy");
      document.head.appendChild(permissionsPolicy);
    }

    // Set permissions policy to allow YouTube iframe features
    const policy = [
      "accelerometer=(self)",
      "autoplay=(self)",
      "clipboard-write=(self)",
      "encrypted-media=(self)",
      "gyroscope=(self)",
      "picture-in-picture=(self)",
      "web-share=(self)",
    ].join(", ");

    permissionsPolicy.setAttribute("content", policy);
  }

  // Initialize permissions policy
  setupPermissionsPolicy();

  // Function to extract YouTube video ID from URL
  function getYouTubeVideoId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Function to create YouTube embed URL
  function createYouTubeEmbedUrl(videoId) {
    return `https://www.youtube.com/embed/${videoId}?feature=oembed&autoplay=1`;
  }

  // Function to open the custom popup
  function openYouTubePopup(youtubeUrl) {
    console.log("Attempting to open popup with URL:", youtubeUrl);

    const videoId = getYouTubeVideoId(youtubeUrl);
    console.log("Extracted video ID:", videoId);

    if (!videoId) {
      console.warn("Invalid YouTube URL:", youtubeUrl);
      return;
    }

    const embedUrl = createYouTubeEmbedUrl(videoId);
    console.log("Created embed URL:", embedUrl);

    const popup = document.getElementById("youtube-popup");
    const iframe = document.getElementById("youtube-popup-iframe");

    console.log("Popup element:", popup);
    console.log("Iframe element:", iframe);

    if (popup && iframe) {
      // Update iframe source
      iframe.src = embedUrl;

      // Show popup
      popup.classList.add("is--open");
      console.log("Added 'is--open' class to popup");

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      console.log("Opened YouTube popup with URL:", embedUrl);
    } else {
      console.error("Popup or iframe element not found!");
    }
  }

  // Function to close the custom popup
  function closeYouTubePopup() {
    const popup = document.getElementById("youtube-popup");
    const iframe = document.getElementById("youtube-popup-iframe");

    if (popup && iframe) {
      // Hide popup
      popup.classList.remove("is--open");

      // Clear iframe source to stop video
      iframe.src = "";

      // Restore body scroll
      document.body.style.overflow = "";

      console.log("Closed YouTube popup");
    }
  }

  // Add click event listeners to all lightbox slides
  document.querySelectorAll(".lightbox--slide").forEach((slide) => {
    slide.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default Webflow lightbox behavior
      console.log("Lightbox slide clicked!");

      // Find the YouTube link - it's a sibling element, not inside the slide
      const parentContainer = this.closest(".swiper-slide");
      const youtubeLinkElement = parentContainer
        ? parentContainer.querySelector(".youtube--link")
        : null;

      console.log("Parent container:", parentContainer);
      console.log("YouTube link element:", youtubeLinkElement);

      if (youtubeLinkElement) {
        const youtubeUrl = youtubeLinkElement.textContent.trim();
        console.log("YouTube URL found:", youtubeUrl);

        if (youtubeUrl) {
          openYouTubePopup(youtubeUrl);
        }
      } else {
        console.warn("No YouTube link found for this slide");
      }
    });
  });

  // Close popup when clicking the close button
  const closeButton = document.querySelector(".youtube-popup-close");
  if (closeButton) {
    closeButton.addEventListener("click", closeYouTubePopup);
  }

  // Close popup when clicking the backdrop
  const backdrop = document.querySelector(".youtube-popup-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", function (e) {
      console.log("Backdrop clicked - closing popup");
      closeYouTubePopup();
    });
  }

  // Close popup when pressing Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const popup = document.getElementById("youtube-popup");
      if (popup && popup.classList.contains("is--open")) {
        closeYouTubePopup();
      }
    }
  });

  // Prevent popup from closing when clicking inside the video container
  const popupContent = document.querySelector(".youtube-popup-content");
  if (popupContent) {
    popupContent.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Alternative click-outside handler on the main popup container
  const popup = document.getElementById("youtube-popup");
  if (popup) {
    popup.addEventListener("click", function (e) {
      // If the click is on the popup container itself (not on content), close it
      if (e.target === popup) {
        console.log("Popup container clicked - closing popup");
        closeYouTubePopup();
      }
    });
  }
});
