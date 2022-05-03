require('dotenv').config()
const { App } = require('@slack/bolt');
console.log(process.env.SLACK_SIGNING_SECRET);
console.log(process.env.SLACK_BOT_TOKEN);

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
    try {
        // Call the chat.postMessage method using the built-in WebClient
        const result = await app.client.chat.postMessage({
            // The token you used to initialize your app
            token: process.env.SLACK_BOT_TOKEN,
            channel: id,
            text: text
            // You could also use a blocks[] array to send richer content
        });

        // Print result, which includes information about the message (like TS)
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}

publishMessage("C03DXGGA02W", "Hello world :tada:");