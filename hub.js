// Role sections visibility handler
document.addEventListener("DOMContentLoaded", function () {
  // Function to check if open roles collection has items and toggle sections accordingly
  function toggleRoleSections() {
    const openRolesSection = document.querySelector(".section.is--openroles");
    const closedRolesSection = document.querySelector(
      ".section.is--closedroles"
    );

    if (!openRolesSection || !closedRolesSection) {
      console.warn(
        "Role sections not found. Make sure you have elements with classes .section.is--openroles and .section.is--closedroles"
      );
      return;
    }

    // Look for collection list inside the open roles section
    const collectionList =
      openRolesSection.querySelector("[data-wf-collection-list]") ||
      openRolesSection.querySelector(".w-dyn-list") ||
      openRolesSection.querySelector(".collection-list") ||
      openRolesSection.querySelector('[class*="collection"]');

    if (!collectionList) {
      console.warn("Collection list not found inside .section.is--openroles");
      return;
    }

    // Check if the collection list has any items
    const collectionItems =
      collectionList.querySelectorAll("[data-wf-collection-item]") ||
      collectionList.querySelectorAll(".w-dyn-item") ||
      collectionList.querySelectorAll(".collection-item") ||
      collectionList.querySelectorAll('[class*="item"]');

    // Count actual visible items (not empty placeholders)
    let visibleItemCount = 0;
    collectionItems.forEach((item) => {
      // Check if item is visible and not a placeholder
      const isVisible =
        item.offsetHeight > 0 &&
        item.offsetWidth > 0 &&
        !item.classList.contains("w-dyn-empty") &&
        !item.hasAttribute("data-wf-collection-empty");

      if (isVisible) {
        visibleItemCount++;
      }
    });

    console.log(
      `Found ${visibleItemCount} visible items in open roles collection`
    );

    // Toggle sections based on whether there are items
    if (visibleItemCount > 0) {
      // Has items - show open roles, hide closed roles
      openRolesSection.style.display = "block";
      closedRolesSection.style.display = "none";
      console.log("Showing open roles section, hiding closed roles section");
    } else {
      // No items - hide open roles, show closed roles
      openRolesSection.style.display = "none";
      closedRolesSection.style.display = "block";
      console.log("Hiding open roles section, showing closed roles section");
    }
  }

  // Run on page load
  toggleRoleSections();

  // Optional: Re-run if Webflow collection data loads asynchronously
  // This is useful if the collection data loads after the initial page load
  const observer = new MutationObserver(function (mutations) {
    let shouldCheck = false;

    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Check if any added nodes are collection items
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (
              node.matches &&
              (node.matches("[data-wf-collection-item]") ||
                node.matches(".w-dyn-item") ||
                node.matches('[class*="collection"]'))
            ) {
              shouldCheck = true;
            }
          }
        });
      }
    });

    if (shouldCheck) {
      // Debounce the check to avoid excessive calls
      clearTimeout(window.roleSectionTimeout);
      window.roleSectionTimeout = setTimeout(toggleRoleSections, 100);
    }
  });

  // Start observing the open roles section for changes
  const openRolesSection = document.querySelector(".section.is--openroles");
  if (openRolesSection) {
    observer.observe(openRolesSection, {
      childList: true,
      subtree: true,
    });
  }

  // Also listen for Webflow's collection data loaded event if available
  if (window.Webflow && window.Webflow.push) {
    window.Webflow.push(function () {
      // Re-check after Webflow has fully loaded
      setTimeout(toggleRoleSections, 500);
    });
  }
});
