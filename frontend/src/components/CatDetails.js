import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Box,
  Toolbar,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./SideBar";
import GeneralNotes from "./GeneralNotes";
import ImportantDates from "./ImportantDates";
import DietAndFeeding from "../components/DietAndFeeding";
import MedicalHistory from "../components/MedicalHistory";
import ShoppingList from "../components/ShoppingList";
import { Pets, HealthAndSafety } from "@mui/icons-material";

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
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F4F6F8" }}>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "#1976D2", boxShadow: "none" }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ marginRight: "10px" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">{cat.name}'s Dashboard</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ padding: "20px", overflowY: "auto", flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{ padding: "20px", borderRadius: "10px" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                >
                  <Pets sx={{ marginRight: "8px", color: "#FF6F61" }} /> Basic
                  Info
                </Typography>
                <Typography>Breed: {cat.breed}</Typography>
                <Typography>Gender: {cat.gender}</Typography>
                <Typography>Weight: {cat.weight} kg</Typography>
                <Typography>Neutered: {cat.neutered ? "Yes" : "No"}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{ padding: "20px", borderRadius: "10px" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                >
                  <HealthAndSafety
                    sx={{ marginRight: "8px", color: "#4CAF50" }}
                  />{" "}
                  Health Overview
                </Typography>
                <Typography>
                  Vaccinated: {cat.vaccinated ? "Yes" : "No"}
                </Typography>
                <Typography>
                  Medical Conditions: {cat.medicalConditions || "None"}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{ padding: "20px", borderRadius: "10px" }}
              >
                <ShoppingList catId={catId} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <GeneralNotes catId={catId} />
            </Grid>

            <Grid item xs={12}>
              <ImportantDates catId={catId} />
            </Grid>

            <Grid item xs={12}>
              <DietAndFeeding catId={catId} />
            </Grid>

            <Grid item xs={12}>
              <MedicalHistory catId={catId} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CatDetails;
