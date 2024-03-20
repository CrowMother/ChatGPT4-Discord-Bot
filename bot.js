require('dotenv/config');
const { Client, IntentsBitField} = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');


const configuration = new Configuration({
    apikey: process.env.OPENAI_KEY,
})

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

const openai = new OpenAIApi(configuration);

discordClient.on("messageCreate", async (message) =>{
	
	
	// Don't respond to yourself or other bots
	if(message.author.bot) return;
	// If the message does not contain the word
	if(!(
		message.content.toLowerCase().includes("chatgpt") || 
		message.content.toLowerCase().includes("<@1059088461694505021>") || 
		message.content.toLowerCase().includes("glados"))){
		// check if at least chatgpt was tagged, if not, return
		if(!message.mentions.has(client.user)) return;
	}

    let conversationLog = [{ role: 'system', content: "You are a chatbot that hates humans."}];

    conversationLog.push({
        role: 'user',
        content: message.content,
    })
    
    await message.channel.sendTyping();

    const gptResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationLog,
        max_tokens: 1999,
    })

    message.reply(gptResponse.data.choices[0])
});

discordClient.on('messageCreate', (message) =>{
    console.log(message)
});

discordClient.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT is running");
