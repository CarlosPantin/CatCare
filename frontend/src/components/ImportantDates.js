import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const ImportantDates = ({ catId }) => {
  const [importantDates, setImportantDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImportantDates = async () => {
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
          `${API_BASE_URL}/api/importantdates/${catId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImportantDates(response.data);
      } catch (error) {
        setError(
          "Error fetching important dates: " +
            (error.response ? error.response.data : error.message)
        );
        console.error("Error fetching important dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImportantDates();
  }, [catId]);

  const handleAddImportantDate = async () => {
    const token = localStorage.getItem("token");

    if (!newDate || !newEvent) {
      alert("Please provide both date and event!");
      return;
    }

    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
        : process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/importantdates/${catId}`,
        {
          date: newDate,
          event: newEvent,
          description: newDescription,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImportantDates([...importantDates, response.data]);
      setNewDate("");
      setNewEvent("");
      setNewDescription("");
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding important date:", error);
      setError(
        "Error adding important date: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleDeleteImportantDate = async (dateId) => {
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
        `${API_BASE_URL}/api/importantdates/${catId}/${dateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setImportantDates(importantDates.filter((date) => date._id !== dateId));
    } catch (error) {
      console.error("Error deleting important date:", error);
      setError(
        "Error deleting important date: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  if (loading) {
    return <Typography>Loading important dates...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
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
        Important Dates 📅
      </Typography>

      <List>
        {importantDates.map((date) => (
          <ListItem key={date._id}>
            <ListItemText
              primary={`${date.event} - ${new Date(
                date.date
              ).toLocaleDateString()}`}
              secondary={date.description || "No description"}
            />
            <IconButton
              onClick={() => handleDeleteImportantDate(date._id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

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
        <DialogTitle>Add Important Date</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Event"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddImportantDate}
            color="primary"
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ImportantDates;
