import React, { useState, useEffect } from "react";
import axios from "axios";

const GeneralNotes = ({ catId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
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
        const response = await axios.get(`${API_BASE_URL}/api/generalNotes/${catId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes([...notes, response.data]);
      setNewNote(""); 
    } catch (error) {
      alert("Error adding note.");
    }
  };

  if (loading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div>
      <h3>General Notes</h3>
      <div>
        {notes.length === 0 ? (
          <p>No notes for this cat yet.</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note._id}>{note.note}</li>
            ))}
          </ul>
        )}
      </div>
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a new note"
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default GeneralNotes;
