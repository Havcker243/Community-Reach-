document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the form data
    var formData = new FormData(event.target);

    // Create an object from the form data
    var data = Object.fromEntries(formData.entries());

    // Convert the data object to a JSON string
    var jsonData = JSON.stringify(data);

    // Create a request options object
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    };

    // Send the request to the API Gateway endpoint
    fetch('communityreach.cjhjdylaa27o.us-west-2.rds.amazonaws.com', requestOptions)
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
});

AWS.config.update({
    region: 'us-west-2b', 
    accessKeyId: 'AKIA2HFIKCI7GYBDCUTV',
    secretAccessKey: '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'
});

const rds = new AWS.RDS();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
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

        console.log('Form Data:', formData);

        const params1 = {
            resourceARN: 'arn:aws:rds:us-west-2:702580134462:db:communityreach', // e.g., 'arn:aws:rds:west-2:702580134462:db:communityreach'
            secretARN: 'arn:aws:secretsmanager:us-west-2:702580134462:secret:submission-fw8EXk', // e.g., 'arn:aws:secretsmanager:us-west-2:123456789012:secret:my-db-secret-xxxxxx'
            database: 'commuityreach', // e.g., 'my-database'
            sql: `INSERT INTO events (EventName, EventDescription, Capacity, eventdate) VALUES (?, ?, ?, ?);`,
            parameters: [
                { name: 'eventname', value: { stringValue: formData.eventname } },
                { name: 'eventdescription', value: { stringValue: formData.eventdescription } },
                { name: 'capacity', value: { stringValue: formData.capacity } },
                { name: 'eventdate', value: { stringValue: formData.event_date } },
            ]
        };

        const params2 = {
            resourceARN: 'arn:aws:rds:us-west-2:702580134462:db:communityreach', // e.g., 'arn:aws:rds:west-2:702580134462:db:communityreach'
            secretARN: 'arn:aws:secretsmanager:us-west-2:702580134462:secret:submission-fw8EXk', // e.g., 'arn:aws:secretsmanager:us-west-2:123456789012:secret:my-db-secret-xxxxxx'
            database: 'commuityreach', // e.g., 'my-database'
            sql: `INSERT INTO vendors (VendorName, VendorDescription, VendorEmail, VendorPhone) VALUES (?, ?, ?, ?);`,
            parameters: [
                { name: 'VendorName', value: { stringValue: formData.vendor_name } },
                { name: 'VendorDescription', value: { stringValue: formData.vendor_description } },
                { name: 'ContactEmail', value: { stringValue: formData.vendor_email } },
                { name: 'ContactPhone', value: { stringValue: formData.vendor_phone } }
            ]
        };

        const params3 = {
            resourceARN: 'arn:aws:rds:us-west-2:702580134462:db:communityreach', // e.g., 'arn:aws:rds:west-2:702580134462:db:communityreach'
            secretARN: 'arn:aws:secretsmanager:us-west-2:702580134462:secret:submission-fw8EXk', // e.g., 'arn:aws:secretsmanager:us-west-2:123456789012:secret:my-db-secret-xxxxxx'
            database: 'commuityreach', // e.g., 'my-database'
            sql: `INSERT INTO Event_Coordinator (CoordinatorEmail, CoordinatorPhone) VALUES (?, ?);`,
            parameters: [
                { name: 'CoordinatorEmail', value: { stringValue: formData.coordinator_email } },
                { name: 'CoordinatorPhone', value: { stringValue: formData.coordinator_phone } }
            ]
        };

        const params4 = {
            resourceARN: 'arn:aws:rds:us-west-2:702580134462:db:communityreach', // e.g., 'arn:aws:rds:west-2:702580134462:db:communityreach'
            secretARN: 'arn:aws:secretsmanager:us-west-2:702580134462:secret:submission-fw8EXk', // e.g., 'arn:aws:secretsmanager:us-west-2:123456789012:secret:my-db-secret-xxxxxx'
            database: 'commuityreach', // e.g., 'my-database'
            sql: `INSERT INTO Location (city, address) VALUES (?, ?);`,
            parameters: [
                { name: 'city', value: { stringValue: formData.city } },
                { name: 'address', value: { stringValue: formData.address } }
            ]
        };

        rds.executeStatement(params1, function(err, data) {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('Success:', data);
            }
        });

        rds.executeStatement(params2, function(err, data) {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('Success:', data);
            }
        });

        rds.executeStatement(params3, function(err, data) {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('Success:', data);
            }
        });

        rds.executeStatement(params4, function(err, data) {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('Success:', data);
            }
        });
    });
});