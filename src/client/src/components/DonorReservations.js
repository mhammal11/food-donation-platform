import React, { useState, useEffect } from 'react';
import '../styles/DonorReservations.css'; // Import CSS file

const DonorReservations = () => {
  const [expandedSections, setExpandedSections] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [mongoUser, setMongoUser] = useState(localStorage.getItem("profile"));

  useEffect(() => {
    // Method to call after rendering
    fetch(`http://localhost:8080/api/reservations/donor/${JSON.parse(mongoUser)._id}`)
      .then((resp) => resp.json())
      .then((json) => {
        setReservations(json)
      })
      .catch((error) => console.error(error))
  }, []);

  const toggleSection = (id) => {
    const updatedSections = [...expandedSections];
    const index = updatedSections.indexOf(id);

    if (index === -1) {
      updatedSections.push(id);
    } else {
      updatedSections.splice(index, 1);
    }

    setExpandedSections(updatedSections);
  };

  return (
    <div className="donor-reservations">
      <h1>Reservations</h1>
      {reservations.map((reservation) => (
        <div
          key={reservation._id}
          className={`reservation-section ${expandedSections.includes(reservation._id) ? 'expanded' : ''}`}
        >
          <button
            className="reservation-header"
            onClick={() => toggleSection(reservation._id)}
          >
            <div className="reservation-header-content">
              <div className="reservation-details-left">
                <span>Reservation ID: {reservation._id}</span>
                <span className="reservation-name">Name: {reservation.charityName}</span>
                <span>Date: {reservation.createdAt}</span>
              </div>
              <div className="expand-arrow">
                {expandedSections.includes(reservation._id) ? '▼' : '▶'}
              </div>
            </div>
          </button>
          <div className="reservation-details">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {reservation.reservations[0].reservedInventory.map((item) => (
                  <tr key={item.itemName}>
                    <td>{item.itemName}</td>
                    <td>{item.reservedQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonorReservations;
