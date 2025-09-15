const flightsList = document.getElementById('flights-list');
const bookingSection = document.getElementById('booking-section');
const flightsSection = document.getElementById('flights-section');
const confirmationSection = document.getElementById('confirmation-section');
const bookingForm = document.getElementById('booking-form');
const flightIdInput = document.getElementById('flight-id');
const flightInfoSpan = document.getElementById('flight-info');
const passengerNameInput = document.getElementById('passenger-name');
const passengerContactInput = document.getElementById('passenger-contact');
const confirmationMessage = document.getElementById('confirmation-message');
const cancelBookingBtn = document.getElementById('cancel-booking');
const backToFlightsBtn = document.getElementById('back-to-flights');
const searchInput = document.getElementById('search-input');

const backendUrl = 'http://localhost:3000';
let allFlights = [];

async function fetchFlights() {
  try {
    const response = await fetch(backendUrl + '/flights');
    allFlights = await response.json();
    renderFlights(allFlights);
  } catch (error) {
    flightsList.innerHTML = '<p>Error loading flights. Please try again later.</p>';
  }
}

function renderFlights(flights) {
  flightsList.innerHTML = '';
  flights.forEach(function(flight) {
    var card = document.createElement('div');
    card.className = 'flight-card';
    card.innerHTML = '<div class="flight-info"><strong>' + flight.flightNumber + '</strong></div>' +
      '<div>From: ' + flight.source + '</div>' +
      '<div>To: ' + flight.destination + '</div>' +
      '<div>Date: ' + flight.date + '</div>' +
      '<div>Time: ' + flight.time + '</div>' +
      '<div>Fare: ₹' + flight.fare + '</div>';
    card.addEventListener('click', function() { openBookingForm(flight); });
    flightsList.appendChild(card);
  });
}

function openBookingForm(flight) {
  flightsSection.classList.add('hidden');
  bookingSection.classList.remove('hidden');
  confirmationSection.classList.add('hidden');

  flightIdInput.value = flight.id;
  flightInfoSpan.textContent = flight.flightNumber + ' - ' + flight.source + ' to ' + flight.destination + ' on ' + flight.date + ' at ' + flight.time;
  passengerNameInput.value = '';
  passengerContactInput.value = '';
}

bookingForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  var bookingData = {
    flightId: parseInt(flightIdInput.value),
    passengerName: passengerNameInput.value.trim(),
    passengerContact: passengerContactInput.value.trim()
  };

  try {
    var response = await fetch(backendUrl + '/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    var result = await response.json();
    if (response.ok) {
      showConfirmation(result.booking);
    } else {
      alert(result.error || 'Booking failed');
    }
  } catch (error) {
    alert('Error booking flight. Please try again.');
  }
});

function showConfirmation(booking) {
  flightsSection.classList.add('hidden');
  bookingSection.classList.add('hidden');
  confirmationSection.classList.remove('hidden');

  confirmationMessage.innerHTML = '<p>Booking successful!</p>' +
    '<p><strong>Booking ID:</strong> ' + booking.bookingId + '</p>' +
    '<p><strong>Passenger:</strong> ' + booking.passengerName + '</p>' +
    '<p><strong>Flight:</strong> ' + booking.flight.flightNumber + ' - ' + booking.flight.source + ' to ' + booking.flight.destination + '</p>' +
    '<p><strong>Date & Time:</strong> ' + booking.flight.date + ' at ' + booking.flight.time + '</p>' +
    '<p><strong>Fare:</strong> ₹' + booking.flight.fare + '</p>';
}

cancelBookingBtn.addEventListener('click', function() {
  bookingSection.classList.add('hidden');
  flightsSection.classList.remove('hidden');
});

backToFlightsBtn.addEventListener('click', function() {
  confirmationSection.classList.add('hidden');
  flightsSection.classList.remove('hidden');
});

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filteredFlights = allFlights.filter(flight =>
    flight.source.toLowerCase().includes(query) ||
    flight.destination.toLowerCase().includes(query)
  );
  renderFlights(filteredFlights);
});

fetchFlights();
