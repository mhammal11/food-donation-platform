import React from 'react';
import '../styles/DonorProfilePage.css'; // Import CSS file
import profileLogo from '../images/fortinos.png';

const DonorProfilePage = () => {

  return (
    <div className="profile-container">
      <h1>Fortinos</h1>
      <div className="profile-layout">
        <img 
        src={profileLogo}
        className="profile-logo"
        />
        <table>
          <tbody>
            <tr>
              <td><div className='bold'>Location:</div> 2025 Guelph Line, Burlington, ON L7P 4M8</td>
              <td><div className='bold'>Contact:</div> 123-456-7890</td>
            </tr>
            <tr>
              <td>
                <div className='bold'>Business Hours:</div> 
                <div className='hours'>
                  <tr>
                    <td>Monday</td>
                    <td>7am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>7am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>7am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>7am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>7am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>7am - 8pm</td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>7am - 8pm</td>
                  </tr>
                </div>
              </td>
              <td className='top'><div className='bold'>Website:</div> https://www.fortinos.ca/</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorProfilePage;
