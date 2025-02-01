import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCatForm from "./AddCatForm";
import "./Dashboard.css";

const Dashboard = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }
      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? "https://catcare-clak.onrender.com"
          : "http://localhost:5000";
      console.log("NODE_ENV:", process.env.NODE_ENV);
      console.log("API BASE URL:", API_BASE_URL);
      try {
        const response = await axios.get(
          `${process.env.API_BASE_URL}/api/cats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Cats fetched:", response.data);
        setCats(response.data);
      } catch (error) {
        console.error("Error fetching cats:", error);
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          alert("There was an error fetching your cats.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  const handleCatAdded = (newCat) => {
    setCats([...cats, newCat]);
    setShowForm(false);
  };
  console.log(
    "Final API URL:",
    `${process.env.REACT_APP_API_BASE_URL}/api/cats`
  );

  if (loading) {
    return <div className="loading-message">Loading your cats...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Your Cats</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add a New Cat"}
      </button>

      {showForm && <AddCatForm onCatAdded={handleCatAdded} />}

      {!showForm && (
        <>
          {cats.length > 0 ? (
            <div className="cats-list">
              {cats.map((cat) => (
                <div key={cat._id} className="cat-card">
                  <img
                    src={
                      cat.photo
                        ? `${process.env.REACT_APP_API_BASE_URL}/${cat.photo}`
                        : "/default-photo.jpg"
                    }
                    alt={cat.name}
                    className="cat-photo"
                  />
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
