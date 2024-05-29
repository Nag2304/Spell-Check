// Import necessary modules using CommonJS syntax
const express = require('express');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000; // Define the port the server will listen on

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Route to handle POST requests for spell checking
app.post('/spellcheck', async (req, res) => {
  const { text } = req.body; // Extract text from the request body
  console.log(text);

  // Set up query parameters for the API request
  const queryParams = querystring.stringify({
    q: text,
  });
  console.log(queryParams);

  // Set up options for the API request
  const requestOptions = {
    method: 'GET', // HTTP method
    headers: {
      apikey: process.env.API_KEY, // Add API key from environment variables
    },
  };
  console.log('API KEY: ' + process.env.API_KEY);

  try {
    // Make an API call to the spell checker service
    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        `https://api.apilayer.com/spell/spellchecker?${queryParams}`,
        requestOptions,
        (res) => {
          let data = '';

          // A chunk of data has been received.
          res.on('data', (chunk) => {
            data += chunk;
          });
          console.log(data);

          // The whole response has been received.
          res.on('end', () => {
            resolve(JSON.parse(data));
          });
        }
      );

      // Handle error
      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });

    // Send the result back to the client
    res.json(response);
  } catch (error) {
    // Handle any errors that occur during the API call
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
