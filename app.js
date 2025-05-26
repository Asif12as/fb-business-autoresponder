const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // Choose a unique string
const TEST_USER_PSID = process.env.TEST_USER_PSID; // Your Facebook ID or test user ID

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Webhook event handling endpoint
app.post('/webhook', (req, res) => {
  const body = req.body;
  
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      console.log('Webhook event received:', JSON.stringify(webhookEvent, null, 2));
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Send message endpoint
app.post('/send', async (req, res) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/me/messages`,
      {
        recipient: { id: TEST_USER_PSID },
        message: { text: 'Hello from my bot' }
      },
      {
        params: { access_token: PAGE_ACCESS_TOKEN }
      }
    );
    console.log('Message sent successfully:', response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});