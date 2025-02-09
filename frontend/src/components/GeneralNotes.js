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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

const GeneralNotes = ({ catId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
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
          `${API_BASE_URL}/api/generalNotes/${catId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotes(response.data);
      } catch (error) {
        alert("Error fetching general notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [catId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert("Note cannot be empty.");
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
        `${API_BASE_URL}/api/generalNotes/${catId}`,
        { note: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([...notes, response.data]);
      setNewNote("");
      setOpenModal(false);
    } catch (error) {
      alert("Error adding note.");
    }
  };

  const handleDeleteNote = async (noteId) => {
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
        `${API_BASE_URL}/api/generalNotes/${catId}/${noteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      alert("Error deleting note.");
    }
  };

  const handleEditNote = (note) => {
    setEditNoteId(note._id);
    setEditNoteText(note.note);
    setOpenModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editNoteText.trim()) {
      alert("Note cannot be empty.");
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
      const response = await axios.put(
        `${API_BASE_URL}/api/generalNotes/${catId}/${editNoteId}`,
        { note: editNoteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(
        notes.map((note) =>
          note._id === editNoteId ? { ...note, note: response.data.note } : note
        )
      );
      setEditNoteId(null);
      setEditNoteText("");
      setOpenModal(false);
    } catch (error) {
      alert("Error updating note.");
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
        General Notes 📝
      </Typography>

      <List sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {notes.length === 0 ? (
          <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
            No notes yet... Add some! 😊
          </Typography>
        ) : (
          notes.map((note) => (
            <ListItem
              key={note._id}
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
              ✏️ {note.note}
              <IconButton
                onClick={() => handleDeleteNote(note._id)}
                color="error"
                sx={{ marginLeft: "auto" }}
              >
                <Delete />
              </IconButton>
              <IconButton
                onClick={() => handleEditNote(note)}
                color="primary"
                sx={{ marginLeft: "10px" }}
              >
                <Edit />
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
        <DialogTitle>{editNoteId ? "Edit Note" : "Add New Note"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            variant="outlined"
            value={editNoteId ? editNoteText : newNote}
            onChange={(e) =>
              editNoteId
                ? setEditNoteText(e.target.value)
                : setNewNote(e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={editNoteId ? handleSaveEdit : handleAddNote}
            color="primary"
            variant="contained"
          >
            {editNoteId ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GeneralNotes;
