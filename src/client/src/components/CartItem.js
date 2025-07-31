import React, { useState } from 'react';
import "../styles/Searchpage.css"; // Import CSS file

const CartItem = ({ item, onRemoveItem, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(item.reservedQuantity);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 0;
    setQuantity(newQuantity);
    onUpdateQuantity(item, newQuantity);
  };

  return (
    <div className="reserve-details">
      <table>
        <tbody>
          <tr>
            <td>{item.donor}</td>
            <td>{item.itemName}</td>
            <td>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className='edit-reserve-quantity'
              />
            </td>
            <td>
              <button className='remove-button' onClick={() => onRemoveItem(item)}>X</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CartItem;