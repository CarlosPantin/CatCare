import React, { useState } from "react";
import axios from "axios";

const AddCatForm = ({ onCatAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    breed: "",
    neutered: false,
    gender: "",
    weight: "",
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("birthdate", formData.birthdate);
    data.append("breed", formData.breed);
    data.append("neutered", formData.neutered);
    data.append("gender", formData.gender);
    data.append("weight", formData.weight);
    data.append("photo", formData.photo);
    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
        : process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cats`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onCatAdded(response.data);

      setFormData({
        name: "",
        birthdate: "",
        breed: "",
        neutered: false,
        gender: "",
        weight: "",
        photo: null,
      });

      alert("Cat added successfully!");
    } catch (error) {
      console.error("Error adding cat:", error);
      alert("There was an error adding your cat.");
    }
  };

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          /* Ensure full viewport height */
          body {
            font-family: 'Roboto', sans-serif;
            background-color: #f0f0f0;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding: 0;
            margin: 0;
            background-color: #f0f0f0; /* Make sure there's a background color */
          }

          /* Main form container */
          .cat-form {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 40px;
            width: 100%;
            animation: slideIn 1s ease-out forwards;
            transform: translateY(30px);
            display: flex;
            flex-direction: column;
          }

          /* Form header */
          .cat-form h2 {
            text-align: center;
            color: #5bc0be;
            font-size: 2.2rem;
            margin-bottom: 20px;
            font-weight: 600;
            text-transform: uppercase;
          }

          /* Form label styling */
          label {
            display: block;
            font-size: 1rem;
            margin-bottom: 8px;
            color: #444;
            font-weight: 500;
          }

          /* Input and select fields */
          input[type="text"],
          input[type="date"],
          input[type="number"],
          select,
          input[type="checkbox"] {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 1rem;
            background-color: #f9f9f9;
            color: #333;
            transition: all 0.3s ease;
          }

          input[type="text"]:focus,
          input[type="date"]:focus,
          input[type="number"]:focus,
          select:focus,
          input[type="checkbox"]:focus {
            border-color: #5bc0be;
            outline: none;
            box-shadow: 0 0 8px rgba(91, 192, 190, 0.5);
          }

          input[type="file"] {
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 10px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
          }

          /* Button styles */
          button {
            width: 100%;
            padding: 14px;
            background-color: #5bc0be;
            color: white;
            font-size: 1.2rem;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
          }

          button:hover {
            background-color: #4a9a9a;
            transform: translateY(-3px);
          }

          button:active {
            background-color: #397a78;
            transform: translateY(1px);
          }

          /* Animation for form appearance */
          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive design */
          @media screen and (max-width: 768px) {
            .cat-form {
              padding: 20px;
              max-width: 100%;
            }

            .cat-form h2 {
              font-size: 1.8rem;
            }

            input[type="text"],
            input[type="date"],
            input[type="number"],
            select,
            input[type="checkbox"] {
              font-size: 1rem;
              padding: 10px;
            }

            button {
              font-size: 1.1rem;
              padding: 12px;
            }
          }
        `}
      </style>

      <form onSubmit={handleSubmit} className="cat-form">
        <h2>Add a New Cat</h2>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Birthdate:
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Breed:
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Weight (kg):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Neutered:
          <input
            type="checkbox"
            name="neutered"
            checked={formData.neutered}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Photo:
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        <button type="submit">Add Cat</button>
      </form>
    </>
  );
};

export default AddCatForm;
