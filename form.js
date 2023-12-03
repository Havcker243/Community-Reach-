document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var formData = {
            eventname: document.getElementById('eventname').value,
            eventdescription: document.getElementById('eventdescription').value,
            capacity: document.getElementById('capacity').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            event_date: document.getElementById('event_date').value,
            coordinator_email: document.getElementById('coordinator_email').value,
            coordinator_phone: document.getElementById('coordinator_phone').value,
            vendor_name: document.getElementById('vendor_name').value,
            vendor_description: document.getElementById('vendor_description').value,
            vendor_email: document.getElementById('vendor_email').value,
            vendor_phone: document.getElementById('vendor_phone').value
        };

        submitFormData(formData);
    });
});

function submitFormData(formData) {
    console.log('Submitting form data:', formData);

    // Here you can handle the formData
    // For example, sending it to a server using fetch or XMLHttpRequest
    // Or any other processing you need to perform
}

