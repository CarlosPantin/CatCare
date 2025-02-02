import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import GeneralNotes from "./GeneralNotes";

const CatDetails = () => {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { catId } = useParams();

  useEffect(() => {
    const fetchCatDetails = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
          : process.env.REACT_APP_API_BASE_URL;

      console.log("API_BASE_URL:", API_BASE_URL);

      try {
        const response = await axios.get(`${API_BASE_URL}/api/cats/${catId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    return <div>Loading cat details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!cat) {
    return <div>Cat not found.</div>;
  }

  return (
    <div>
      <h1>{cat.name}</h1>
      <p>Breed: {cat.breed}</p>
      <p>Gender: {cat.gender}</p>
      <p>Weight: {cat.weight} kg</p>
      <p>Neutered: {cat.neutered ? "Yes" : "No"}</p>
      <GeneralNotes catId={catId} />
    </div>
  );
};

export default CatDetails;
