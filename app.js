require('dotenv').config();
const {App} = require('@slack/bolt');
const moment = require("moment");
require('moment-timezone');
const facts = require('./facts');
const fs = require('fs').promises;

/*console.log(process.env.SLACK_SIGNING_SECRET);
console.log(process.env.SLACK_BOT_TOKEN);
console.log(facts.length);*/
//console.log(facts.length);

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

// ENV Vars
const channelId = process.env.CHANNEL_ID; // Channel you want to post the message to
const startDate = process.env.START_DATE;
const scheduleOffset = process.env.SCHEDULE_OFFSET;

const now = moment.tz("America/Chicago");
const start = moment.tz(startDate,"Y-M-D H:m:s","America/Chicago");



async function publishMessage(blocks, text, time, attempt) {

    try {
        // Call the chat.scheduleMessage method using the WebClient
        const result = await app.client.chat.scheduleMessage({
            channel: channelId,
            text: text,
            blocks: blocks,
            // Time to post message, in Unix Epoch timestamp format
            post_at: time
        });

        console.log(result);
        log.push(result);
        if (attempt === facts.length) {
            exit();
        }
    } catch (error) {
        console.error(error);
        errors.push(error);
        if (attempt === facts.length) {
            exit();
        }
    }
}

for (let i = 0; i < facts.length; i++) {
    let attempt = i + 1;
    let time = start.add(scheduleOffset, "minutes");
    let schedule = time.unix();

    publishMessage( facts[i].blocks, facts[i].text, schedule, attempt); // Water Cooler

}

function exit() {
    //fs.writeFile('./log-'+ moment().tz("America/Chicago").format("Y-m-d-H-m-s")+'.json',log).then(()=>{
    fs.writeFile('log-'+now.unix()+'.json', JSON.stringify(log))
        .then((response) => {
            process.exit();
        }).catch((e) => {
        process.exit();
    })

}