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
  );
};

export default AddCatForm;
