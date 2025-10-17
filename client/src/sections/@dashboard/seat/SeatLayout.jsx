import PropTypes from 'prop-types';
import { Box, Card, CardContent, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';

// Styled Components
const SeatCard = styled(Paper)(({ theme, status, isSelected }) => {
  const statusColors = {
    available: {
      bg: theme.palette.success.lighter,
      border: theme.palette.success.main,
      color: theme.palette.success.dark,
      icon: 'mdi:seat',
    },
    booked: {
      bg: theme.palette.warning.lighter,
      border: theme.palette.warning.main,
      color: theme.palette.warning.dark,
      icon: 'mdi:seat-outline',
    },
    occupied: {
      bg: theme.palette.error.lighter,
      border: theme.palette.error.main,
      color: theme.palette.error.dark,
      icon: 'mdi:seat',
    },
    maintenance: {
      bg: theme.palette.grey[200],
      border: theme.palette.grey[400],
      color: theme.palette.grey[600],
      icon: 'mdi:tools',
    },
  };

  const colorScheme = statusColors[status] || statusColors.available;

  return {
    minWidth: 70,
    minHeight: 85,
    padding: theme.spacing(1),
    cursor: status === 'available' ? 'pointer' : 'not-allowed',
    backgroundColor: isSelected ? theme.palette.primary.lighter : colorScheme.bg,
    border: `2px solid ${isSelected ? theme.palette.primary.main : colorScheme.border}`,
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: status === 'available' ? 'translateY(-4px)' : 'none',
      boxShadow: status === 'available' ? theme.customShadows.primary : 'none',
    },
  };
});

const SectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const RowLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 40,
  height: 85,
  backgroundColor: theme.palette.grey[300],
  borderRadius: theme.spacing(1),
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}));

const ColumnLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 30,
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

