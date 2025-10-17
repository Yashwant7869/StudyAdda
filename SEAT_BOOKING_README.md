# Seat Booking System

## Overview
The Library Management System now includes a comprehensive real-time seat booking system that allows users to view available seats, make advance bookings, and manage their seat reservations.

## Features

### 1. Real-Time Seat Availability
- **Live Updates**: Seat status updates automatically every 30 seconds
- **Visual Grid**: Interactive seat layout showing all seats organized by floor and section
- **Color-Coded Status**:
  - 🟢 Green: Available seats
  - 🟡 Yellow: Booked (advance booking)
  - 🔴 Red: Occupied (currently in use)
  - ⚫ Grey: Under maintenance

### 2. Seat Booking Options
- **Immediate Booking**: Book and occupy a seat right away
- **Advance Booking**: Reserve a seat for a future date and time
- **Booking Duration**: Set start and end times for your booking
- **Notes**: Add optional notes to your booking

### 3. User Features
- View all available seats in real-time
- Filter seats by floor, section, and status
- Book available seats with date/time selection
- View current active booking
- Release booked seats
- One active booking per user at a time

### 4. Dashboard Widget
- Quick overview of seat availability
- Total, available, booked, and occupied seat counts
- Today's booking statistics
- Occupancy rate percentage
- Quick access to seat booking page

## Database Schema

### Seat Model
```javascript
{
  seatNumber: String,        // e.g., "1A01" (Floor 1, Section A, Seat 01)
  floor: Number,             // 1, 2, or 3
  section: String,           // A, B, C, or D
  status: String,            // available, booked, occupied, maintenance
  bookedBy: ObjectId,        // Reference to User
  bookingDate: Date,         // Date of booking
  bookingStartTime: Date,    // Booking start time
  bookingEndTime: Date,      // Booking end time
  isAdvanceBooking: Boolean, // True for future bookings
  notes: String,             // Optional booking notes
  timestamps: true           // createdAt, updatedAt
}
```

## API Endpoints

### Public Endpoints
- `GET /api/seat` - Get all seats with optional filters
- `GET /api/seat/statistics` - Get seat statistics

### Protected Endpoints (Requires Authentication)
- `GET /api/seat/my-booking` - Get current active booking
- `GET /api/seat/my-bookings` - Get booking history
- `GET /api/seat/:id` - Get specific seat details
- `POST /api/seat/:seatId/book` - Book a seat
- `POST /api/seat/:seatId/release` - Release a booked seat

### Admin Endpoints
- `POST /api/seat/initialize` - Initialize seats in database
- `POST /api/seat` - Create a new seat
- `PATCH /api/seat/:seatId/status` - Update seat status
- `DELETE /api/seat/:id` - Delete a seat

## Setup Instructions

### 1. Initialize Seats in Database
Run the seed script to create seats:
```bash
cd server
node seedSeats.js
```

This will create 180 seats:
- 3 floors
- 4 sections per floor (A, B, C, D)
- 15 seats per section

### 2. Alternative: Use API Endpoint
You can also initialize seats via the API (Admin only):
```bash
POST http://localhost:8080/api/seat/initialize
```

### 3. Install Required Dependencies
The seat booking system uses Material-UI date pickers. If not already installed:
```bash
cd client
npm install @mui/x-date-pickers date-fns
```

## Usage Guide

### For Users

#### Booking a Seat
1. Navigate to "Seat Booking" from the sidebar
2. Select floor and section filters
3. Click on any green (available) seat
4. Choose booking type:
   - **Immediate**: Start using the seat now
   - **Advance Booking**: Reserve for a future date/time
5. Set end time and optional notes
6. Click "Confirm Booking"

#### Releasing a Seat
1. Your active booking is shown at the top of the seat booking page
2. Click "Release Seat" button
3. Seat becomes available for others immediately

### For Admins

#### Managing Seats
Admins have additional capabilities:
- Create new seats
- Update seat status (e.g., set to maintenance)
- Delete seats
- Force release any user's booking
- View all bookings across users

## Features in Detail

### Real-Time Updates
- Automatic refresh every 30 seconds
- Manual refresh button available
- Prevents booking conflicts with real-time status checks

### Booking Validation
- Users can only have one active booking at a time
- Cannot book already occupied or booked seats
- Advance bookings prevent conflicts
- Time validation ensures end time is after start time

### Filter System
- **Floor Filter**: View seats on specific floors (1, 2, or 3)
- **Section Filter**: Filter by section (A, B, C, D, or all)
- **Status Filter**: Show only specific status (available, booked, occupied, maintenance)

### Visual Indicators
- Color-coded seat buttons for easy status identification
- Tooltips show additional information on hover
- Legend display for status understanding
- Responsive grid layout adapts to screen size

## Technical Implementation

### Backend
- **Model**: MongoDB schema with Mongoose
- **Controller**: Comprehensive CRUD operations
- **Routes**: RESTful API endpoints
- **Authentication**: Passport.js integration
- **Validation**: Input validation and business logic checks

### Frontend
- **React**: Component-based architecture
- **Material-UI**: Modern UI components
- **Axios**: HTTP client for API calls
- **Real-time**: Auto-refresh mechanism
- **State Management**: React hooks (useState, useEffect)

### Security
- Authentication required for booking operations
- User can only release their own bookings (except admins)
- Input validation on both client and server
- Session-based authentication with cookies

## Future Enhancements

Potential improvements:
1. **WebSocket Integration**: Real-time updates via Socket.io
2. **Notifications**: Email/push notifications for booking confirmations
3. **Recurring Bookings**: Allow users to book same seat regularly
4. **Seat Preferences**: Save favorite seats or sections
5. **Booking Queue**: Wait list for popular seats
6. **Analytics Dashboard**: Usage patterns and statistics
7. **QR Code Check-in**: Verify seat occupancy via QR codes
8. **Mobile App**: Native mobile application
9. **Calendar View**: Visual calendar for advance bookings
10. **Seat Maps**: Interactive floor plans with seat locations

## Troubleshooting

### Seats Not Showing
- Ensure seats are initialized in database
- Check network connection and API endpoint
- Verify authentication status

### Cannot Book Seat
- Check if you already have an active booking
- Verify seat is actually available
- Ensure valid time selections for advance booking

### Auto-refresh Not Working
- Check browser console for errors
- Verify API endpoints are accessible
- Check if component is properly mounted

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify backend server is running
3. Ensure database connection is active
4. Check API endpoint responses in Network tab
