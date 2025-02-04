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

const MedicalHistory = ({ catId }) => {
  const [visits, setVisits] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [editVisitId, setEditVisitId] = useState(null);
  const [editVaccinationId, setEditVaccinationId] = useState(null);
  const [editVisitData, setEditVisitData] = useState({
    date: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    medication: "",
  });
  const [editVaccinationData, setEditVaccinationData] = useState({
    name: "",
    date: "",
    nextDue: "",
  });

  const fetchMedicalHistory = async () => {
    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/medicalhistory/${catId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVisits(response.data.visits);
      setVaccinations(response.data.vaccinations);
    } catch (error) {
      console.error("Error fetching medical history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, [catId]);

  const handleAddVisit = async () => {
    if (
      !newVisit.date ||
      !newVisit.reason ||
      !newVisit.diagnosis ||
      !newVisit.treatment
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/medicalhistory/${catId}/visits`,
        newVisit,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMedicalHistory();

      setNewVisit({
        date: "",
        reason: "",
        diagnosis: "",
        treatment: "",
        medication: "",
      });
    } catch (error) {
      alert("Error adding visit.");
    }
  };

  const handleAddVaccination = async () => {
    if (!newVaccination.name || !newVaccination.date) {
      alert("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/medicalhistory/${catId}/vaccinations`,
        newVaccination,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMedicalHistory();

      setNewVaccination({ name: "", date: "", nextDue: "" });
    } catch (error) {
      alert("Error adding vaccination.");
    }
  };

  const handleEditVisit = (visit) => {
    setEditVisitId(visit._id);
    setEditVisitData(visit);
  };

  const handleEditVaccination = (vaccination) => {
    setEditVaccinationId(vaccination._id);
    setEditVaccinationData(vaccination);
  };

  const handleSaveVisitEdit = async () => {
    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/medicalhistory/${catId}/visits/${editVisitId}`,
        editVisitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisits(
        visits.map((visit) =>
          visit._id === editVisitId ? response.data : visit
        )
      );
      setEditVisitId(null);
    } catch (error) {
      alert("Error updating visit.");
    }
  };

  const handleSaveVaccinationEdit = async () => {
    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/medicalhistory/${catId}/vaccinations/${editVaccinationId}`,
        editVaccinationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVaccinations(
        vaccinations.map((vaccination) =>
          vaccination._id === editVaccinationId ? response.data : vaccination
        )
      );
      setEditVaccinationId(null);
    } catch (error) {
      alert("Error updating vaccination.");
    }
  };

  const handleDeleteVisit = async (visitId) => {
    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/medicalhistory/${catId}/visits/${visitId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVisits(visits.filter((visit) => visit._id !== visitId));
    } catch (error) {
      alert("Error deleting visit.");
    }
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/medicalhistory/${catId}/vaccinations/${vaccinationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVaccinations(
        vaccinations.filter((vaccination) => vaccination._id !== vaccinationId)
      );
    } catch (error) {
      alert("Error deleting vaccination.");
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
        Medical History
      </Typography>

      {/* Visits Section */}
      <Typography variant="h6">Visits</Typography>
      <List>
        {visits.map((visit) => (
          <ListItem key={visit._id}>
            {editVisitId === visit._id ? (
              <>
                <TextField
                  label="Date"
                  type="date"
                  value={editVisitData.date}
                  onChange={(e) =>
                    setEditVisitData({ ...editVisitData, date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Reason"
                  value={editVisitData.reason}
                  onChange={(e) =>
                    setEditVisitData({
                      ...editVisitData,
                      reason: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Diagnosis"
                  value={editVisitData.diagnosis}
                  onChange={(e) =>
                    setEditVisitData({
                      ...editVisitData,
                      diagnosis: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Treatment"
                  value={editVisitData.treatment}
                  onChange={(e) =>
                    setEditVisitData({
                      ...editVisitData,
                      treatment: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Medication"
                  value={editVisitData.medication}
                  onChange={(e) =>
                    setEditVisitData({
                      ...editVisitData,
                      medication: e.target.value,
                    })
                  }
                />
                <IconButton onClick={handleSaveVisitEdit}>
                  <Save />
                </IconButton>
                <IconButton onClick={() => setEditVisitId(null)}>
                  <Close />
                </IconButton>
              </>
            ) : (
              <>
                <ListItemText
                  primary={`${visit.reason} - ${new Date(
                    visit.date
                  ).toLocaleDateString()}`}
                />
                <IconButton onClick={() => handleEditVisit(visit)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteVisit(visit._id)}>
                  <Delete />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <TextField
        label="New Visit Date"
        type="date"
        value={newVisit.date}
        onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Reason"
        value={newVisit.reason}
        onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })}
      />
      <TextField
        label="Diagnosis"
        value={newVisit.diagnosis}
        onChange={(e) =>
          setNewVisit({ ...newVisit, diagnosis: e.target.value })
        }
      />
      <TextField
        label="Treatment"
        value={newVisit.treatment}
        onChange={(e) =>
          setNewVisit({ ...newVisit, treatment: e.target.value })
        }
      />
      <TextField
        label="Medication"
        value={newVisit.medication}
        onChange={(e) =>
          setNewVisit({ ...newVisit, medication: e.target.value })
        }
      />
      <Button onClick={handleAddVisit}>Add Visit</Button>

      <Typography variant="h6">Vaccinations</Typography>
      <List>
        {vaccinations.map((vaccination) => (
          <ListItem key={vaccination._id}>
            {editVaccinationId === vaccination._id ? (
              <>
                <TextField
                  label="Name"
                  value={editVaccinationData.name}
                  onChange={(e) =>
                    setEditVaccinationData({
                      ...editVaccinationData,
                      name: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Date"
                  type="date"
                  value={editVaccinationData.date}
                  onChange={(e) =>
                    setEditVaccinationData({
                      ...editVaccinationData,
                      date: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Next Due"
                  type="date"
                  value={editVaccinationData.nextDue}
                  onChange={(e) =>
                    setEditVaccinationData({
                      ...editVaccinationData,
                      nextDue: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton onClick={handleSaveVaccinationEdit}>
                  <Save />
                </IconButton>
                <IconButton onClick={() => setEditVaccinationId(null)}>
                  <Close />
                </IconButton>
              </>
            ) : (
              <>
                <ListItemText
                  primary={`${vaccination.name} - ${new Date(
                    vaccination.date
                  ).toLocaleDateString()}`}
                />
                <IconButton onClick={() => handleEditVaccination(vaccination)}>
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteVaccination(vaccination._id)}
                >
                  <Delete />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <TextField
        label="Vaccination Name"
        value={newVaccination.name}
        onChange={(e) =>
          setNewVaccination({ ...newVaccination, name: e.target.value })
        }
      />
      <TextField
        label="Vaccination Date"
        type="date"
        value={newVaccination.date}
        onChange={(e) =>
          setNewVaccination({ ...newVaccination, date: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Next Due"
        type="date"
        value={newVaccination.nextDue}
        onChange={(e) =>
          setNewVaccination({ ...newVaccination, nextDue: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
      />
      <Button onClick={handleAddVaccination}>Add Vaccination</Button>
    </Paper>
  );
};

export default MedicalHistory;
