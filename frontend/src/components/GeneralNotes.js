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
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Save, Close } from "@mui/icons-material";

const GeneralNotes = ({ catId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
        notes.map((note) => (note._id === editNoteId ? response.data : note))
      );
      setEditNoteId(null);
      setEditNoteText("");
    } catch (error) {
      alert("Error updating note.");
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
        General Notes
      </Typography>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Typography color="textSecondary">
          No notes for this cat yet.
        </Typography>
      ) : (
        <List>
          {notes.map((note) => (
            <ListItem key={note._id} divider>
              {editNoteId === note._id ? (
                <TextField
                  value={editNoteText}
                  onChange={(e) => setEditNoteText(e.target.value)}
                  fullWidth
                  multiline
                  variant="outlined"
                />
              ) : (
                <ListItemText primary={note.note} />
              )}

              <IconButton
                onClick={() => handleDeleteNote(note._id)}
                color="error"
              >
                <Delete />
              </IconButton>
              {editNoteId === note._id && (
                <>
                  <IconButton onClick={handleSaveEdit} color="success">
                    <Save />
                  </IconButton>
                  <IconButton
                    onClick={() => setEditNoteId(null)}
                    color="default"
                  >
                    <Close />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}

      <TextField
        label="Add a new note"
        multiline
        fullWidth
        rows={3}
        variant="outlined"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        style={{ marginTop: "15px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNote}
        style={{ marginTop: "10px", display: "block" }}
      >
        Add Note
      </Button>
    </Paper>
  );
};

export default GeneralNotes;
