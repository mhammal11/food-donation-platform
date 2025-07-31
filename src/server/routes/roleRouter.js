const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper function to get Management API Token
async function getManagementApiToken() {
    const { data } = await axios.post('https://foodbanks.us.auth0.com/oauth/token', {
      client_id: 's5E47A1tQRorSDDYzkSpIUprwL6YpLNp',
      client_secret: 'Hje4kqH2IJv1S-kXrOLC1l5ch1-cKU1BfEsuKQF1vPaX4oR2PeJWCaXAFJe1s4UO',
      audience: 'https://foodbanks.us.auth0.com/api/v2/',
      grant_type: 'client_credentials',
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  
    return data.access_token;
  }
  
  // Function to assign roles to a user
  async function assignRoleToUser(userId, roleIds, accessToken) {
    try {
      const response = await axios.post(`https://foodbanks.us.auth0.com/api/v2/users/${userId}/roles`, {
        roles: roleIds
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning role:', error.response?.data || error.message);
      throw error;
    }
  }

  // Function to update user metadata with role
  async function updateUserMetadataWithRole(userId, role, accessToken) {
    try {
      const response = await axios.patch(`https://foodbanks.us.auth0.com/api/v2/users/${userId}`, {
        user_metadata: { role: role },
    }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating role metadata:', error.response?.data || error.message);
      throw error;
    }
  }

  // Route to handle role update
  router.post('/update', async (req, res) => {
      const { user_id, role } = req.body;
      
      try {
        const accessToken = await getManagementApiToken();
        await assignRoleToUser(user_id, [role], accessToken);
        await updateUserMetadataWithRole(user_id, role, accessToken);
        res.status(200).send({ success: true });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to assign role' });
      }
  });

module.exports = router;