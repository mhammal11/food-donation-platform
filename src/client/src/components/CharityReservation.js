import React, { useState, useEffect } from 'react';
import '../styles/CharityReservations.css'; // Import CSS file

const CharityReservations = () => {
  const [expandedSections, setExpandedSections] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [mongoUser, setMongoUser] = useState(localStorage.getItem("profile"));

  useEffect(() => {
    // Method to call after rendering
    fetch(`http://localhost:8080/api/reservations/charity/${JSON.parse(mongoUser)._id}`)
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

  const cancelReservation = (reservationId) => {
    fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((resp) => {
        const updatedReservations = reservations.filter((reservation) => reservation._id !== reservationId);
        setReservations(updatedReservations);
      })
      .catch((error) => console.error(error))
  }

  const cancelIndividualReservation = (reservationId, reservationObjectId) => {
    fetch(`http://localhost:8080/api/reservations/${reservationId}/${reservationObjectId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((resp) => {
        const updatedReservations = reservations.map(reservation => {
          if (reservation._id === reservationId) {
            const updatedReservationObjects = reservation.reservations.filter(res => res._id !== reservationObjectId)

            return {
              ...reservation,
              reservations: updatedReservationObjects
            }
          }

          return reservation
        })

        setReservations(updatedReservations);
      })
      .catch((error) => console.error(error))
  }

  return (
    <div className="charity-reservations">
      <h1>Charity Reservations</h1>
      {reservations.map((res) => (
        <div className="reservation-block">
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h2>Reservation ID: {res._id}</h2>
            <div style={{ display: 'flex' }}>
              <h2>Date: {res.createdAt}</h2>
              <button className="delete-button" onClick={() => cancelReservation(res._id)}>Cancel</button>
            </div>
          </div>
          {res.reservations.map((reservation) => (
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
                    {/* <span>Reservation ID: {reservation.id}</span> */}
                    <span className="reservation-name">Name: {reservation.donorName}</span>
                    {/* <span>Date: {reservation.date}</span> */}
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
                      <th><div style={{display:'flex', justifyContent: 'space-between', width: '100%'}}>
                        <div style={{marginTop: 'auto', marginBottom: 'auto'}}>Quantity</div>
                        <div><button className='delete-button' onClick={() => cancelIndividualReservation(res._id, reservation._id)}>Cancel</button></div>
                      </div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservation.reservedInventory.map((item) => (
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
      ))
      }
    </div>
  );
};

export default CharityReservations;
