from flask import Flask, request, render_template, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

app = Flask(__name__)

# Configure SQLAlchemy with your AWS RDS MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://admin:qdpvyQzjF84RU0bx74bf@communityreach.cjhjdylaa27o.us-west-2.rds.amazonaws.com:3306/CommunityReach2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Event(db.Model):
    __tablename__ = 'Events'
    id = db.Column(db.Integer, primary_key=True)  # Ensure this column is named 'id'
    EventName = db.Column(db.String(100))
    EventDescription = db.Column(db.String(200))
    Capacity = db.Column(db.Integer)
    RegistrationStat = db.Column(db.Boolean)
    EventDate = db.Column(db.Date)
    LocationID = db.Column(db.Integer, db.ForeignKey('Locations.id'))
    CoordinatorID = db.Column(db.Integer, db.ForeignKey('Event_Coordinator.id'))
    
    location = relationship("Location", foreign_keys=[LocationID])
    coordinator = relationship("EventCoordinator", foreign_keys=[CoordinatorID])



class Location(db.Model):
    __tablename__ = 'Locations'
    id = db.Column(db.Integer, primary_key=True)
    City = db.Column(db.String)
    Address = db.Column(db.String)

class EventCoordinator(db.Model):
    __tablename__ = 'Event_Coordinator'

    id = db.Column(db.Integer, primary_key=True)
    CoordinatorEmail = db.Column(db.String(100))
    CoordinatorPhone = db.Column(db.String(20))

class Vendor(db.Model):
    __tablename__ = 'Vendors'

    id = db.Column(db.Integer, primary_key=True)
    VendorName = db.Column(db.String(100))
    VendorDescription = db.Column(db.Text()) 
    ContactEmail = db.Column(db.String(100))
    ContactPhone = db.Column(db.String(20))



@app.route('/get_dates', methods=['GET'])
def get_dates():
    event_dates = Event.query.with_entities(Event.EventDate).all()
    dates = [date[0].strftime('%Y-%m-%d') for date in event_dates]
    return jsonify(dates)

@app.route('/get_cities', methods=['GET'])
def get_cities():
    cities = Location.query.with_entities(Location.City).all()
    cities = [city[0] for city in cities]
    return jsonify(cities)

@app.route('/get_addresses', methods=['GET'])
def get_addresses():
    addresses = Location.query.with_entities(Location.Address).all()
    addresses = [address[0] for address in addresses]
    return jsonify(addresses)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/categories')
def categories():
    return render_template('categories.html')

@app.route('/events')
def events():
    return render_template('events.html')

@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/location')
def location():
    return render_template('location-page.html')

@app.route('/submit_form', methods=['POST'])
def submit_form():
    if request.method == 'POST':
        try:
            # Fetch form data
            event_name = request.form['eventname']
            event_description = request.form['eventdescription']
            capacity = request.form['capacity']
            city = request.form['city']
            address = request.form['address']
            event_date = request.form['event_date']
            coordinator_email = request.form['coordinator_email']
            coordinator_phone = request.form['coordinator_phone']
            vendor_name = request.form['vendor_name']
            vendor_description = request.form['vendor_description']
            vendor_email = request.form['vendor_email']
            vendor_phone = request.form['vendor_phone']

            # Create and insert records using SQLAlchemy
            new_location = Location(City=city, Address=address)
            db.session.add(new_location)
            db.session.commit()

            new_event_coordinator = EventCoordinator(CoordinatorEmail=coordinator_email, CoordinatorPhone=coordinator_phone)
            db.session.add(new_event_coordinator)
            db.session.commit()
            
            new_vendor = Vendor(VendorName=vendor_name, VendorDescription=vendor_description, ContactEmail=vendor_email, ContactPhone=vendor_phone)
            db.session.add(new_vendor)
            db.session.commit()

            new_event = Event(EventName=event_name, EventDescription=event_description,
                  EventDate=event_date, RegistrationStat=True, Capacity=capacity,
                  LocationID=new_location.id, CoordinatorID=new_event_coordinator.id)
            
            db.session.add(new_event)
            db.session.commit()

            return redirect(url_for('success'))
        except Exception as e:
            return f'Error: {str(e)}'

@app.route('/success')
def success():
    return render_template('/success.html')

@app.route('/search_events', methods=['POST'])
def search_events():
    try:
        # Assuming you retrieve events based on the provided parameters
        event_date = request.form['eventDate']
        event_city_name = request.form['eventCity']  # City name as string

        # Find the city ID based on the city name
        city = Location.query.filter_by(City=event_city_name).first()

        if city is None:
            return "City not found"  # Handle cases where the city doesn't exist

        # Fetch events based on the parameters (this logic should retrieve events matching the search criteria)
        events = Event.query.filter(Event.EventDate == event_date, Event.LocationID == city.id).all()

        # Construct HTML to display event details in search results
        search_result_html = ""
        for event in events:
            search_result_html += f"<div>"
            search_result_html += f"<h3>{event.EventName}</h3>"
            search_result_html += f"<p>Description: {event.EventDescription}</p>"
            search_result_html += f"<p>Date: {event.EventDate}</p>"
            # Add more details as needed
            search_result_html += "</div>"

        return search_result_html

    except Exception as e:
        return f"Error: {str(e)}"





if __name__ == '__main__':
    app.run(debug=True)
