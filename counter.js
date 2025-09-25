async function getLiveInstallCount() {
  try {
    const response = await fetch(
      "https://installs.youversion.com/stats.json?t=" + Date.now(),
      {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      }
    );

    if (response.ok) {
      const data = await response.json();
      const start_count = data.start_count;
      const start_date = data.start_date;
      const average_per_day = data.average_per_day;

      const today_date = Math.round(new Date().getTime() / 1000);
      const date_difference_seconds = Math.abs(today_date - start_date);
      const date_difference_days_not_round = date_difference_seconds / 86400;

      return Math.round(
        start_count + average_per_day * date_difference_days_not_round
      );
    } else {
      throw new Error("API not accessible");
    }
  } catch (error) {
    const start_count = 989880669;
    const start_date = 1758412800;
    const average_per_day = 174471;

    const today_date = Math.round(new Date().getTime() / 1000);
    const date_difference_seconds = Math.abs(today_date - start_date);
    const date_difference_days_not_round = date_difference_seconds / 86400;

    return Math.round(
      start_count + average_per_day * date_difference_days_not_round
    );
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const counterElement = document.getElementById("installs-number");

  function updateCounterDisplay(count) {
    counterElement.textContent = count.toLocaleString("en-US");
  }

  async function updateCounter() {
    const liveCount = await getLiveInstallCount();
    updateCounterDisplay(liveCount);
  }

  await updateCounter();
  setInterval(updateCounter, 1000);
});
