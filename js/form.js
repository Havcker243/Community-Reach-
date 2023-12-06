// Form submission event listener
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Check if word count in textareas is valid before submitting
  if (
    !isWordCountValid("eventdescription", 150) ||
    !isWordCountValid("vendor_description", 150)
  ) {
    alert("One or more text areas have exceeded the word limit.");
    return; // Stop form submission
  }
  // Collect form data
  var formData = {
    eventname: document.getElementById("eventname").value,
    eventdescription: document.getElementById("eventdescription").value,
    capacity: document.getElementById("capacity").value,
    city: document.getElementById("city").value,
    address: document.getElementById("address").value,
    event_date: document.getElementById("event_date").value,
    coordinator_email: document.getElementById("coordinator_email").value,
    coordinator_phone: document.getElementById("coordinator_phone").value,
    vendor_name: document.getElementById("vendor_name").value,
    vendor_description: document.getElementById("vendor_description").value,
    vendor_email: document.getElementById("vendor_email").value,
    vendor_phone: document.getElementById("vendor_phone").value,
  };

  // Send data to Flask backend
  fetch("/submit-form", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Redirect to success.html on successful submission
      if (data.success) {
        window.location.href = "success.html";
        this.reset(); // Clear the form for new info
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Function to enforce word limit on textareas
function addWordLimitListener(textareaId, messageDivId) {
  document.getElementById(textareaId).addEventListener("input", function () {
    var wordCount = this.value.split(/\s+/).filter((word) => word.length > 0)
      .length;
    document.getElementById(messageDivId).textContent =
      wordCount > 150 ? "Word count exceeds the 150-word limit." : "";
  });
}

// Utility function to check if word count is within limit
function isWordCountValid(textareaId, limit) {
  var textContent = document.getElementById(textareaId).value;
  var wordCount = textContent.split(/\s+/).filter((word) => word.length > 0)
    .length;
  return wordCount <= limit;
}

// Adding word limit listeners to textareas
addWordLimitListener("eventdescription", "eventWordLimitMessage");
addWordLimitListener("vendor_description", "vendorWordLimitMessage");
