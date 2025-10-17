import PropTypes from 'prop-types';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';

const FloorPlanContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: theme.spacing(2),
  minHeight: 600,
}));

const SectionBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: theme.customShadows.card,
}));

const EntranceBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FacilityMarker = styled(Box)(({ theme, type }) => {
  const colors = {
    restroom: theme.palette.info.main,
    water: theme.palette.primary.main,
    exit: theme.palette.error.main,
  };

  return {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: colors[type] || theme.palette.grey[400],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: theme.shadows[4],
  };
});

export default function FloorPlanView({ floor, statistics }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Floor {floor} - Layout Plan
        </Typography>

        <FloorPlanContainer>
          {/* Main Entrance */}
          <EntranceBox sx={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
            <Iconify icon="mdi:door-open" width={24} />
            <Typography variant="body2">Main Entrance</Typography>
          </EntranceBox>

          {/* Section A - Top Left */}
          <SectionBox sx={{ top: 60, left: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section A
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quiet Study Zone
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:volume-off" width={20} color="success.main" />
                <Iconify icon="mdi:desk-lamp" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Section B - Top Right */}
          <SectionBox sx={{ top: 60, right: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section B
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Group Study Area
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:account-group" width={20} color="success.main" />
                <Iconify icon="mdi:desk" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Section C - Bottom Left */}
          <SectionBox sx={{ bottom: 60, left: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Computer Workstations
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:monitor" width={20} color="success.main" />
                <Iconify icon="mdi:power-plug" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Section D - Bottom Right */}
          <SectionBox sx={{ bottom: 60, right: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section D
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reading Lounge
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:book-open-page-variant" width={20} color="success.main" />
                <Iconify icon="mdi:lamp" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Facilities */}
          <FacilityMarker type="restroom" sx={{ top: '50%', left: 0, transform: 'translateY(-50%)' }}>
            <Iconify icon="mdi:human-male-female" width={24} />
          </FacilityMarker>

          <FacilityMarker type="water" sx={{ top: '50%', right: 0, transform: 'translateY(-50%)' }}>
            <Iconify icon="mdi:water" width={24} />
          </FacilityMarker>

          <FacilityMarker type="exit" sx={{ bottom: 0, left: '25%' }}>
            <Iconify icon="mdi:exit-run" width={24} />
          </FacilityMarker>

          <FacilityMarker type="exit" sx={{ bottom: 0, right: '25%' }}>
            <Iconify icon="mdi:exit-run" width={24} />
          </FacilityMarker>

          {/* Central Info Area */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 4,
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <Iconify icon="mdi:information" width={40} color="white" />
                  <Typography variant="caption" color="white" fontWeight="bold">
                    Help Desk
                  </Typography>
                </Stack>
              </Box>
              {statistics && (
                <Card sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {statistics.available}/{statistics.total}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Available Seats
                  </Typography>
                </Card>
              )}
            </Stack>
          </Box>
        </FloorPlanContainer>

        {/* Legend */}
        <Box mt={3} display="flex" justifyContent="center" gap={3} flexWrap="wrap">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'info.main',
              }}
            />
            <Typography variant="body2">Restroom</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'primary.main',
              }}
            />
            <Typography variant="body2">Water Fountain</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'error.main',
              }}
            />
            <Typography variant="body2">Emergency Exit</Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

FloorPlanView.propTypes = {
  floor: PropTypes.number.isRequired,
  statistics: PropTypes.object,
};
