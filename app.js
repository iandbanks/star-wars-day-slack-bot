require('dotenv').config();
const {App} = require('@slack/bolt');
const moment = require("moment");
require('moment-timezone');
const facts = require('./facts');
const fs = require('fs').promises;

/*console.log(process.env.SLACK_SIGNING_SECRET);
console.log(process.env.SLACK_BOT_TOKEN);
console.log(facts.length);*/

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

// Unix timestamp for tomorrow morning at 9AM
const today = moment.tz('2022-05-03 14:20', 'America/Chicago').unix();
//console.log(today);
const now = moment.tz("America/Chicago");


// Channel you want to post the message to
const channelId = "C029BEVUX";

async function publishMessage(channelId, blocks, text, time, attempt) {

    try {
        // Call the chat.scheduleMessage method using the WebClient
        const result = await app.client.chat.scheduleMessage({
            channel: channelId,
            text: text,
            //text:"",
            blocks: blocks,
            // Time to post message, in Unix Epoch timestamp format
            post_at: time
        });

        console.log(result);
        log.push(result);
        //console.log(`${attempt}  | ${facts.length}`);
        if (attempt === facts.length) {
            exit();
        }
    } catch (error) {
        console.error(error);
        errors.push(error);
        //console.log(`${attempt}  | ${facts.length}`);
        if (attempt === facts.length) {
            exit();
        }
    }
}

for (let i = 0; i < facts.length; i++) {
    let attempt = i + 1;
    let time = now.add(30, "seconds");
    let schedule = time.unix();
    publishMessage("C03DXGGA02W", facts[i].blocks, facts[i].text, schedule, attempt);
    //console.log(facts[i],time.format('Y-m-d H:m:s'));

        break;

}

function exit() {
    //fs.writeFile('./log-'+ moment().tz("America/Chicago").format("Y-m-d-H-m-s")+'.json',log).then(()=>{
    fs.writeFile('log.json', JSON.stringify(log))
        .then((response) => {
            process.exit();
        }).catch((e) => {
        process.exit();
    })

}