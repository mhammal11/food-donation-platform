import React from "react";
import "../styles/RoleSelection.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoleSelection = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const updateRole = async (role) => {
    const token = await getAccessTokenSilently({
      scope: "read:users update:users",
    });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/role/update",
        {
          user_id: user.sub,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        window.location.reload();
      }
      navigate(`/`);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="role-selection-container">
      <h2 className="role-selection-title">Select Your Role</h2>
      <button
        className="role-button charity-button"
        onClick={() => updateRole("rol_eMnBOPuwLoGDPTXE")}
      >
        Charity
      </button>{" "}
      {/* roleID for Charity */}
      <button
        className="role-button donor-button"
        onClick={() => updateRole("rol_Gxv3ockfkKD3KiE0")}
      >
        Donor
      </button>{" "}
      {/* roleID for Donor */}
    </div>
  );
};

export default RoleSelection;
