# Seat Booking System - Quick Start Guide

## What's Been Added

A complete real-time seat booking and management system has been integrated into your Library Management application.

## Files Created/Modified

### Backend (Server)
**New Files:**
- `server/models/seat.js` - Seat database model
- `server/controllers/seatController.js` - Seat business logic & API handlers
- `server/routes/seatRouter.js` - API route definitions
- `server/seedSeats.js` - Script to initialize seats in database

**Modified Files:**
- `server/index.js` - Added seat router import and route registration

### Frontend (Client)
**New Files:**
- `client/src/sections/@dashboard/seat/SeatPage.jsx` - Main seat booking page
- `client/src/sections/@dashboard/app/AppSeatAvailability.js` - Dashboard widget

**Modified Files:**
- `client/src/routes.js` - Added seat page routes
- `client/src/layouts/dashboard/nav/config.js` - Added seat booking to navigation
- `client/src/sections/@dashboard/app/DashboardAppPage.jsx` - Added seat widget
- `client/src/sections/@dashboard/app/index.js` - Exported seat widget

### Documentation
- `SEAT_BOOKING_README.md` - Complete feature documentation

## Setup Steps

### 1. Install Dependencies (Already Done)
```bash
cd client
npm install @mui/x-date-pickers
```

### 2. Initialize Seats in Database
```bash
cd server
node seedSeats.js
```

This creates 180 seats:
- 3 Floors
- 4 Sections per floor (A, B, C, D)
- 15 Seats per section

### 3. Restart Servers
Make sure both backend and frontend servers are running:

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm start
```

## Features Overview

### 1. Real-Time Seat Grid
- Visual layout of all seats
- Color-coded status (Available, Booked, Occupied, Maintenance)
- Auto-refresh every 30 seconds
- Filter by floor, section, and status

### 2. Booking System
- **Immediate Booking**: Book and use seat right away
- **Advance Booking**: Reserve for future date/time
- Set start and end times
- Add optional notes

### 3. User Management
- One active booking per user
- View current booking
- Release seat anytime
- Booking history

### 4. Dashboard Integration
- Seat availability widget on dashboard
- Real-time statistics:
  - Total seats
  - Available seats
  - Occupied/Booked counts
  - Today's bookings
  - Occupancy rate

### 5. Admin Features
- Create/delete seats
- Update seat status
- Force release any booking
- View all bookings

## Navigation

Access the seat booking system:
1. **Sidebar Menu**: Click "Seat Booking" (🪑 icon)
2. **Dashboard Widget**: Click "View All" button on Seat Availability card

## API Endpoints

### For Users
- `GET /api/seat` - View all seats
- `GET /api/seat/statistics` - Get statistics
- `POST /api/seat/:seatId/book` - Book a seat
- `POST /api/seat/:seatId/release` - Release booking
- `GET /api/seat/my-booking` - View active booking

### For Admins
- `POST /api/seat/initialize` - Initialize seats
- `POST /api/seat` - Create new seat
- `PATCH /api/seat/:seatId/status` - Update status
- `DELETE /api/seat/:id` - Delete seat

## Testing the Feature

1. **Initialize Seats**: Run `node seedSeats.js` in server directory
2. **Login**: Login to your application
3. **View Dashboard**: Check the new Seat Availability widget
4. **Navigate to Seats**: Click "Seat Booking" in sidebar
5. **Book a Seat**: Click on a green (available) seat
6. **Test Filters**: Try floor, section, and status filters
7. **Release Seat**: Click "Release Seat" button

## Seat Numbering System

Seats follow this pattern: `{Floor}{Section}{Number}`

Examples:
- `1A01` - Floor 1, Section A, Seat 01
- `2C15` - Floor 2, Section C, Seat 15
- `3D08` - Floor 3, Section D, Seat 08

## Status Colors

- 🟢 **Green** - Available for booking
- 🟡 **Yellow** - Booked (advance booking)
- 🔴 **Red** - Occupied (in use)
- ⚫ **Grey** - Under maintenance

## Troubleshooting

### Seats not showing up?
- Run the seed script: `node seedSeats.js`
- Check database connection
- Verify backend is running on correct port

### Can't book a seat?
- You may already have an active booking
- Seat might have just been booked by another user
- Check if you're logged in

### Widget not showing statistics?
- Check browser console for errors
- Verify API endpoint: `http://localhost:8080/api/seat/statistics`
- Ensure you're authenticated

## Next Steps & Future Enhancements

Consider adding:
- WebSocket for real-time updates (Socket.io)
- Email notifications for bookings
- QR code check-in system
- Recurring bookings
- Seat preference saving
- Mobile app
- Calendar view for advance bookings
- Booking analytics dashboard

## Support

If you encounter any issues:
1. Check browser console (F12)
2. Check server logs
3. Verify database connection
4. Review API responses in Network tab
5. Refer to `SEAT_BOOKING_README.md` for detailed documentation

---

**Ready to use!** The seat booking system is now fully integrated and ready for testing. 🎉