export default function SeatLayout({ seats, onSeatClick, selectedSeat, currentUserBooking }) {
  // Group seats by section
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.section]) {
      acc[seat.section] = [];
    }
    acc[seat.section].push(seat);
    return acc;
  }, {});

  // Sort seats within each section by seat number
  Object.keys(groupedSeats).forEach((section) => {
    groupedSeats[section].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
  });

  const sections = ['A', 'B', 'C', 'D'];
  const seatsPerRow = 5;

  const getSeatIcon = (status) => {
    const icons = {
      available: 'mdi:seat',
      booked: 'mdi:seat-outline',
      occupied: 'mdi:seat',
      maintenance: 'mdi:tools',
    };
    return icons[status] || 'mdi:seat';
  };

  const renderSeatGrid = (sectionSeats, sectionName) => {
    const rows = [];
    const seatCount = sectionSeats.length;
    const rowCount = Math.ceil(seatCount / seatsPerRow);

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const rowSeats = sectionSeats.slice(
        rowIndex * seatsPerRow,
        (rowIndex + 1) * seatsPerRow
      );
      rows.push({ rowNumber: rowIndex + 1, seats: rowSeats });
    }

    return (
      <Box>
        {/* Column labels */}
        <Box display="flex" gap={1} mb={1} ml={6}>
          {Array.from({ length: seatsPerRow }).map((_, index) => (
            <ColumnLabel key={index} sx={{ minWidth: 70 }}>
              {index + 1}
            </ColumnLabel>
          ))}
        </Box>

        {/* Seat rows */}
        {rows.map((row) => (
          <Box key={row.rowNumber} display="flex" alignItems="center" gap={1} mb={1}>
            <RowLabel>R{row.rowNumber}</RowLabel>
            {row.seats.map((seat) => {
              const isSelected = selectedSeat?._id === seat._id;
              const isUserSeat = currentUserBooking?._id === seat._id;

              return (
                <SeatCard
                  key={seat._id}
                  status={seat.status}
                  isSelected={isSelected}
                  onClick={() => seat.status === 'available' && onSeatClick(seat)}
                  elevation={isSelected ? 8 : 2}
                >
                  <Iconify
                    icon={getSeatIcon(seat.status)}
                    width={32}
                    color={isUserSeat ? 'primary.main' : 'inherit'}
                  />
                  <Typography variant="caption" fontWeight="bold" mt={0.5}>
                    {seat.seatNumber}
                  </Typography>
                  {isUserSeat && (
                    <Chip
                      label="You"
                      size="small"
                      color="primary"
                      sx={{ height: 16, fontSize: '0.625rem', mt: 0.5 }}
                    />
                  )}
                </SeatCard>
              );
            })}
            {/* Fill empty seats if row is not complete */}
            {row.seats.length < seatsPerRow &&
              Array.from({ length: seatsPerRow - row.seats.length }).map((_, index) => (
                <Box key={`empty-${index}`} sx={{ minWidth: 70, minHeight: 85 }} />
              ))}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      {/* Library Entrance/Exit indicators */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Iconify icon="mdi:door-open" width={32} color="white" />
            <Typography variant="h6" color="white" fontWeight="bold">
              Library Entrance
            </Typography>
            <Iconify icon="mdi:door-open" width={32} color="white" />
          </Stack>
        </CardContent>
      </Card>

      {/* Section Layout */}
      <Grid container spacing={3}>
        {sections.map((section) => {
          const sectionSeats = groupedSeats[section] || [];
          if (sectionSeats.length === 0) return null;

          const availableCount = sectionSeats.filter((s) => s.status === 'available').length;
          const occupiedCount = sectionSeats.filter((s) => s.status === 'occupied').length;
          const bookedCount = sectionSeats.filter((s) => s.status === 'booked').length;

          return (
            <Grid item xs={12} md={6} key={section}>
              <SectionContainer>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Section {section}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`${availableCount} Available`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    <Chip
                      label={`${occupiedCount + bookedCount} Occupied`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                {renderSeatGrid(sectionSeats, section)}

                {/* Section Amenities */}
                <Box mt={2} display="flex" gap={2} justifyContent="center">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify icon="mdi:desk-lamp" width={20} color="text.secondary" />
                    <Typography variant="caption" color="text.secondary">
                      Desk Lamp
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify icon="mdi:power-plug" width={20} color="text.secondary" />
                    <Typography variant="caption" color="text.secondary">
                      Power Outlet
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify icon="mdi:wifi" width={20} color="text.secondary" />
                    <Typography variant="caption" color="text.secondary">
                      WiFi
                    </Typography>
                  </Stack>
                </Box>
              </SectionContainer>
            </Grid>
          );
        })}
      </Grid>

      {/* Exit */}
      <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Iconify icon="mdi:exit-run" width={32} color="white" />
            <Typography variant="h6" color="white" fontWeight="bold">
              Emergency Exit
            </Typography>
            <Iconify icon="mdi:exit-run" width={32} color="white" />
          </Stack>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card sx={{ mt: 3, bgcolor: 'background.neutral' }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight="bold" mb={2}>
            Seat Status Legend
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: 'success.lighter',
                    border: '2px solid',
                    borderColor: 'success.main',
                  }}
                />
                <Typography variant="body2">Available</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: 'warning.lighter',
                    border: '2px solid',
                    borderColor: 'warning.main',
                  }}
                />
                <Typography variant="body2">Booked</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: 'error.lighter',
                    border: '2px solid',
                    borderColor: 'error.main',
                  }}
                />
                <Typography variant="body2">Occupied</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                    border: '2px solid',
                    borderColor: 'grey.400',
                  }}
                />
                <Typography variant="body2">Maintenance</Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

SeatLayout.propTypes = {
  seats: PropTypes.array.isRequired,
  onSeatClick: PropTypes.func.isRequired,
  selectedSeat: PropTypes.object,
  currentUserBooking: PropTypes.object,
};
