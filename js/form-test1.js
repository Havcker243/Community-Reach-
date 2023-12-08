const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host: '',
  port: '',
  user: '',
  password: '',
  database: ''
});

connection.connect();
console.log('Connected to MySQL database');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Assuming your HTML file is in a 'public' folder

app.post('/submit', (req, res) => {
  const {
    eventname,
    eventdescription,
    capacity,
    city,
    address,
    event_date,
    vendor_name,
    vendor_description,
    vendor_email,
    vendor_phone,
    coordinator_email,
    coordinator_phone
  } = req.body;

  // Insert data into 'Location' table
  const locationInsertQuery = 'INSERT INTO Location (City, Address) VALUES (?, ?)';
  connection.query(locationInsertQuery, [city, address], (error, locationResult) => {
    if (error) throw error;

    const locationId = locationResult.insertId;

    // Insert data into 'Event' table
    const eventInsertQuery = 'INSERT INTO Event (EventName, EventDescription, Capacity, EventDate, LocationID) VALUES (?, ?, ?, ?, ?)';
    connection.query(eventInsertQuery, [eventname, eventdescription, capacity, event_date, locationId], (error, eventResult) => {
      if (error) throw error;

      const eventId = eventResult.insertId;

      // Insert data into 'Vendor' table
      const vendorInsertQuery = 'INSERT INTO Vendor (VendorName, VendorDescription, ContactEmail, ContactPhone, EventID) VALUES (?, ?, ?, ?, ?)';
      connection.query(vendorInsertQuery, [vendor_name, vendor_description, vendor_email, vendor_phone, eventId], (error, vendorResult) => {
        if (error) throw error;

        const vendorId = vendorResult.insertId;

        // Insert data into 'Event_Coordinator' table
        const coordinatorInsertQuery = 'INSERT INTO Event_Coordinator (CoordinatorEmail, CoordinatorPhone, EventID, VendorID) VALUES (?, ?, ?, ?)';
        connection.query(coordinatorInsertQuery, [coordinator_email, coordinator_phone, eventId, vendorId], (error, coordinatorResult) => {
          if (error) throw error;

          res.send('Form submitted successfully!');
        });
      });
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
