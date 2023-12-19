# Import necessary libraries
import re
import mysql.connector
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os
from flask import Flask, request, render_template, jsonify, redirect, url_for
from datetime import datetime



# Set up the Flask app
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
bcrypt = Bcrypt(app)



# Configure database settings using environment variables for security
app.config['DB_USERNAME'] = os.getenv('DB_USERNAME')
app.config['DB_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['DB_HOST'] = os.getenv('DB_HOST')
app.config['DB_NAME'] = os.getenv('DB_NAME')



# Regex patterns
EMAIL_PATTERN = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
PASSWORD_PATTERN = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')



# Function to connect to the database
def get_db_connection():
    # Create and return a new database connection
    return mysql.connector.connect(
        user=app.config['DB_USERNAME'],
        password=app.config['DB_PASSWORD'],
        host=app.config['DB_HOST'],
        database=app.config['DB_NAME']
    )



# Route to get event dates and send them back as JSON
@app.route('/get_dates', methods=['GET'])
def get_dates():
    conn = get_db_connection()  # Connect to the database
    cursor = conn.cursor()
    cursor.execute('SELECT EventDate FROM Events')  # Execute SQL query
    event_dates = cursor.fetchall()  # Fetch all results
    cursor.close()
    conn.close()

    # Convert dates to strings and return them
    dates = [date[0].strftime('%Y-%m-%d') for date in event_dates]
    return jsonify(dates)



# Route to get a list of cities and send them back as JSON
@app.route('/get_cities', methods=['GET'])
def get_cities():
    conn = get_db_connection()  # Connect to the database
    cursor = conn.cursor()
    cursor.execute('SELECT City FROM Locations')  # Execute SQL query
    cities = cursor.fetchall()  # Fetch all results
    cursor.close()
    conn.close()

    # Extract city names and return them
    city_list = [city[0] for city in cities]
    return jsonify(city_list)



# Route to get addresses from the database and send back as JSON
@app.route('/get_addresses', methods=['GET'])
def get_addresses():
    conn = get_db_connection()  # Connect to the database
    cursor = conn.cursor()
    cursor.execute('SELECT Address FROM Locations')  # Get addresses
    addresses = cursor.fetchall()  # Fetch all results
    cursor.close()
    conn.close()

    # Make a list of addresses and send back as JSON
    address_list = [address[0] for address in addresses]
    return jsonify(address_list)



# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')  # Show the home page



# Route for the categories page
@app.route('/categories')
def categories():
    return render_template('categories.html')  # Show the categories page



# Route for the form page
@app.route('/form')
def form():
    return render_template('form.html')  # Show the form page



# Route for the location search page
@app.route('/location')
def location():
    return render_template('location-page.html')  # Show the location search page



# Route to get the latest 5 events and return them as JSON
@app.route('/get_events')
def get_events():
    conn = get_db_connection()  # Connect to the database
    cursor = conn.cursor()
    cursor.execute('SELECT id, EventName, EventDate FROM Events ORDER BY EventDate DESC LIMIT 5')
    latest_events = cursor.fetchall()  # Get latest 5 events
    cursor.close()
    conn.close()

    # Prepare and return the event data as JSON
    events_json = [{"id": event[0], "name": event[1], "date": event[2]} for event in latest_events]
    return jsonify(events_json)



# Route to show the latest 9 events on a web page
@app.route('/events')
def events():
    conn = get_db_connection()  # Connect to the database
    cursor = conn.cursor()
    # Get the latest 9 events and their addresses
    cursor.execute(
        '''SELECT Events.EventID, Events.EventName, Events.EventDescription, Events.EventDate, Locations.Address 
        FROM Events
        JOIN Locations ON Events.LocationID = Locations.LocationID
        ORDER BY Events.EventDate DESC
        LIMIT 9''')
    latest_events = cursor.fetchall()  # Fetch the events
    cursor.close()
    conn.close()

    # Prepare the events for display in the HTML template
    formatted_events = [
        {'id': event[0], 'name': event[1], 'Description': event[2],  'date': event[3], 'address': event[4]}
        for event in latest_events
    ]

    # Render and show the events page
    return render_template('events.html', latest_events=formatted_events)



# Route to handle form submission (POST request)
@app.route('/submit_form', methods=['POST'])
def submit_form():
    if request.method == 'POST':  # Check if the request method is POST
        try:
            conn = get_db_connection()  # Create a database connection
            cursor = conn.cursor()

            # Retrieve form data from the submitted form
            event_name = request.form['eventname']
            event_description = request.form['eventdescription']
            capacity = int(request.form['capacity'])
            city = request.form['city']
            address = request.form['address']
            event_date = request.form['event_date']
            coordinator_email = request.form['coordinator_email']
            coordinator_phone = request.form['coordinator_phone']
            vendor_name = request.form['vendor_name']
            vendor_description = request.form['vendor_description']
            vendor_email = request.form['vendor_email']
            vendor_phone = request.form['vendor_phone']

            # Insert Location information into the Locations table
            location_query = "INSERT INTO Locations (City, Address) VALUES (%s, %s)"
            cursor.execute(location_query, (city, address))
            location_id = cursor.lastrowid

            # Insert EventCoordinator information into the Event_Coordinator table
            coordinator_query = "INSERT INTO Event_Coordinator (CoordinatorEmail, CoordinatorPhone) VALUES (%s, %s)"
            cursor.execute(coordinator_query, (coordinator_email, coordinator_phone))
            coordinator_id = cursor.lastrowid

            # Insert Vendor information into the Vendors table
            vendor_query = "INSERT INTO Vendors (VendorName, VendorDescription, ContactEmail, ContactPhone) VALUES (%s, %s, %s, %s)"
            cursor.execute(vendor_query, (vendor_name, vendor_description, vendor_email, vendor_phone))
            vendor_id = cursor.lastrowid

            # Insert Event information into the Events table
            event_query = "INSERT INTO Events (EventName, EventDescription, Capacity, RegistrationStat, EventDate, LocationID, CoordinatorID) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(event_query, (event_name, event_description, capacity, True, event_date, location_id, coordinator_id))

            conn.commit()  # Commit the changes to the database

            cursor.close()  # Close the database cursor
            conn.close()  # Close the database connection

            return redirect(url_for('success'))  # Redirect to the success page

        except Exception as e:
            conn.rollback()  # Rollback changes in case of an error
            cursor.close()
            conn.close()
            return f'Error: {str(e)}'  # Return an error message if an exception occurs



# Route to display a success message after form submission.
@app.route('/success')
def success():
    # Render the success template
    return render_template('/success.html')



##The login route is used to take the information from the user when they want to login to their account and checks
#it with the database #
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Validate input
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    # Database query to find the user
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.check_password_hash(user[0], password):
        # Generate token or session
        # Return success response
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401



# This is the route function that takes in data from the regestration.js and 
#saves it to the database , the route also hashes the password before it is saved into the database #
@app.route('/register', methods=['POST'])
def register():
        # Get data from request
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate input
        if not username or not username.strip():
            return jsonify({'message': 'Username is required'}), 400
        if not email or not EMAIL_PATTERN.match(email):
            return jsonify({'message': 'Invalid email format'}), 400
        if not password or not PASSWORD_PATTERN.match(password):
            return jsonify({'message': 'Password must be at least 8 characters long and include at least one letter and one number'}), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Insert into the database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)',
                        (username, email, hashed_password))
            conn.commit()
        except mysql.connector.IntegrityError as e:
            return jsonify({'message': 'User with this username or email already exists'}), 409
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            cursor.close()
            conn.close()

        return jsonify({'message': 'User registered successfully'}), 201
    


