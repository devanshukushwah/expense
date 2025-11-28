import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// define minimum year for selection
const minDate = 2024;

export default function MonthYearDialog({ monthYear, onSumit }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(monthYear.month);
  const [year, setYear] = useState(monthYear.year);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  const yearNow = date.getFullYear();

  const years = Array.from(
    { length: yearNow - minDate + 1 },
    (_, i) => minDate + i
  );

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    onSumit({ month, year });
    handleClose();
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} title="Select Month & Year">
        <CalendarMonthIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ display: "flex", gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m, i) => (
                <MenuItem key={m} value={i + 1}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
