import React, { useState, useEffect } from "react";
import "../styles/Searchpage.css"; // Import CSS file
// import { data } from "../data";
import Modal from "react-modal";
import CartItem from "./CartItem";

const Searchpage = () => {
  const [expandedSections, setExpandedSections] = useState([]);
  const [items, setItems] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [sorted, setSorted] = useState(false);
  const [tag, setTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemName, setItemName] = React.useState("");
  const [itemId, setItemId] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [donor, setDonor] = React.useState("");
  const [donorId, setDonorId] = React.useState("");
  const [cartItems, setCartItems] = React.useState([]);
  const [inputValue, setInputValue] = useState("");
  const [addItemActionOccurred, setAddItemAction] = useState(false);
  const [mongoUser, setMongoUser] = useState(localStorage.getItem("profile"));

  useEffect(() => {
    // Method to call after rendering
    fetch("http://localhost:8080/api/inventory/search")
      .then((resp) => resp.json())
      .then((json) => {
        setItems(json);
      })
      .catch((error) => console.error(error));
  }, []);

  const addToCart = (itemName, quantity, donor, itemId, donorId) => {
    setInputValue("");
    setAddItemAction(true);
    setCartItems([
      ...cartItems,
      { itemName, reservedQuantity: quantity, donor, id: itemId, donorId },
    ]);
    closeModal();
  };

  const search = (e) => {
    const searchWord = e.target.value;
    const searchFilter = items.map((donor) => ({
      ...donor,
      items: donor.items.filter((item) => {
        if (tag === "") {
          return item.itemName.toLowerCase().includes(searchWord.toLowerCase());
        } else if (tag !== "" && item.tag === tag) {
          return item.itemName.toLowerCase().includes(searchWord.toLowerCase());
        }
      }),
    }));
    setItems(searchFilter);
    setWordEntered(searchWord);
    setSorted(false);
  };

  const sortByDistance = () => {
    setSorted(!sorted);
    const itemsCopy = [...items];
    itemsCopy.sort((donor1, donor2) => {
      if (sorted) {
        return donor2.distance - donor1.distance;
      } else {
        return donor1.distance - donor2.distance;
      }
    });
    setItems(itemsCopy);
  };

  const applyTag = (e) => {
    setTag(e.target.value);
    renderItems();
  };

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

  const renderItems = () => {
    return items.map(
      (donor) =>
        donor.items.length > 0 && (
          <div
            key={donor.id}
            className={`donor-section ${
              expandedSections.includes(donor.id) ? "expanded" : ""
            }`}
          >
            <button
              className="donor-header"
              onClick={() => toggleSection(donor.id)}
            >
              <div className="donor-header-content">
                <div className="donor-details-left">
                  <span className="donor-name">
                    Donor Name: {donor.donorName}
                  </span>
                  <span className="donor-distance">
                    Distance from you: {donor.distance} km
                  </span>
                </div>
                <div className="expand-arrow">
                  {expandedSections.includes(donor.id) ? "▼" : "▶"}
                </div>
              </div>
            </button>
            <div className="donor-details">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity Available</th>
                    <th>Reserve</th>
                    <th>Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {donor.items.map((item) => {
                    if (tag === "") {
                      return (
                        <tr key={item.itemName}>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>
                            {item.quantity > 0 && (<button
                              onClick={() => 
                                openModal({
                                  donor: donor.donorName,
                                  itemName: item.itemName,
                                  quantity: item.quantity,
                                  id: item.id,
                                  donorId: item.donorId
                                })
                              }
                              className="add-item-button"
                            >
                              Add
                            </button>)}
                          </td>
                          <td>{item.tag}</td>
                        </tr>
                      );
                    } else if (item.tag === tag) {
                      return (
                        <tr key={item.itemName}>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>
                          {item.quantity > 0 && (<button
                              onClick={() => 
                                openModal({
                                  donor: donor.donorName,
                                  itemName: item.itemName,
                                  quantity: item.quantity,
                                  id: item.id,
                                  donorId: item.donorId
                                })
                              }
                              className="add-item-button"
                            >
                              Add
                            </button>)}
                          </td>
                          <td>{item.tag}</td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
    );
  };

  const openModal = (data) => {
    setItemId(data.id);
    setItemName(data.itemName || "");
    setQuantity(data.quantity || "");
    setDonor(data.donor || "");
    setDonorId(data.donorId);
    setIsModalOpen(true);
  };

  const handleRemoveItem = (itemToRemove) => {
    // Implement logic to remove the item from the cart
    const updatedCart = cartItems.filter((item) => item !== itemToRemove);
    setCartItems(updatedCart);
  };

  const handleUpdateQuantity = (itemToUpdate, newQuantity) => {
    // Implement logic to update the quantity of the item in the cart
    const updatedCart = cartItems.map((item) =>
      item === itemToUpdate ? { ...item, reservedQuantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  const closeModal = () => {
    setInputValue("");
    setIsModalOpen(false);
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const confirmResForm = () => {
    // Generate a unique reservation ID (you can use a more robust method)
    const reservationId = new Date().getTime().toString();

    // Update quantity fields and add reservation ID to data.js
    const reservedData = []
    const updatedData = items.map((donor) => ({
      ...donor,
      items: donor.items.map((item) => {
        const cartItem = cartItems.find(
          (cartItem) => cartItem.id === item.id
        );
        if (cartItem) {
          reservedData.push(cartItem)
          return {
            ...item,
            quantity: item.quantity - cartItem.reservedQuantity,
            reservedQuantity: cartItem.reservedQuantity,
            reservationId,
          };
        }
        return item;
      }),
    }));
    
    // Format body for create reservation http request
    let reservationBody = []

    let donorValues = reservedData.map(item => ({ donorId: item.donorId, donorName: item.donor }));

    // Create a Set of donor objects with unique IDs
    let uniqueDonorsSet = new Set(donorValues.map(info => JSON.stringify(info)));

    // Convert Set back to array of objects
    let uniqueDonorsArray = Array.from(uniqueDonorsSet).map(entry => JSON.parse(entry));

    for (const donor of uniqueDonorsArray) {
      let donorData = {donor: donor.donorId, donorName: donor.donorName, reservedInventory: []}

      for (const item of reservedData) {
        if (item.donorId == donor.donorId) {
          donorData.reservedInventory.push({inventory: item.id, itemName: item.itemName, reservedQuantity: item.reservedQuantity})
        }
      }

      reservationBody.push(donorData)
    }
    console.log(reservationBody)

    // Send http request
    fetch(`http://localhost:8080/api/reservations/${JSON.parse(mongoUser)._id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationBody),
    })
      .then(resp => resp.json())
      .then(resp => {
        console.log("Created reservation")

        // Update the state with the modified data
        setItems(updatedData);

        // Reset the cart after confirming the reservation
        setCartItems([]);
        setIsConfirmModalOpen(false);
      })
      .catch((error) => console.error(error))

    
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="donor-results">
        <h1>Search Page</h1>
        <input
          className="search-input"
          type="text"
          placeholder="Enter item here"
          value={wordEntered}
          onChange={search}
        />
        <button className="sort-distance" onClick={sortByDistance}>
          {sorted ? "Sort By Farthest" : "Sort By Nearby"}
        </button>
        <div className="tag-options">
          <label>Tag: </label>
          <select name="tags" onChange={applyTag}>
            <option></option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten-free">Gluten-free</option>
          </select>
        </div>
        <div>{renderItems()}</div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="add-item-modal"
          overlayClassName="add-item-overlay"
        >
          <div className="add-item-form">
            <h2>Reserve: {itemName}</h2>
            <form>
              <div className="form-group">
                <label htmlFor="newItemQuantity">Quantity:</label>
                <input
                  type="number"
                  max={quantity}
                  min={0}
                  id="reserveInput"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => addToCart(itemName, inputValue, donor, itemId, donorId)}
                class="reserve-button"
              >
                Add Item
              </button>
            </form>
            <button onClick={closeModal} className="close-button">
              Close
            </button>
          </div>
        </Modal>
      </div>

      <div className="cart-box">
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={closeConfirmModal}
          className="add-item-modal"
          overlayClassName="add-item-overlay"
        >
          <div className="add-item-form">
            <h2>Confirmation</h2>
            <form>
              <div className="form-group">
                <label htmlFor="newItemQuantity">Items:</label>
                {cartItems.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={`${item.donor} - ${item.itemName} - ${item.reservedQuantity}`}
                    readOnly
                  />
                ))}
              </div>
              <div className="form-group">
                <label htmlFor="newReservationDate">Email Address:</label>
                <input type="text" id="newReservationDate" />
              </div>
              <div className="form-group">
                <label htmlFor="newReservationDate">Reservation Date:</label>
                <input type="date" id="newReservationDate" />
              </div>
              <button
                onClick={confirmResForm}
                type="button"
                className="confirm-button"
              >
                Confirm
              </button>
            </form>
            <button onClick={closeConfirmModal} className="close-button">
              Close
            </button>
          </div>
        </Modal>

        <h2 className="cart-title">Reserved Cart</h2>
        <div className="reserve-header"></div>
        {cartItems.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
        {cartItems.length > 0 && (
          <button className="confirm-button" onClick={openConfirmModal}>
            Confirm
          </button>
        )}
      </div>
    </div>
  );
};

export default Searchpage;
