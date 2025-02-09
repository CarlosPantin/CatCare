import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  List,
  ListItem,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const ShoppingList = ({ catId }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priority, setPriority] = useState("Medium");
  const [openModal, setOpenModal] = useState(false);
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
      setOpenModal(false);
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
        Shopping List 📝
      </Typography>

      <List sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {items.length === 0 ? (
          <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
            No items yet... Add some! 😊
          </Typography>
        ) : (
          items.map((item) => (
            <ListItem
              key={item._id}
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
              ✏️ {item.item} (x{item.quantity}) - {item.priority}
              <IconButton
                onClick={() => handleDeleteItem(item._id)}
                color="error"
                sx={{ marginLeft: "auto" }}
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))
        )}
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
        <DialogTitle>Add Shopping Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ marginTop: "10px" }}
          />
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginTop: "10px" }}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShoppingList;
