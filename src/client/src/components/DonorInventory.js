import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles/DonorInventory.css"; // Import CSS file

const DonorInventory = () => {
  // State for handling modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inventoryItems, setInventoryItems] = useState([]);

  const [newItem, setNewItem] = useState({
    itemName: "",
    description: "",
    quantity: 0,
    expiryDate: "",
    image: "",
    tags: "",
    reservedQuantity: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [mongoUser, setMongoUser] = useState(localStorage.getItem("profile"));

  useEffect(() => {
    // Method to call after rendering
    fetch(`http://localhost:8080/api/inventory/${JSON.parse(mongoUser)._id}`)
      .then((resp) => resp.json())
      .then((json) => {
        setInventoryItems(json);
      })
      .catch((error) => console.error(error));
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewItemSubmit = () => {
    fetch(`http://localhost:8080/api/inventory/${JSON.parse(mongoUser)._id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        const newItemWithId = {
          ...newItem,
          _id: resp._id,
        };
        setInventoryItems([...inventoryItems, newItemWithId]);
        setNewItem({
          itemName: "",
          description: "",
          quantity: 0,
          expiryDate: "",
          image: "",
          tags: "",
          reservedQuantity: 0,
        });
        closeModal();
      })
      .catch((error) => console.error(error));
  };

  const handleRemoveItem = (id) => {
    fetch(
      `http://localhost:8080/api/inventory/${JSON.parse(mongoUser)._id}/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((resp) => {
        const updatedInventory = inventoryItems.filter(
          (item) => item._id !== id
        );
        setInventoryItems(updatedInventory);
      })
      .catch((error) => console.error(error));
  };

  const handleEditItem = (id) => {
    setIsEditing(true);
    setEditItemId(id);

    const itemToEdit = inventoryItems.find((item) => item._id === id);
    setNewItem({ ...itemToEdit });
  };

  const handleSaveEdit = () => {
    fetch(
      `http://localhost:8080/api/inventory/${JSON.parse(mongoUser)._id}/${editItemId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        const updatedInventory = inventoryItems.map((item) =>
          item._id === editItemId ? newItem : item
        );
        setInventoryItems(updatedInventory);
        setNewItem({
          itemName: "",
          description: "",
          quantity: 0,
          expiryDate: "",
          image: "",
          tags: "",
          reservedQuantity: 0,
        });
        setIsEditing(false);
        setEditItemId(null);
        closeModal();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="donor-inventory">
      <h1>Your Inventory</h1>
      {/* Button to open the modal */}
      <button onClick={openModal} className="add-item-button">
        Add New Item
      </button>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
            <th>Image</th>
            <th>Tags</th>
            <th>Reserved Quantity</th>
            <th className="action-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item) => (
            <tr key={item._id}>
              <td>
                {isEditing && item._id === editItemId ? (
                  <input
                    type="text"
                    value={newItem.itemName}
                    onChange={(e) =>
                      setNewItem({ ...newItem, itemName: e.target.value })
                    }
                  />
                ) : (
                  item.itemName
                )}
              </td>
              <td>
                {isEditing && item._id === editItemId ? (
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                  />
                ) : (
                  item.description
                )}
              </td>
              <td>
                {isEditing && item._id === editItemId ? (
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        quantity: parseInt(e.target.value),
                      })
                    }
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {isEditing && item._id === editItemId ? (
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) =>
                      setNewItem({ ...newItem, expiryDate: e.target.value })
                    }
                  />
                ) : (
                  item.expiryDate
                )}
              </td>
              <td>
                {isEditing && item._id === editItemId ? (
                  <input
                    type="text"
                    value={newItem.image}
                    onChange={(e) =>
                      setNewItem({ ...newItem, image: e.target.value })
                    }
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="inventory-item-image"
                  />
                )}
              </td>
              <td>
                {isEditing && item._id === editItemId ? (
                  <input
                    type="text"
                    value={newItem.tags}
                    onChange={(e) =>
                      setNewItem({ ...newItem, tags: e.target.value })
                    }
                  />
                ) : (
                  item.tags
                )}
              </td>
              <td>
                {isEditing && item._id === editItemId ? (
                  <input
                    type="text"
                    value={newItem.reservedQuantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, tags: e.target.value })
                    }
                  />
                ) : (
                  item.reservedQuantity
                )}
              </td>
              <td className="action-cell">
                {isEditing && item._id === editItemId ? (
                  <button onClick={handleSaveEdit}>Save</button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditItem(item._id)}
                      className="edit-item-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="remove-item-button"
                    >
                      Remove
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for adding a new item */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="add-item-modal"
        overlayClassName="add-item-overlay"
      >
        <div className="add-item-form">
          <h2>Add New Item</h2>
          <form>
            <div className="form-group">
              <label htmlFor="newItemName">Item Name:</label>
              <input
                type="text"
                id="newItemName"
                value={newItem.itemName}
                onChange={(e) =>
                  setNewItem({ ...newItem, itemName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="newItemDescription">Description:</label>
              <input
                type="text"
                id="newItemDescription"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="newItemQuantity">Quantity:</label>
              <input
                type="number"
                id="newItemQuantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="newItemExpiryDate">Expiry Date:</label>
              <input
                type="date"
                id="newItemExpiryDate"
                value={newItem.expiryDate}
                onChange={(e) =>
                  setNewItem({ ...newItem, expiryDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="newItemImage">Image URL:</label>
              <input
                type="text"
                id="newItemImage"
                value={newItem.image}
                onChange={(e) =>
                  setNewItem({ ...newItem, image: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="newItemTags">
                Tags (comma-separated) (e.g. vegetarian, vegan, gluten-free):
              </label>
              <input
                type="text"
                id="newItemTags"
                value={newItem.tags}
                onChange={(e) =>
                  setNewItem({ ...newItem, tags: e.target.value })
                }
              />
            </div>
            <button type="button" onClick={handleNewItemSubmit}>
              Add Item
            </button>
          </form>
          <button onClick={closeModal} className="close-button">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DonorInventory;
