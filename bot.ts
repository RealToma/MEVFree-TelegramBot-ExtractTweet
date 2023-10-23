require('dotenv').config();
const { Bot, session } = require("grammy");
const { shortAddress, shortDate, fetchTokenData } = require("./utils/functions");
const Twit = require('twit');

// Create a new Grammy bot
const bot = new Bot(process.env.API_KEY_TELEGRAM_BOT);

// Create a new Twitter client
const twitterClient = new Twit({
    consumer_key: 'YOUR_TWITTER_CONSUMER_KEY',
    consumer_secret: 'YOUR_TWITTER_CONSUMER_SECRET',
    access_token: 'YOUR_TWITTER_ACCESS_TOKEN',
    access_token_secret: 'YOUR_TWITTER_ACCESS_TOKEN_SECRET'
});


bot.use(session());

bot.use(async (ctx: any, next: any) => {
    // Your code to handle incoming messages
    await next();
});


// bot.command('start', (ctx: any) => {
//     const html: any = `
//             <b>Welcome to Thomas's TweetInfo Bot!</b>\n
// If you need help, please enter "/help".
// Enjoy your time...Thanks.
//               `;
//     ctx.reply(html, { parse_mode: "HTML" });
// });

bot.on('message', async (ctx: any) => {
    var currentDate = new Date();
    var currentTime = currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
    console.log(`Event Time: ${ctx.message.text} (${currentTime})`)
    let textCommand = ctx.message.text.split(' ')[0];

    try {
        if (textCommand === '/start') {
            const html: any = `
            <b>Welcome to Thomas's TweetInfo Bot!</b>\n
If you need help, please enter "/help".
Enjoy your time...Thanks.
          `;
            ctx.reply(html, { parse_mode: "HTML" });
        }
        else if (textCommand === '/help') {
            const html: any = `
            <b>Commands:</b>\n
<i><b>/start</b></i>: Start a bot.
<i><b>/tweet [ID]</b></i>: Display tweet's information by ID.
<i><b>/help</b></i>: Display command instructions.
          `;

            ctx.reply(html, { parse_mode: "HTML" });
        }
        else if (textCommand === '/tweet') {
            // get tweet's id from command text
            let tweetId = ctx.message.text.split(' ')[1];
            // console.log("tweetId:", tweetId);

            const { data: tweet } = await twitterClient.get('statuses/show/:id', {
                id: tweetId,
                tweet_mode: 'extended'
            });

            // Extract the tweet text and user name
            const tweetText = tweet.full_text;
            const userName = tweet.user.name;

            // Reply with the tweet information
            ctx.reply(`@${userName}: ${tweetText}`);
        }
        else {
            ctx.reply("This command is not listed. If you need help, please enter '/help'.");
        }
    }

    catch (error) {
        console.log("error-telegrambot:", error);

        ctx.reply('Sorry, an error occurred while fetching the tweet information.');
    }
});


bot.start();


