import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./SideBar";
import GeneralNotes from "./GeneralNotes";
import ImportantDates from "./ImportantDates";
import DietAndFeeding from "../components/DietAndFeeding";

const CatDetails = () => {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { catId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCatDetails = async () => {
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
        const response = await axios.get(`${API_BASE_URL}/api/cats/${catId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCat(response.data);
      } catch (error) {
        setError(
          "Error fetching cat details: " +
            (error.response ? error.response.data : error.message)
        );
        console.error("Error fetching cat details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatDetails();
  }, [catId]);

  if (loading) {
    return (
      <CircularProgress style={{ display: "block", margin: "50px auto" }} />
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!cat) {
    return <Typography>Cat not found.</Typography>;
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(false)}
      />

      <IconButton
        onClick={() => setSidebarOpen(true)}
        style={{ position: "absolute", left: 20, top: 20 }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
        <Typography variant="h4" gutterBottom>
          {cat.name}'s Dashboard
        </Typography>
        <Divider style={{ marginBottom: "20px" }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              style={{ padding: "15px", borderRadius: "8px" }}
            >
              <Typography variant="h6">Basic Info</Typography>
              <Typography>Breed: {cat.breed}</Typography>
              <Typography>Gender: {cat.gender}</Typography>
              <Typography>Weight: {cat.weight} kg</Typography>
              <Typography>Neutered: {cat.neutered ? "Yes" : "No"}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              style={{ padding: "15px", borderRadius: "8px" }}
            >
              <Typography variant="h6">Health Overview</Typography>
              <Typography>
                Vaccinated: {cat.vaccinated ? "Yes" : "No"}
              </Typography>
              <Typography>
                Medical Conditions: {cat.medicalConditions || "None"}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <GeneralNotes catId={catId} />
          </Grid>

          <Grid item xs={12}>
            <ImportantDates catId={catId} />{" "}
          </Grid>

          <Grid item xs={12}>
            <DietAndFeeding catId={catId} />{" "}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CatDetails;
