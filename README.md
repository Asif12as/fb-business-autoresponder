# Facebook Messenger Bot

A simple, lightweight Facebook Messenger bot that allows automated responses on Facebook business pages. This project provides a foundation for building more complex conversational experiences on the Facebook Messenger platform.

## Features

- Webhook verification for Facebook Messenger Platform
- Webhook event handling for incoming messages
- API endpoint for sending messages to users
- Environment-based configuration
- Easy deployment to any Node.js hosting platform

## Technology Stack

- Node.js
- Express.js
- Facebook Messenger API
- Axios for HTTP requests
- dotenv for environment variable management

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)
- Facebook Developer Account
- Facebook Page (to connect the bot)
- HTTPS URL for webhook (use ngrok for local development)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fb-messenger-bot.git
   cd fb-messenger-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PAGE_ACCESS_TOKEN=your_page_access_token
   VERIFY_TOKEN=your_webhook_verify_token
   TEST_USER_PSID=your_test_user_id
   PORT=3001 # Optional, defaults to 3001
   ```

## Facebook Setup

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com/)
2. Add the Messenger product to your app
3. Generate a Page Access Token for your Facebook Page
4. Set up your webhook with the following:
   - Callback URL: `https://your-domain.com/webhook`
   - Verify Token: Same as your `VERIFY_TOKEN` in the .env file
   - Subscription fields: messages, messaging_postbacks, messaging_optins

## Running the Bot

### Local Development

1. Start the server:
   ```
   npm start
   ```

2. Use ngrok to expose your local server:
   ```
   ngrok http 3001
   ```

3. Update your webhook URL in the Facebook Developer Console with the ngrok URL

### Production Deployment

Deploy to your preferred hosting platform (Heroku, AWS, Azure, etc.) and set the environment variables accordingly.

## Usage

### Sending a Test Message

Use the `/send` endpoint to send a test message to your test user:

```
POST /send
```

The default implementation sends "Hello from my bot" to the user ID specified in `TEST_USER_PSID`.

### Customizing Responses

Modify the webhook event handling in `app.js` to implement custom responses based on user messages:

```javascript
app.post('/webhook', (req, res) => {
  const body = req.body;
  
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      const sender_psid = webhookEvent.sender.id;
      
      // Check if the event is a message
      if (webhookEvent.message) {
        handleMessage(sender_psid, webhookEvent.message);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Function to handle messages
function handleMessage(sender_psid, received_message) {
  let response;
  
  // Customize your response logic here
  if (received_message.text) {
    response = {
      "text": `You sent: "${received_message.text}". Now send me an attachment!`
    };
  }
  
  // Send the response
  callSendAPI(sender_psid, response);
}
```

## Security Notes

- Never commit your `.env` file to version control
- Rotate your Page Access Token periodically
- Use a strong, unique VERIFY_TOKEN
- Implement additional validation for incoming webhook events

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.