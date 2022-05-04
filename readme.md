# Star Wars Day Bot
A fun Slack App to spit out various Star Wars related content throughout the day on May 4th!

## Installation / Set up
### Environment Variables
1. Create a `.env` file using the values from `.env-sample` as a starter.
2. Get the [Slack Bot Token](https://api.slack.com/apps/A03EA4GSY6M/oauth?success=1#bot-token-container) and set it to the `SLACK_BOT_TOKEN` variable. [Screenshot](./readme/bot-token.png)
3. Get the [Client Secret](https://api.slack.com/apps/A03EA4GSY6M/general?#change_secret_form_3486152916225) and set it to the `SLACK_SIGNING_SECRET` variable. [Screenshot](./readme/client-secret.png)
4. Set the `START_DATE` variable.
    * This is the date and time that you want the first message to post to Slack. 
    * This must be in the format `Y-m-d H:m:s` or the function will not schedule the messages. 
    * Example: Set to `2022-05-04 9:00:00` if you want to schedule messages to post on May 4th, 2022 starting at 9 am.
5. Set the `CHANNEL_ID` variable.
    * This is the ID of the specific channel you want this Slack App to post to. 
    * You can get the channel ID of any channel by clicking on the channel name, then scrolling to the [bottom of the dialog box](./readme/channel-id.png).
6. Set the `SCHEDULE_OFFSET` variable.
    * This is the number of minutes between each message post.
    * This must be a number.

### Install
1. Run `npm install`

## Usage
### Scheduling Messages
Once you have set everything up, you are ready to schedule the messages.
1. Run either `node app.js` or `npm run schedule`
2. Once successfully run, a log file will save in `./logs/log-{unix-timestamp}.log`
    * Example: `./logs/log-1651641319.log`

### Deleting Messages
Woopsies happen. This is why we have logs 😜.
Here's how to delete messages that have already been scheduled.
1. Locate the log that contains the schedule(s) you want to delete. You'll find it in the `./logs/` directory.
2. Locate the `toDelete.js` file.
3. You can either delete everything, or choose what to delete.
    1. Delete everything
       1. Copy the entire log file.
       2. Navigate to `toDelete.js`.
       3. Delete the empty `[]`.
       4. Paste the log file array where the empty array previously was located.
    2. Choose what to delete
       1. Copy the full log object(s) you want to delete into the `toDelete.js` array. 
       2. Make sure that it contains the `scheduled_message_id` parameter. If it doesn't...this will fail!
       3. Run the new [JSON array through a validator just in case](https://jsonlint.com/).
4. Run either `node delete.js` or `npm run delete`
5. Once successfully run, a log file will save in `./logs/deleted-{unix-timestamp}.log`
   * Example: `./logs/delete-1651641282.log`

## Gotchas & Known Issues
1. The first scheduled post runs at the desired time + the offset. Meaning if you want to have the schedule start at 9:00 am and your offset is 30 minutes, you need to have your start time at 8:30 am.
2. All times are in Central Time (America/Chicago).