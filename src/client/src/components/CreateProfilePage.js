import React, { useState } from "react";
import "../styles/CreateProfilePage.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProfilePage = () => {
  const charity = "rol_eMnBOPuwLoGDPTXE";
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    contactEmail: "",
    contactNumber: "",
    websiteUrl: "",
    openingTime: "",
    closingTime: "",
  });
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { ...formData, Auth0Id: user.sub };
    const token = await getAccessTokenSilently({
      scope: "read:users update:users",
    });
    try {
      const response = await axios.post(
        `http://localhost:8080/api/${
          user.role === charity ? "charities" : "donors"
        }/${user.role === charity ? "charity" : "donor"}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("profile", JSON.stringify(response.data));
        window.location.reload();
      } else {
        throw new Error(`Response status ${response.status}`);
      }
      navigate(`/`);
    } catch (error) {
      console.error("Creating Profile:", error);
    }
    // Here you can do whatever you want with the form data

    navigate(`/`);
  };

  return (
    <div className="create-profile-page">
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />

        <label>Province:</label>
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={handleChange}
        />

        <label>Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
        />

        <label>Contact Email:</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
        />

        <label>Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
        />

        <label>Website URL:</label>
        <input
          type="text"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleChange}
        />

        <label>Opening Time:</label>
        <input
          type="datetime-local"
          name="openingTime"
          value={formData.openingTime}
          onChange={handleChange}
        />

        <label>Closing Time:</label>
        <input
          type="datetime-local"
          name="closingTime"
          value={formData.closingTime}
          onChange={handleChange}
        />
        {user.role === "rol_eMnBOPuwLoGDPTXE" && (
          <>
            <label>Charitable Number:</label>
            <input
              type="text"
              name="charitableNumber"
              value={formData.charitableNumber}
              onChange={handleChange}
            />
          </>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateProfilePage;
