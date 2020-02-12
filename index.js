const express = require('express');
const Telegraf = require('telegraf');
const Rebrandly = require("rebrandly");

const rebrandlyClient = new Rebrandly({
    apikey: process.env.REBRANDLY_TOKEN
});

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
        webhookReply: false
    }
});

bot.command('link', async (ctx) => {
    const {reply, message} = ctx;
    const splittedMessage = message.text.split(" ");
    const destination = splittedMessage[1];
    const slashtag = splittedMessage[2];
    const result = await rebrandlyClient.links.create({
        destination,
        slashtag
    });
    reply(result);
});

app.use(bot.webhookCallback('/callback'));

app.get('/', (req, res) => {
    res.send('ok')
});

app.get('/start', async (req, res) => {
    const url = `https://tverio-team-bot.now.sh/callback`;
    await bot.telegram.setWebhook(url);
    res.send(url)
});

if (process.env.NODE_ENV === "development") {
    console.log('listening local');
    bot.launch()
}

app.listen(3000, () =>
    console.log('app running on 3000'));
