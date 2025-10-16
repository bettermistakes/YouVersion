// Calculate and display article reading time
function calculateReadingTime() {
  // Get the article content
  const articleContent = document.querySelector(".richtext--content");
  const timeElement = document.querySelector("#time");

  if (!articleContent || !timeElement) {
    console.warn("Article content or time element not found");
    return;
  }

  // Get the text content and count words
  const text = articleContent.textContent || articleContent.innerText;
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate reading time (assuming 200 words per minute average reading speed)
  const wordsPerMinute = 200;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

  // Display the reading time
  timeElement.textContent = `${readingTimeMinutes} min read`;
}

// Run the function when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", calculateReadingTime);
} else {
  calculateReadingTime();
}
