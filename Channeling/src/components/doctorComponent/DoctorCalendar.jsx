import React, { useState, useEffect } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, CircularProgress, Skeleton } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

// Custom skeleton for loading
const DayCalendarSkeleton = () => (
  <Box sx={{ display: 'flex', width: 60, justifyContent: 'center'}}>
    <CircularProgress />
  </Box>
);

// Custom ServerDay component (for rendering custom day content)
const ServerDay = ({ day, highlightedDays }) => {
  const isHighlighted = highlightedDays.includes(day.toLocaleDateString());
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: isHighlighted ? 'lightblue' : 'transparent',
        color: isHighlighted ? 'white' : 'black',
      }}
    >
      {day.getDate()}
    </Box>
  );
};

const DoctorCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching data (e.g., highlighting special days)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setHighlightedDays([
        new Date(2024, 11, 10).toLocaleDateString(),
        new Date(2024, 11, 12).toLocaleDateString(),
      ]);
      setIsLoading(false);
    }, 200); 
  }, []);

  const handleMonthChange = (newMonth) => {
    console.log('Month changed to:', newMonth);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', }}>
        <DateCalendar
          defaultValue={selectedDate}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DoctorCalendar;
