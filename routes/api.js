const express = require('express');
const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'JC Cabs Ooty Node.js API',
    timestamp: new Date().toISOString()
  });
});

// Get Available Taxi Routes & Rates
router.get('/routes', (req, res) => {
  const routes = [
    { id: 1, name: '1-Day Ooty Local Sightseeing', baseRate: 2200, km: 80, duration: '8 Hours' },
    { id: 2, name: 'Pykara Lake, Waterfalls & Mudumalai Safari', baseRate: 2600, km: 100, duration: '9 Hours' },
    { id: 3, name: 'Coonoor Heritage Sightseeing', baseRate: 2400, km: 70, duration: '8 Hours' },
    { id: 4, name: 'Avalanche Lake & Emerald Eco Tour', baseRate: 2800, km: 60, duration: '7 Hours' },
    { id: 5, name: 'Coimbatore Airport (CJB) to Ooty Pickup/Drop', baseRate: 3500, km: 90, duration: '3.5 Hours' },
    { id: 6, name: 'Coimbatore Railway Station to Ooty Taxi', baseRate: 3200, km: 88, duration: '3.5 Hours' },
    { id: 7, name: 'Mettupalayam Railway Station to Ooty Taxi', baseRate: 2200, km: 52, duration: '2 Hours' },
    { id: 8, name: 'Mysore City/Airport to Ooty Taxi', baseRate: 4500, km: 125, duration: '4 Hours' },
    { id: 9, name: 'Bangalore City/Airport to Ooty Outstation Taxi', baseRate: 7500, km: 270, duration: '7 Hours' }
  ];
  res.json({ success: true, routes });
});

// Fare Calculator Endpoint
router.post('/calculate-fare', (req, res) => {
  const { baseRate = 2200, cabMultiplier = 1.0, days = 1 } = req.body;
  
  const total = Math.round(Number(baseRate) * Number(cabMultiplier) * Number(days));
  
  res.json({
    success: true,
    totalFare: total,
    currency: 'INR',
    formattedFare: `₹${total.toLocaleString('en-IN')}`,
    breakdown: {
      baseRate: Number(baseRate),
      cabMultiplier: Number(cabMultiplier),
      days: Number(days)
    }
  });
});

// Cab Booking Submission Endpoint
router.post('/book', (req, res) => {
  const { packageName, name, phone, date, cab, pickup, notes } = req.body;

  if (!name || !phone || !date || !pickup) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (name, phone, date, pickup).'
    });
  }

  // Generate Booking Reference Number
  const bookingId = 'JCC-' + Math.floor(100000 + Math.random() * 900000);
  
  const bookingDetails = {
    bookingId,
    packageName: packageName || 'General Cab Booking',
    customerName: name,
    customerPhone: phone,
    travelDate: date,
    vehicleChosen: cab || 'Sedan Taxi',
    pickupAddress: pickup,
    notes: notes || '',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  console.log('📌 NEW CAB BOOKING RECEIVED:', bookingDetails);

  res.json({
    success: true,
    message: 'Booking request received successfully! Our team will contact you shortly.',
    booking: bookingDetails
  });
});

module.exports = router;
