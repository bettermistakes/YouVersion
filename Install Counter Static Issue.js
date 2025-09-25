(function () {
  STATS = {};

  $.getJSON("./js/stats.json?d=300", function (data) {
    STATS = data;
  })
    .fail(function (jsxhr, textStatus, error) {
      // Updated corrected_total_downloads and start_date/start_count on Aug 15, 2012:
      // Now that we pull in remote data, this should only need to be kept up
      // to date if the remote is failing. It'll be our (potentially less-than-accurate) fallback.
      STATS.start_date = 1498608000;
      STATS.start_count = 276699078;
      STATS.average_per_day = 113587;
    })
    .done(function () {
      var start_count = STATS.start_count;
      var start_date = STATS.start_date;
      var average_per_day = STATS.average_per_day;

      var single_pace = 950;

      // Todays Unix type timestamp (seconds):
      var today_date = Math.round(new Date().getTime() / 1000);
      // Approximate days since start_time (seconds):
      var date_difference_seconds = Math.abs(today_date - start_date);
      //var date_difference_days = Math.round(date_difference_seconds / 86400);
      var date_difference_days_not_round = date_difference_seconds / 86400;
      //var corrected_total_downloads = Math.round(start_count + (average_per_day*date_difference_days));
      var corrected_total_downloads_not_round = Math.round(
        start_count + average_per_day * date_difference_days_not_round
      );
      var myCounter = new flipCounter("counter", {
        value: corrected_total_downloads_not_round,
        inc: 1,
        pace: single_pace,
        auto: true,
        tFH: 55,
        bFH: 55,
        fW: 82,
      });
    });
})();
