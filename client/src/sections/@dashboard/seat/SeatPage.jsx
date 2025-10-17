import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../../hooks/useAuth";
import Iconify from "../../../components/iconify";
import { apiUrl } from "../../../constants";
import SeatLayout from "./SeatLayout";
import FloorPlanView from "./FloorPlanView";
import { generateMockSeats, generateMockStatistics, generateMockCurrentBooking } from "../../../utils/mockSeatData";

// ----------------------------------------------------------------------

// Toggle this to use mock data (true) or real API (false)
const USE_MOCK_DATA = true;

const SeatPage = () => {
  const { user } = useAuth();
  
  // State management
  const [seats, setSeats] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'floorplan'
  
  // Filters
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSection, setSelectedSection] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Booking form
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000)); // +1 hour
  const [isAdvanceBooking, setIsAdvanceBooking] = useState(false);
  const [notes, setNotes] = useState('');

  // Auto-refresh interval (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSeats();
      fetchStatistics();
      fetchCurrentBooking();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedFloor, selectedSection, statusFilter]);

  useEffect(() => {
    fetchSeats();
    fetchStatistics();
    fetchCurrentBooking();
  }, [selectedFloor, selectedSection, statusFilter]);

  const fetchSeats = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data
        let mockSeats = generateMockSeats(selectedFloor);
        
        // Apply filters
        if (selectedSection !== 'all') {
          mockSeats = mockSeats.filter(seat => seat.section === selectedSection);
        }
        if (statusFilter !== 'all') {
          mockSeats = mockSeats.filter(seat => seat.status === statusFilter);
        }
        
        setSeats(mockSeats);
        setIsLoading(false);
        return;
      }

      // Use real API
      const params = {};
      if (selectedFloor) params.floor = selectedFloor;
      if (selectedSection !== 'all') params.section = selectedSection;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await axios.get(`${apiUrl}/seat`, {
        params,
        withCredentials: true
      });

      if (response.data.success) {
        setSeats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching seats:', error);
      toast.error('Failed to fetch seats');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data
        const allSeats = generateMockSeats(selectedFloor);
        const stats = generateMockStatistics(allSeats);
        setStatistics(stats);
        return;
      }

      // Use real API
      const response = await axios.get(`${apiUrl}/seat/statistics`, {
        withCredentials: true
      });

      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchCurrentBooking = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data - randomly assign a current booking for demo
        const allSeats = generateMockSeats(selectedFloor);
        const mockBooking = generateMockCurrentBooking(user?._id, allSeats);
        setCurrentBooking(mockBooking);
        return;
      }

      // Use real API
      const response = await axios.get(`${apiUrl}/seat/my-booking`, {
        withCredentials: true
      });

      if (response.data.success) {
        setCurrentBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching current booking:', error);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'available' && !currentBooking) {
      setSelectedSeat(seat);
      setIsBookingDialogOpen(true);
    } else if (seat.bookedBy?._id === user._id) {
      setSelectedSeat(seat);
    }
  };

  const handleBookSeat = async () => {
    try {
      const bookingData = {
        bookingDate: isAdvanceBooking ? bookingDate : new Date(),
        startTime: isAdvanceBooking ? startTime : new Date(),
        endTime,
        isAdvanceBooking,
        notes
      };

      const response = await axios.post(
        `${apiUrl}/seat/${selectedSeat._id}/book`,
        bookingData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Seat booked successfully!');
        setIsBookingDialogOpen(false);
        setSelectedSeat(null);
        resetBookingForm();
        fetchSeats();
        fetchStatistics();
        fetchCurrentBooking();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book seat');
    }
  };

  const handleReleaseSeat = async (seatId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/seat/${seatId}/release`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Seat released successfully!');
        setCurrentBooking(null);
        fetchSeats();
        fetchStatistics();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to release seat');
    }
  };

  const resetBookingForm = () => {
    setBookingDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date(Date.now() + 3600000));
    setIsAdvanceBooking(false);
    setNotes('');
  };

  const getSeatsBySection = (section) => {
    return seats.filter(seat => 
      seat.section === section && 
      (selectedSection === 'all' || seat.section === selectedSection)
    );
  };

  const sections = ['A', 'B', 'C', 'D'];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Seat Booking | Library</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Seat Booking System</Typography>
          <Stack direction="row" spacing={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => {
                if (newMode !== null) setViewMode(newMode);
              }}
              size="small"
            >
              <ToggleButton value="grid">
                <Iconify icon="mdi:view-grid" width={20} sx={{ mr: 1 }} />
                Grid View
              </ToggleButton>
              <ToggleButton value="floorplan">
                <Iconify icon="mdi:floor-plan" width={20} sx={{ mr: 1 }} />
                Floor Plan
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:refresh-fill" />}
              onClick={() => {
                fetchSeats();
                fetchStatistics();
                fetchCurrentBooking();
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {/* Statistics Cards */}
        {statistics && (
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Seats
                  </Typography>
                  <Typography variant="h4">{statistics.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Available
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {statistics.available}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Occupied
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {statistics.occupied}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Booked
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {statistics.booked}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Occupancy Rate
                  </Typography>
                  <Typography variant="h4">
                    {statistics.occupancyRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Current Booking Alert */}
        {currentBooking && (
          <Card sx={{ mb: 4, backgroundColor: 'warning.lighter', border: '2px solid', borderColor: 'warning.main' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Your Current Booking
                  </Typography>
                  <Typography variant="body1">
                    Seat: <strong>{currentBooking.seatNumber}</strong> - Floor {currentBooking.floor}, Section {currentBooking.section}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status: {currentBooking.isAdvanceBooking ? 'Advance Booking' : 'Currently Occupied'}
                  </Typography>
                  {currentBooking.bookingEndTime && (
                    <Typography variant="body2" color="textSecondary">
                      Until: {new Date(currentBooking.bookingEndTime).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Iconify icon="eva:close-circle-fill" />}
                  onClick={() => handleReleaseSeat(currentBooking._id)}
                >
                  Release Seat
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Floor</InputLabel>
              <Select
                value={selectedFloor}
                label="Floor"
                onChange={(e) => setSelectedFloor(e.target.value)}
              >
                <MenuItem value={1}>Floor 1</MenuItem>
                <MenuItem value={2}>Floor 2</MenuItem>
                <MenuItem value={3}>Floor 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Section</InputLabel>
              <Select
                value={selectedSection}
                label="Section"
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <MenuItem value="all">All Sections</MenuItem>
                <MenuItem value="A">Section A</MenuItem>
                <MenuItem value="B">Section B</MenuItem>
                <MenuItem value="C">Section C</MenuItem>
                <MenuItem value="D">Section D</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="booked">Booked</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* View Toggle - Floor Plan or Grid */}
        {viewMode === 'floorplan' ? (
          <FloorPlanView floor={selectedFloor} statistics={statistics} />
        ) : (
          <SeatLayout
            seats={seats}
            onSeatClick={handleSeatClick}
            selectedSeat={selectedSeat}
            currentUserBooking={currentBooking}
          />
        )}

        {/* Booking Dialog */}
        <Dialog 
          open={isBookingDialogOpen} 
          onClose={() => {
            setIsBookingDialogOpen(false);
            setSelectedSeat(null);
            resetBookingForm();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Book Seat {selectedSeat?.seatNumber}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Floor {selectedSeat?.floor}, Section {selectedSeat?.section}
              </Typography>

              <FormControl>
                <Typography variant="subtitle2" gutterBottom>
                  Booking Type
                </Typography>
                <ToggleButtonGroup
                  value={isAdvanceBooking}
                  exclusive
                  onChange={(e, value) => {
                    if (value !== null) setIsAdvanceBooking(value);
                  }}
                  fullWidth
                >
                  <ToggleButton value={false}>
                    Immediate
                  </ToggleButton>
                  <ToggleButton value>
                    Advance Booking
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>

              {isAdvanceBooking && (
                <>
                  <TextField
                    label="Booking Date & Time"
                    type="datetime-local"
                    value={bookingDate ? new Date(bookingDate.getTime() - bookingDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setBookingDate(new Date(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{
                      min: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                    }}
                  />
                  <TextField
                    label="Start Time"
                    type="datetime-local"
                    value={startTime ? new Date(startTime.getTime() - startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setStartTime(new Date(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{
                      min: bookingDate ? new Date(bookingDate.getTime() - bookingDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                    }}
                  />
                </>
              )}

              <TextField
                label="End Time"
                type="datetime-local"
                value={endTime ? new Date(endTime.getTime() - endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                onChange={(newValue) => setEndTime(new Date(newValue.target.value))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                inputProps={{
                  min: isAdvanceBooking && startTime ? new Date(startTime.getTime() - startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                }}
              />

              <TextField
                label="Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setIsBookingDialogOpen(false);
                setSelectedSeat(null);
                resetBookingForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBookSeat} 
              variant="contained"
              disabled={currentBooking !== null}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default SeatPage;
