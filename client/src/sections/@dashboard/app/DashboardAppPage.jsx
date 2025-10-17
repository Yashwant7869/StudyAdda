import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography } from "@mui/material";
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary, AppSeatAvailability } from "./index";
import { useAuth } from "../../../hooks/useAuth";
import { apiUrl } from "../../../constants";
import { generateMockSeats, generateMockStatistics } from "../../../utils/mockSeatData";

// ----------------------------------------------------------------------

// Toggle this to use mock data (true) or real API (false)
const USE_MOCK_DATA = true;

export default function DashboardAppPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const [seatStatistics, setSeatStatistics] = useState(null);

  useEffect(() => {
    fetchSeatStatistics();
  }, []);

  const fetchSeatStatistics = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data - combine all floors
        const floor1Seats = generateMockSeats(1);
        const floor2Seats = generateMockSeats(2);
        const floor3Seats = generateMockSeats(3);
        const allSeats = [...floor1Seats, ...floor2Seats, ...floor3Seats];
        const stats = generateMockStatistics(allSeats);
        setSeatStatistics(stats);
        return;
      }

      // Use real API
      const response = await axios.get(`${apiUrl}/seat/statistics`, {
        withCredentials: true
      });
      if (response.data.success) {
        setSeatStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching seat statistics:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Library | Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{mb: 5}}>
          Hi {user.name.split(' ')[0]}, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          {/* Seat Availability Widget */}
          <Grid item xs={12} md={6} lg={4}>
            <AppSeatAvailability statistics={seatStatistics} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
