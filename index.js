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

bot.start((ctx) => ctx.reply('Welcome to Tver.io Team Bot'))
bot.help((ctx) => {
    ctx.reply('Create short link: /link <destination> <slashtag>')
});

bot.command('link',  (ctx) => {
    const {reply, message} = ctx;
    const splittedMessage = message.text.split(" ");
    const destination = splittedMessage[1];
    const slashtag = splittedMessage[2];
    rebrandlyClient.links.create({
        destination,
        slashtag,
        domain: {
            fullName: "go.tver.io"
        }
    }).then((result) => {
        reply(result.shortUrl);
    });
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
