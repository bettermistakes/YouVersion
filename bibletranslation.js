document.addEventListener("DOMContentLoaded", function () {
  const numberHeadings = document.querySelectorAll(
    ".heading-style-h5.is--number"
  );

  numberHeadings.forEach((el) => {
    const original = el.textContent.trim();
    const number = parseInt(original, 10);

    if (!isNaN(number) && number >= 1 && number <= 9) {
      el.textContent = "0" + number;
    }
  });
});
