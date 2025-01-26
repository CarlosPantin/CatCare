// src/components/Dashboard.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [cats, setCats] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const token = localStorage.getItem("token");

   
    const fetchCats = async () => {
      try {
        const response = await axios.get("/api/cats", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setCats(response.data); 
      } catch (error) {
        console.error("Error fetching cats:", error);
        alert("There was an error fetching your cats.");
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  if (loading) {
    return <div>Loading your cats...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Your Cats</h1>

      {cats.length > 0 ? (
        <div className="cats-list">
          {cats.map((cat) => (
            <div key={cat._id} className="cat-card">
              <img src={cat.photo} alt={cat.name} className="cat-photo" />
              <h3>{cat.name}</h3>
              <p>Breed: {cat.breed}</p>
              <p>Gender: {cat.gender}</p>
              <p>Weight: {cat.weight} kg</p>
              <p>Neutered: {cat.neutered ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no cats associated with your account.</p>
      )}
    </div>
  );
};

export default Dashboard;
