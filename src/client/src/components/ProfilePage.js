import React from 'react';
import '../styles/ProfilePage.css'; // Import CSS file
import profileLogo from '../images/burlington-food-bank.png';

const ProfilePage = () => {

  return (
    <div className="profile-container">
      <h1>Burlington Food Bank</h1>
      <div className="profile-layout">
        <img 
        src={profileLogo}
        className="profile-logo"
        />
        <table>
          <tbody>
            <tr>
              <td><div className='bold'>Location:</div>1254 Plains Rd, Burlington, ON L7S 1W6</td>
              <td><div className='bold'>Contact:</div>905-637-2273</td>
            </tr>
            <tr>
              <td>
                <div className='bold'>Business Hours:</div> 
                <div className='hours'>
                  <tr>
                    <td>Monday</td>
                    <td>9am - 12:30pm</td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>9am - 12:30pm</td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>9am - 12:30pm</td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>9am - 12:30pm</td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>9am - 12:30pm</td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>Closed</td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>Closed</td>
                  </tr>
                </div>
              </td>
              <td className='top'><div className='bold'>Website:</div> https://www.burlingtonfoodbank.ca/</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
