const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const StringSimiliarity = require('./core/string_similiary');
const Storage = require('./core/storage');

// Init the discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Initialize all commands of the command directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let storage = new Storage();
for (const file of commandFiles) {
  const Command = require(`./commands/${file}`);
  
  const initCommand = new Command(storage).getCommand() 
	client.commands.set(initCommand.name, initCommand);
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('Bot is ready. Listening to messages!');
});



client.on('message', message => {

  // message not from bot/not a prefix command used
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  console.log("User uses command directive form.")
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

    // Uncomment for debugging
  console.log("Command: " + command);
  console.log("Arguments: " + JSON.stringify(args));

  // Commands to be executed
  if (command === 'qme') {
    client.commands.get('qme').execute(message, args);

  } else if (command === 'next') {
    client.commands.get('next').execute(message, args);

  }  else if (command === 'cancel') {
    client.commands.get('cancel').execute(message, args);

  } else if (command === 'list') {
    client.commands.get('list').execute(message, args);

  } else if (command === 'pushBack') {
    client.commands.get('pushBack').execute(message, args);
    
  } else if (command === 'help') {
    client.commands.get('help').execute(message, args);
    
  }

});


client.login(token);
