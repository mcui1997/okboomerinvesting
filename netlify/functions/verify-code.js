// Netlify Function to verify dashboard access code
const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { code } = JSON.parse(event.body);

    // Get the correct access code from environment variable
    const correctCode = process.env.DASHBOARD_ACCESS_CODE;

    // Check if environment variable is set
    if (!correctCode) {
      console.error('DASHBOARD_ACCESS_CODE environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Verify the code (case-insensitive comparison)
    if (code.trim().toUpperCase() === correctCode.toUpperCase()) {
      // Generate a secure token
      const token = crypto.randomBytes(32).toString('hex');
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          valid: true,
          token: token,
          message: 'Access granted'
        })
      };
    } else {
      // Invalid code
      return {
        statusCode: 401,
        body: JSON.stringify({
          valid: false,
          message: 'Invalid access code'
        })
      };
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};