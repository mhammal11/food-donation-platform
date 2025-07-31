import React from 'react';
import LoginButton from './LoginButton';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
        <div className="container">
            <h1 className="heading-text">Food Rescue is a platform to connect organizations involved in food rescue <br /> <br />
                You can sign up as a charity to browse through and reserve the inventory of food items available from donors <br /> 
                or you can sign up as a donor to list the food items you have available for donation.
            </h1>
            <LoginButton />
      </div>
    </div>
  );
};

export default HomePage;
