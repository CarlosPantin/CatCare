import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ImportantDates = ({ catId }) => {
  const [importantDates, setImportantDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
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
    } catch (error) {
      console.error("Error adding important date:", error);
      setError(
        "Error adding important date: " +
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
    <div>
      <Typography variant="h6" gutterBottom>
        Important Dates
      </Typography>

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

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddImportantDate}
        style={{ marginTop: "10px" }}
      >
        Add Important Date
      </Button>

      <Divider style={{ margin: "20px 0" }} />

      <List>
        {importantDates.map((date) => (
          <ListItem key={date._id}>
            <ListItemText
              primary={`${date.event} - ${new Date(
                date.date
              ).toLocaleDateString()}`}
              secondary={date.description || "No description"}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ImportantDates;
