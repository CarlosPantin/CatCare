import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
} from "@mui/material";

const MedicalHistory = ({ catId }) => {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newVisit, setNewVisit] = useState({
    date: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    medication: "",
  });

  const [newVaccination, setNewVaccination] = useState({
    name: "",
    date: "",
    nextDue: "",
  });

  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
      : process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/medicalHistory/${catId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMedicalHistory(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.error : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [catId]);

  const handleAddVisit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/medicalHistory/${catId}/visits`,
        newVisit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedicalHistory(response.data);
      setNewVisit({
        date: "",
        reason: "",
        diagnosis: "",
        treatment: "",
        medication: "",
      });
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const handleAddVaccination = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/medicalHistory/${catId}/vaccinations`,
        newVaccination,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedicalHistory(response.data);
      setNewVaccination({ name: "", date: "", nextDue: "" });
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const handleDeleteVisit = async (visitId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/api/medicalHistory/${catId}/visits/${visitId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedicalHistory(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/api/medicalHistory/${catId}/vaccinations/${vaccinationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedicalHistory(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  if (loading) return <Typography>Loading medical history...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper
      elevation={2}
      style={{ padding: "15px", borderRadius: "8px", marginTop: "20px" }}
    >
      <Typography variant="h6">Medical History</Typography>
      <Divider style={{ marginBottom: "10px" }} />

      <Typography variant="subtitle1">Visits</Typography>
      <List>
        {medicalHistory?.visits?.length > 0 ? (
          medicalHistory.visits.map((visit) => (
            <ListItem key={visit._id}>
              <ListItemText
                primary={`${visit.reason} (${new Date(
                  visit.date
                ).toLocaleDateString()})`}
                secondary={`Diagnosis: ${visit.diagnosis}, Treatment: ${
                  visit.treatment
                }, Medication: ${visit.medication || "None"}`}
              />
              <Button
                onClick={() => handleDeleteVisit(visit._id)}
                color="secondary"
              >
                Delete
              </Button>
            </ListItem>
          ))
        ) : (
          <Typography>No visits recorded.</Typography>
        )}
      </List>

      <TextField
        label="Date"
        type="date"
        fullWidth
        value={newVisit.date}
        onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Reason"
        fullWidth
        value={newVisit.reason}
        onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })}
      />
      <TextField
        label="Diagnosis"
        fullWidth
        value={newVisit.diagnosis}
        onChange={(e) =>
          setNewVisit({ ...newVisit, diagnosis: e.target.value })
        }
      />
      <TextField
        label="Treatment"
        fullWidth
        value={newVisit.treatment}
        onChange={(e) =>
          setNewVisit({ ...newVisit, treatment: e.target.value })
        }
      />
      <TextField
        label="Medication"
        fullWidth
        value={newVisit.medication}
        onChange={(e) =>
          setNewVisit({ ...newVisit, medication: e.target.value })
        }
      />
      <Button
        onClick={handleAddVisit}
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Add Visit
      </Button>

      <Divider style={{ marginTop: "20px", marginBottom: "10px" }} />

      <Typography variant="subtitle1">Vaccinations</Typography>
      <List>
        {medicalHistory?.vaccinations?.length > 0 ? (
          medicalHistory.vaccinations.map((vaccine) => (
            <ListItem key={vaccine._id}>
              <ListItemText
                primary={`${vaccine.name} (${new Date(
                  vaccine.date
                ).toLocaleDateString()})`}
                secondary={`Next Due: ${new Date(
                  vaccine.nextDue
                ).toLocaleDateString()}`}
              />
              <Button
                onClick={() => handleDeleteVaccination(vaccine._id)}
                color="secondary"
              >
                Delete
              </Button>
            </ListItem>
          ))
        ) : (
          <Typography>No vaccinations recorded.</Typography>
        )}
      </List>

      <TextField
        label="Vaccine Name"
        fullWidth
        value={newVaccination.name}
        onChange={(e) =>
          setNewVaccination({ ...newVaccination, name: e.target.value })
        }
      />
      <TextField
        label="Date"
        type="date"
        fullWidth
        value={newVaccination.date}
        onChange={(e) =>
          setNewVaccination({ ...newVaccination, date: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Next Due"
        type="date"
        fullWidth
        value={newVaccination.nextDue}
        onChange={(e) =>
          setNewVaccination({ ...newVaccination, nextDue: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
      />
      <Button
        onClick={handleAddVaccination}
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Add Vaccination
      </Button>
    </Paper>
  );
};

export default MedicalHistory;
