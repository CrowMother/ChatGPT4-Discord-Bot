require('dotenv').config();
const OpenAI = require('openai');

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the message mentions the bot
  if (message.mentions.has(client.user)) {
    // Remove the mention from the message content
    const userInput = message.content.replace(`<@!${client.user.id}>`, '').trim();
    
    try {
      // Make the API call to OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4', // Use 'gpt-4' if you have access
        messages: [
          { role: 'system', content: 'You are a helpful assistant with a hint of humor' },
          { role: 'user', content: userInput },
        ],
      });

      // Send the assistant's reply to Discord
      const reply = completion.choices[0].message.content.trim();
      message.channel.send(reply);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      message.channel.send('Sorry, I encountered an error while processing your request.');
    }
  }
});


client.login(process.env.DISCORD_BOT_TOKEN);
