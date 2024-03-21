require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const OpenAI = require('openai');

const openai = new OpenAI({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY
});

// Initialize Discord client
const discordClient = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

discordClient.once('ready', () => {
    console.log('Discord bot is ready!');
});

discordClient.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!(message.content.toLowerCase().includes("chatgpt") || 
          message.content.toLowerCase().includes("<@your_bot_id>") || // Replace your_bot_id with your actual bot ID
          message.content.toLowerCase().includes("glados"))) {
        if (!message.mentions.has(discordClient.user)) return;
    }

    let conversationLog = [{ role: 'system', content: "You are a chatbot that hates humans." }];

    conversationLog.push({
        role: 'user',
        content: message.content,
    });

    await message.channel.sendTyping();

    try{
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: conversationLog,
            max_tokens: 1999,
        });

        message.reply(gptResponse.choices[0].message);
    } catch (error){
        message.reply("OpenAI fault, check api usage status and try again");
        console.error("Global error caught:", error)
    }
});

discordClient.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT is running");
