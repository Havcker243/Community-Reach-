document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

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


function addWordLimitListener(textareaId, messageDivId) {
    document.getElementById(textareaId).addEventListener('input', function() {
        var wordCount = this.value.split(/\s+/).filter(function(word) { return word.length > 0 }).length; // Count words
        if (wordCount > 150) {
            // Display a message if word count exceeds 150
            document.getElementById(messageDivId).textContent = 'Word count exceeds the 150-word limit.';
        } else {
            document.getElementById(messageDivId).textContent = ''; // Clear message when within limit
        }
    });
}

addWordLimitListener('event_description', 'eventWordLimitMessage');
addWordLimitListener('vendor_description', 'vendorWordLimitMessage');