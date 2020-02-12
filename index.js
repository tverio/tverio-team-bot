const express = require('express')
const Telegraf = require('telegraf')

const app = express()

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
        webhookReply: false
    }
})

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

app.use(bot.webhookCallback('/callback'))

app.get('/', (req, res) => {
    res.send('ok')
})

app.get('/start', async (req, res) => {
    const url = `https://tverio-team-bot.now.sh/callback`
    await bot.telegram.setWebhook(url)
    res.send(url)
})

if (process.env.NODE_ENV === "development") {
    console.log('listening local')
    bot.launch()
}

app.listen(3000, () =>
    console.log('app running on 3000'))
