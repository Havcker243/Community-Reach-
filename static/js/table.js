// Function to fetch the latest events from the server and update the event list on the web page.
function fetchLatestEvents() {
  // Send an AJAX GET request to the '/latest_events' route.
  $.ajax({
    url: "/latest_events",
    method: "GET",
    success: function (response) {
      // If the request is successful, first clear any existing events from the event list.
      $("#event-list").empty();

      // Then iterate over each event in the response.
      response.forEach(function (event) {
        // For each event, append a list item to the event list with the event's name and date.
        $("#event-list").append(`<li>${event.name} - ${event.date}</li>`);
      });
    },
    error: function (error) {
      // If the request fails, log the error to the console.
      console.error("Error fetching latest events:", error);
    },
  });
}

// Set up an interval to refresh the events every 5 seconds.
// This calls the fetchLatestEvents function repeatedly at the specified interval.
setInterval(fetchLatestEvents, 5000);
