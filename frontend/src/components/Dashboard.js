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

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
          : process.env.REACT_APP_API_BASE_URL;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/cats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCats(response.data);
      } catch (error) {
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

  if (loading) {
    return <div className="dashboard-loading-message">Loading your cats...</div>;
  }

  return (
    <div className="dashboard-main-container">
      <h1 className="dashboard-header">Your Cats</h1>

      <button className="dashboard-toggle-form-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add a New Cat"}
      </button>

      {showForm && <AddCatForm onCatAdded={handleCatAdded} />}

      {!showForm && (
        <>
          {cats.length > 0 ? (
            <div className="dashboard-cat-list-container">
              {cats.map((cat) => (
                <div key={cat._id} className="dashboard-cat-card">
                  <img
                    src={
                      cat.photo
                        ? `${process.env.REACT_APP_API_BASE_URL}/${cat.photo}`
                        : "/default-photo.jpg"
                    }
                    alt={cat.name}
                    className="dashboard-cat-photo"
                  />
                  <h3 className="dashboard-cat-name">{cat.name}</h3>
                  <p className="dashboard-cat-breed">Breed: {cat.breed}</p>
                  <p className="dashboard-cat-gender">Gender: {cat.gender}</p>
                  <p className="dashboard-cat-weight">Weight: {cat.weight} kg</p>
                  <p className="dashboard-cat-neutered">Neutered: {cat.neutered ? "Yes" : "No"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-no-cats-message">You have no cats associated with your account.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
