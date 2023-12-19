// Event listener for the DOMContentLoaded event to ensure the script runs after the DOM is fully parsed.
document.addEventListener("DOMContentLoaded", () => {
  // Function to fetch options from a Flask endpoint and populate a dropdown.
  const fetchOptions = (endpoint, selectElement) => {
    // Fetch data from the given Flask endpoint.
    fetch(endpoint)
      .then((response) => response.json()) // Parse the response as JSON.
      .then((data) => {
        // Loop through the data received from the Flask route.
        data.forEach((option) => {
          // Create a new option element for each item in the data array.
          const optionElement = document.createElement("option");
          optionElement.value = option; // Set the value of the option element.
          optionElement.textContent = option; // Set the display text of the option.
          selectElement.appendChild(optionElement); // Add the option to the select element.
        });
      });
  };

  // Fetch and populate the event dates dropdown.
  const dateSelect = document.getElementById("eventDate");
  fetchOptions("/get_dates", dateSelect);

  // Fetch and populate the event cities dropdown.
  const citySelect = document.getElementById("eventCity");
  fetchOptions("/get_cities", citySelect);

  // Fetch and populate the event addresses dropdown.
  const addressSelect = document.getElementById("eventAddress");
  fetchOptions("/get_addresses", addressSelect);

  // Function to handle event search.
  function searchEvents() {
    // Retrieve the selected values from the dropdowns.
    var eventDate = $("#eventDate").val();
    var eventCity = $("#eventCity").val();
    var eventAddress = $("#eventAddress").val();

    // Perform an AJAX POST request to search for events with the selected criteria.
    $.ajax({
      type: "POST",
      url: "/search_events",
      data: {
        eventDate: eventDate,
        eventCity: eventCity,
        eventAddress: eventAddress,
      },
      success: function (response) {
        // If successful, display the search results in the designated HTML element.
        $("#searchResults").html(response);
      },
      error: function (error) {
        // Log any errors to the console.
        console.log("Error fetching search results:", error);
      },
    });
  }

  // Event handler for the search form submission to prevent default form submission and call the searchEvents function.
  $("#searchForm").submit(function (event) {
    event.preventDefault(); // Prevent the default form submission.
    searchEvents(); // Call the searchEvents function to perform the search.
  });
});
