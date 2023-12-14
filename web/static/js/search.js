// search.js
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch options from Flask routes
    const fetchOptions = (endpoint, selectElement) => {
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                // Populate dropdown with options
                data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    selectElement.appendChild(optionElement);
                });
            });
    };

    // Fetch dates
    const dateSelect = document.getElementById('eventDate');
    fetchOptions('/get_dates', dateSelect);

    // Fetch cities
    const citySelect = document.getElementById('eventCity');
    fetchOptions('/get_cities', citySelect);

    // Fetch addresses
    const addressSelect = document.getElementById('eventAddress');
    fetchOptions('/get_addresses', addressSelect);

    // Other code for form submission and handling search results can go here

    function searchEvents() {
        var eventDate = $('#eventDate').val();
        var eventCity = $('#eventCity').val(); // Assuming city name is selected here
        var eventAddress = $('#eventAddress').val();
    
        // AJAX request to fetch search results
        $.ajax({
            type: 'POST',
            url: '/search_events',
            data: {
                eventDate: eventDate,
                eventCity: eventCity, // Send city name as a string
                eventAddress: eventAddress
            },
            success: function(response) {
                $('#searchResults').html(response);
            },
            error: function(error) {
                console.log('Error fetching search results:', error);
            }
        });
    }
    
    $('#searchForm').submit(function(event) {
        event.preventDefault();
        searchEvents();
    });
});
