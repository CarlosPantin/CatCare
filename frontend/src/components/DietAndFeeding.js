import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DietAndFeeding = ({ catId }) => {
  const [feedingData, setFeedingData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    time: "",
    portion: "",
    foodType: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

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
      setNewEntry({ time: "", portion: "", foodType: "", notes: "" });
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
    <Card sx={{ marginTop: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Diet & Feeding
        </Typography>

        {feedingData.length === 0 ? (
          <Typography>No feeding data available.</Typography>
        ) : (
          <List>
            {feedingData.map((entry) => (
              <ListItem
                key={entry._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f7f7f7",
                  borderRadius: "5px",
                  marginBottom: "8px",
                  padding: "10px",
                }}
              >
                <Typography>
                  <strong>{entry.time}</strong> - {entry.foodType} (
                  {entry.portion})
                </Typography>
                <IconButton
                  onClick={() => handleDeleteEntry(entry._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}

        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          Add Feeding Entry
        </Typography>
        <TextField
          label="Time (e.g., 8:00 AM)"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ marginBottom: 1 }}
          value={newEntry.time}
          onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
        />
        <TextField
          label="Portion (e.g., 1 cup)"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ marginBottom: 1 }}
          value={newEntry.portion}
          onChange={(e) =>
            setNewEntry({ ...newEntry, portion: e.target.value })
          }
        />
        <TextField
          label="Food Type (e.g., Dry, Wet)"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ marginBottom: 1 }}
          value={newEntry.foodType}
          onChange={(e) =>
            setNewEntry({ ...newEntry, foodType: e.target.value })
          }
        />
        <TextField
          label="Notes (optional)"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={2}
          sx={{ marginBottom: 1 }}
          value={newEntry.notes}
          onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEntry}
          sx={{ marginTop: 1 }}
        >
          Add Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default DietAndFeeding;
