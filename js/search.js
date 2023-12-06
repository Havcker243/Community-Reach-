// Function to populate dropdowns
function populateDropdown(dropdownId, apiUrl) {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById(dropdownId);
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// Function to perform search
function performSearch() {
  const date = document.getElementById("eventDate").value;
  const city = document.getElementById("eventCity").value;
  const address = document.getElementById("eventAddress").value;

  fetch(`/api/search?date=${date}&city=${city}&address=${address}`)
    .then((response) => response.json())
    .then((data) => { 
      displayResults(data);
    })
    .catch((error) => console.error("Error:", error));
}
//Mkae a function to display the details of the events 


// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  populateDropdown("eventDate", "/api/dates");
  populateDropdown("eventCity", "/api/cities");
  populateDropdown("eventAddress", "/api/addresses");

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      performSearch();
    });
});
