// Role sections visibility handler
document.addEventListener("DOMContentLoaded", function () {
  // Function to check if open roles collection has items and toggle sections accordingly
  function toggleRoleSections() {
    console.log("=== toggleRoleSections() called ===");

    const openRolesSection = document.querySelector(".section.is--openroles");
    const closedRolesSection = document.querySelector(
      ".section.is--closedroles"
    );

    console.log("Open roles section found:", !!openRolesSection);
    console.log("Closed roles section found:", !!closedRolesSection);

    if (!openRolesSection || !closedRolesSection) {
      console.warn(
        "Role sections not found. Make sure you have elements with classes .section.is--openroles and .section.is--closedroles"
      );
      return;
    }

    // Look for collection list inside the open roles section with more comprehensive selectors
    const collectionList =
      openRolesSection.querySelector("[data-wf-collection-list]") ||
      openRolesSection.querySelector(".w-dyn-list") ||
      openRolesSection.querySelector(".collection-list") ||
      openRolesSection.querySelector('[class*="collection"]') ||
      openRolesSection.querySelector('[class*="w-dyn"]') ||
      openRolesSection.querySelector('[class*="list"]');

    console.log("Collection list found:", !!collectionList);
    if (collectionList) {
      console.log("Collection list element:", collectionList);
      console.log("Collection list classes:", collectionList.className);
    }

    if (!collectionList) {
      console.warn("Collection list not found inside .section.is--openroles");
      console.log("Available elements in open roles section:");
      console.log(openRolesSection.innerHTML);
      return;
    }

    // Check if the collection list has any items with more comprehensive selectors
    const collectionItems = collectionList.querySelectorAll(
      "[data-wf-collection-item], .w-dyn-item, .collection-item, [class*='item'], [class*='w-dyn-item']"
    );

    console.log(`Total collection items found: ${collectionItems.length}`);

    // Count actual visible items (not empty placeholders)
    let visibleItemCount = 0;
    collectionItems.forEach((item, index) => {
      // Check if item is visible and not a placeholder
      const isVisible =
        item.offsetHeight > 0 &&
        item.offsetWidth > 0 &&
        !item.classList.contains("w-dyn-empty") &&
        !item.hasAttribute("data-wf-collection-empty") &&
        !item.classList.contains("w-dyn-empty") &&
        item.style.display !== "none" &&
        item.style.visibility !== "hidden";

      console.log(`Item ${index}:`, {
        element: item,
        classes: item.className,
        offsetHeight: item.offsetHeight,
        offsetWidth: item.offsetWidth,
        isVisible: isVisible,
        hasEmptyClass: item.classList.contains("w-dyn-empty"),
        hasEmptyAttr: item.hasAttribute("data-wf-collection-empty"),
      });

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
      console.log("✅ Showing open roles section, hiding closed roles section");
    } else {
      // No items - hide open roles, show closed roles
      openRolesSection.style.display = "none";
      closedRolesSection.style.display = "block";
      console.log("❌ Hiding open roles section, showing closed roles section");
    }
  }

  // Run on page load with multiple attempts to catch async loading
  toggleRoleSections();

  // Run again after a short delay to catch any async loading
  setTimeout(toggleRoleSections, 100);
  setTimeout(toggleRoleSections, 500);
  setTimeout(toggleRoleSections, 1000);
  setTimeout(toggleRoleSections, 2000);

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
                node.matches('[class*="collection"]') ||
                node.matches('[class*="w-dyn"]'))
            ) {
              shouldCheck = true;
              console.log(
                "Collection item detected in mutation observer:",
                node
              );
            }
          }
        });
      }
    });

    if (shouldCheck) {
      // Debounce the check to avoid excessive calls
      clearTimeout(window.roleSectionTimeout);
      window.roleSectionTimeout = setTimeout(() => {
        console.log("Mutation observer triggered toggleRoleSections");
        toggleRoleSections();
      }, 100);
    }
  });

  // Start observing the open roles section for changes
  const openRolesSection = document.querySelector(".section.is--openroles");
  if (openRolesSection) {
    observer.observe(openRolesSection, {
      childList: true,
      subtree: true,
    });
    console.log("Mutation observer started for open roles section");
  }

  // Also listen for Webflow's collection data loaded event if available
  if (window.Webflow && window.Webflow.push) {
    window.Webflow.push(function () {
      // Re-check after Webflow has fully loaded
      console.log("Webflow loaded, re-checking role sections");
      setTimeout(toggleRoleSections, 500);
      setTimeout(toggleRoleSections, 1500);
    });
  }

  // Additional fallback: Listen for any DOM changes that might indicate collection loading
  const globalObserver = new MutationObserver(function (mutations) {
    let shouldCheck = false;

    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if any new element has collection-related classes or attributes
            if (
              node.matches &&
              (node.matches('[class*="w-dyn"]') ||
                node.matches('[class*="collection"]') ||
                node.matches("[data-wf-collection-item]") ||
                node.querySelector('[class*="w-dyn"]') ||
                node.querySelector('[class*="collection"]') ||
                node.querySelector("[data-wf-collection-item]"))
            ) {
              shouldCheck = true;
            }
          }
        });
      }
    });

    if (shouldCheck) {
      clearTimeout(window.globalRoleSectionTimeout);
      window.globalRoleSectionTimeout = setTimeout(() => {
        console.log("Global mutation observer triggered toggleRoleSections");
        toggleRoleSections();
      }, 200);
    }
  });

  // Start global observer on document body
  globalObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
