import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  MenuItem,
  Select,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";

const ShoppingList = ({ catId }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
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
        const response = await axios.get(`${API_BASE_URL}/api/shoppingList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
      } catch (error) {
        alert("Error fetching shopping list.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.trim()) {
      alert("Item name cannot be empty.");
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
        `${API_BASE_URL}/api/shoppingList`,
        { item: newItem, quantity, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([...items, response.data]);
      setNewItem("");
      setQuantity(1);
      setPriority("Medium");
    } catch (error) {
      alert("Error adding item.");
    }
  };

  const handleDeleteItem = async (itemId) => {
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
      await axios.delete(`${API_BASE_URL}/api/shoppingList/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      alert("Error deleting item.");
    }
  };

  if (loading) {
    return (
      <CircularProgress style={{ display: "block", margin: "20px auto" }} />
    );
  }

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", borderRadius: "10px", marginTop: "20px" }}
    >
      <Typography variant="h5" gutterBottom>
        Shopping List
      </Typography>

      <List>
        {items.length === 0 ? (
          <Typography color="textSecondary">
            No items in shopping list.
          </Typography>
        ) : (
          items.map((item) => (
            <ListItem key={item._id} divider>
              <ListItemText
                primary={`${item.item} (x${item.quantity})`}
                secondary={`Priority: ${item.priority}`}
              />
              <IconButton
                onClick={() => handleDeleteItem(item._id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>

      {/* Add New Item */}
      <TextField
        label="Item"
        variant="outlined"
        fullWidth
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        style={{ marginTop: "10px" }}
      />
      <TextField
        label="Quantity"
        type="number"
        variant="outlined"
        fullWidth
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{ marginTop: "10px" }}
      />
      <Select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        fullWidth
        variant="outlined"
        style={{ marginTop: "10px" }}
      >
        <MenuItem value="High">High</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Low">Low</MenuItem>
      </Select>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<Add />}
        onClick={handleAddItem}
        style={{ marginTop: "10px" }}
      >
        Add Item
      </Button>
    </Paper>
  );
};

export default ShoppingList;
