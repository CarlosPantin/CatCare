import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DietAndFeeding = ({ catId }) => {
  const [feedingData, setFeedingData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    time: null,
    portion: "",
    foodType: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchFeedingData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
          : process.env.REACT_APP_API_BASE_URL;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/dietAndFeeding/${catId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFeedingData(response.data);
      } catch (error) {
        alert("Error fetching diet and feeding data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedingData();
  }, [catId]);

  const handleAddEntry = async () => {
    if (!newEntry.time || !newEntry.portion || !newEntry.foodType) {
      alert("Time, portion, and food type are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
        : process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/dietAndFeeding/${catId}`,
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFeedingData([...feedingData, response.data]);
      setNewEntry({ time: null, portion: "", foodType: "", notes: "" });
      setOpenModal(false);
    } catch (error) {
      alert("Error adding feeding entry.");
    }
  };

  const handleDeleteEntry = async (entryId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
        : process.env.REACT_APP_API_BASE_URL;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/dietAndFeeding/${catId}/${entryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFeedingData(feedingData.filter((entry) => entry._id !== entryId));
    } catch (error) {
      alert("Error deleting feeding entry.");
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
        backgroundColor: "#FFFBF2",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        minHeight: "300px",
        position: "relative",
        border: "1px solid #E0C9A6",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: "'Shadows Into Light', cursive",
          color: "#5A4A42",
          borderBottom: "2px dashed #E0C9A6",
          paddingBottom: "5px",
        }}
      >
        Diet & Feeding 🍽️
      </Typography>

      {feedingData.length === 0 ? (
        <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
          No feeding data available.
        </Typography>
      ) : (
        <List sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
          {feedingData.map((entry) => (
            <ListItem
              key={entry._id}
              divider
              sx={{
                backgroundColor: "transparent",
                marginBottom: "5px",
                padding: "8px 0",
                fontFamily: "'Shadows Into Light', cursive",
                fontSize: "18px",
                color: "#5A4A42",
                position: "relative",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E0C9A6",
                  opacity: 0.5,
                },
              }}
            >
              <Typography>
                <strong>{entry.time}</strong> - {entry.foodType} (
                {entry.portion})
              </Typography>
              <IconButton
                onClick={() => handleDeleteEntry(entry._id)}
                color="error"
                sx={{ marginLeft: "auto" }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenModal(true)}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          bgcolor: "#FF6F61",
          "&:hover": { bgcolor: "#E64A45" },
        }}
      >
        <Add />
      </Fab>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add Feeding Entry</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Time"
              value={newEntry.time}
              onChange={(newTime) =>
                setNewEntry({ ...newEntry, time: newTime })
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <TextField
            label="Portion (e.g., 1 cup)"
            variant="outlined"
            fullWidth
            value={newEntry.portion}
            onChange={(e) =>
              setNewEntry({ ...newEntry, portion: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Food Type (e.g., Dry, Wet)"
            variant="outlined"
            fullWidth
            value={newEntry.foodType}
            onChange={(e) =>
              setNewEntry({ ...newEntry, foodType: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Notes (optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={newEntry.notes}
            onChange={(e) =>
              setNewEntry({ ...newEntry, notes: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEntry} color="primary" variant="contained">
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DietAndFeeding;
