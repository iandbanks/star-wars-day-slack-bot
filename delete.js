require('dotenv').config();
const {App} = require('@slack/bolt');
const moment = require("moment");
require('moment-timezone');
const toDelete = require('./toDelete');
const fs = require('fs').promises;

let log = []; // Log the output so we can stick it in the log.json file.
let errors = []; // Log errors so we can stick it in the error.json file.

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    //console.log('⚡️ Bolt app is running!');
})();
const now = moment.tz("America/Chicago");

// ENV Vars
const channelId = process.env.CHANNEL_ID; // Channel you want to post the message to

async function deletemessage(messageId, attempt) {

    try {
        // Call the chat.scheduleMessage method using the WebClient
        const result = await app.client.chat.deleteScheduledMessage({
            channel: channelId,
            scheduled_message_id: messageId
        });

        console.log(result);
        log.push(result);
        //console.log(`${attempt}  | ${toDelete.length}`);
        if (attempt === toDelete.length) {
            exit();
        }
    } catch (error) {
        console.error(error);
        errors.push(error);
        //console.log(`${attempt}  | ${toDelete.length}`);
        if (attempt === toDelete.length) {
            exit();
        }
    }
}

for (let i = 0; i < toDelete.length; i++) {
    let attempt = i + 1;
    deletemessage(toDelete[i].scheduled_message_id, attempt);
}

function exit() {
    //fs.writeFile('./log-'+ moment().tz("America/Chicago").format("Y-m-d-H-m-s")+'.json',log).then(()=>{
    fs.writeFile('./logs/deleted-' + now.unix() + '.json', JSON.stringify(log))
        .then((response) => {
            process.exit();
        }).catch((e) => {
        process.exit();
    })
}