# Route to handle event search (POST request)
@app.route('/search_events', methods=['POST'])
def search_events():
    try:
        # Retrieve search parameters from the POST request
        event_date = request.form['eventDate']
        event_city_name = request.form['eventCity']

        conn = get_db_connection()  # Create a database connection
        cursor = conn.cursor()

        # Query the database for the city ID based on the provided city name
        cursor.execute('SELECT id FROM Locations WHERE City = %s', (event_city_name,))
        city_result = cursor.fetchone()

        # If the city is not found, return an error message
        if city_result is None:
            cursor.close()
            conn.close()
            return "City not found"

        city_id = city_result[0]

        # Query the database for events matching the search parameters
        query = ('SELECT EventName, EventDescription, EventDate FROM Events '
                 'WHERE EventDate = %s AND LocationID = %s')
        cursor.execute(query, (event_date, city_id))
        events = cursor.fetchall()

        # Build HTML content to display each event in the search results
        search_result_html = ""
        for event in events:
            search_result_html += f"<div><h3>{event[0]}</h3><p>Description: {event[1]}</p><p>Date: {event[2]}</p></div>"

        cursor.close()  # Close the database cursor
        conn.close()  # Close the database connection

        return search_result_html  # Return HTML content with search results

    except Exception as e:
        return f"Error: {str(e)}"  # Return an error message if an exception occurs



# The starting point of the Flask application.
if __name__ == '__main__':
    app.run(debug=True)
