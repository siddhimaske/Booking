const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Raw flight data for Indian flights - extended list
const flights = [
  { id: 1, flightNumber: 'AI101', source: 'Delhi', destination: 'Mumbai', date: '2024-07-01', time: '10:00', fare: 5000 },
  { id: 2, flightNumber: 'AI102', source: 'Mumbai', destination: 'Bangalore', date: '2024-07-01', time: '12:00', fare: 4500 },
  { id: 3, flightNumber: 'AI103', source: 'Chennai', destination: 'Delhi', date: '2024-07-02', time: '09:00', fare: 5200 },
  { id: 4, flightNumber: 'AI104', source: 'Kolkata', destination: 'Hyderabad', date: '2024-07-03', time: '14:00', fare: 4800 },
  { id: 5, flightNumber: 'AI105', source: 'Mumbai', destination: 'Chennai', date: '2024-07-04', time: '16:00', fare: 4700 },
  { id: 6, flightNumber: 'AI106', source: 'Hyderabad', destination: 'Delhi', date: '2024-07-05', time: '11:00', fare: 5100 },
  { id: 7, flightNumber: 'AI107', source: 'Bangalore', destination: 'Kolkata', date: '2024-07-06', time: '13:30', fare: 4600 },
  { id: 8, flightNumber: 'AI108', source: 'Chennai', destination: 'Mumbai', date: '2024-07-07', time: '15:00', fare: 4800 },
  { id: 9, flightNumber: 'AI109', source: 'Delhi', destination: 'Bangalore', date: '2024-07-08', time: '17:00', fare: 5300 },
  { id: 10, flightNumber: 'AI110', source: 'Kolkata', destination: 'Chennai', date: '2024-07-09', time: '19:00', fare: 4900 }
];

// In-memory bookings storage
const bookings = [];

// Endpoint to get all flights
app.get('/flights', (req, res) => {
  res.json(flights);
});

// Endpoint to book a flight
app.post('/book', (req, res) => {
  const { flightId, passengerName, passengerContact } = req.body;
  const flight = flights.find(f => f.id === flightId);
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }
  const bookingId = bookings.length + 1;
  const booking = {
    bookingId,
    flight,
    passengerName,
    passengerContact,
    bookingDate: new Date().toISOString()
  };
  bookings.push(booking);
  res.json({ message: 'Booking successful', booking });
});

app.listen(port, () => {
  console.log('Flight booking backend running at http://localhost:' + port);
});
