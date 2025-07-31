import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import DonorProfilePage from "./components/DonorProfilePage";
import DonorInventory from "./components/DonorInventory";
import DonorReservations from "./components/DonorReservations";
import CharityReservations from "./components/CharityReservation";
import ProfilePage from "./components/ProfilePage";
import SearchPage from "./components/Searchpage";
import RoleSelection from "./components/RoleSelection";
import CreateProfilePage from "./components/CreateProfilePage";
import CharityVerification from "./components/CharityVerification";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";

function App() {
  const { isLoading, isAuthenticated, user, error, getAccessTokenSilently } =
    useAuth0();
  const [mongoUser, setMongoUser] = useState(localStorage.getItem("profile"));
  useEffect(() => {
    const getMongoUser = async () => {
      if (!user || !user.role) {
        setMongoUser(null);
        return;
      }
      const token = await getAccessTokenSilently({
        scope: "read:users update:users",
      });
      try {
        const response = await axios.get(
          `http://localhost:8080/api/${
            user.role === charity ? "charities" : "donors"
          }/${user.sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200 && response.data) {
          localStorage.setItem("profile", JSON.stringify(response.data));
          setMongoUser(localStorage.getItem("profile"));
        } else {
          setMongoUser(null);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    };
    getMongoUser();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  const charity = "rol_eMnBOPuwLoGDPTXE";
  const donor = "rol_Gxv3ockfkKD3KiE0";

  const getHomePageElement = () => {
    if (isAuthenticated && user?.role == charity && mongoUser && !user?.verified)
      return <Navigate to="/charity-verification" />;
    if (isAuthenticated && user?.role && mongoUser)
      return (
        <Navigate
          to={user.role === charity ? "/charity-profile" : "/donor-profile"}
        />
      );
    if (isAuthenticated && !user?.role) return <Navigate to="/role-select" />;
    if (isAuthenticated && user?.role && !mongoUser)
      return <Navigate to="/create-profile" />;
    return <HomePage />;
  };

  const roleSelectElement =
    isAuthenticated && !user?.role ? (
      React.createElement(withAuthenticationRequired(RoleSelection))
    ) : (
      <Navigate to="/" />
    );

  const createProfilePageElement =
    isAuthenticated && user?.role && !mongoUser ? (
      React.createElement(withAuthenticationRequired(CreateProfilePage))
    ) : (
      <Navigate to="/" />
    );

  const charityVerificationElement =
    isAuthenticated && user?.role == charity && mongoUser && !user?.verified ? (
      React.createElement(withAuthenticationRequired(CharityVerification))
    ) : (
      <Navigate to="/" />
    );

  const profilePageElement =
    isAuthenticated && user.role === charity && mongoUser && user?.verified ? (
      React.createElement(withAuthenticationRequired(ProfilePage))
    ) : (
      <Navigate to="/" />
    );

  const searchPageElement =
    isAuthenticated && user.role === charity && mongoUser && user?.verified ? (
      React.createElement(withAuthenticationRequired(SearchPage))
    ) : (
      <Navigate to="/" />
    );

  const reservationsElement =
    isAuthenticated && user.role === charity && mongoUser && user?.verified ? (
      React.createElement(withAuthenticationRequired(CharityReservations))
    ) : (
      <Navigate to="/" />
    );

  const donorProfilePageElement =
    isAuthenticated && user.role === donor && mongoUser ? (
      React.createElement(withAuthenticationRequired(DonorProfilePage))
    ) : (
      <Navigate to="/" />
    );

  const donorInventoryElement =
    isAuthenticated && user.role === donor && mongoUser ? (
      React.createElement(withAuthenticationRequired(DonorInventory))
    ) : (
      <Navigate to="/" />
    );

  const donorReservationsElement =
    isAuthenticated && user.role === donor && mongoUser ? (
      React.createElement(withAuthenticationRequired(DonorReservations))
    ) : (
      <Navigate to="/" />
    );

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={getHomePageElement()} />
          <Route path="/role-select" element={roleSelectElement} />
          <Route path="/create-profile" element={createProfilePageElement} />
          <Route path="/charity-profile" element={profilePageElement} />
          <Route path="/charity-search" element={searchPageElement} />
          <Route path="/charity-verification" element={charityVerificationElement} />
          <Route path="/charity-reservations" element={reservationsElement} />
          <Route path="/donor-profile" element={donorProfilePageElement} />
          <Route path="/donor-inventory" element={donorInventoryElement} />
          <Route
            path="/donor-reservations"
            element={donorReservationsElement}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
