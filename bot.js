const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const StringSimiliarity = require('./core/string_similiary');
const Storage = require('./core/storage');
const commandDefinitions = require('./commands/definitions.json');

// Init the discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Initialize all commands of the command directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let storage = new Storage();
for (const file of commandFiles) {
  const Command = require(`./commands/${file}`);
  let fileNameStripped = file.split(".")[0];

  const initCommand = new Command(storage, fileNameStripped).getCommand() 
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


  // Iterate over commands defined in ./definitions.json
  let fileNames = Object.keys(commandDefinitions);
  let commandFound = false;
  let commandNames = [];
  for (fileName of fileNames) {
    let commandDef = commandDefinitions[fileName];

    if (command == commandDef.name) {
      client.commands.get(command).execute(message, args);
      commandFound = true;
      break;
    }

    commandNames.push(commandDef.name);
  }


  // Command doesen't match any definitions, give help to user
  if (!commandFound) {
    

  }
});


client.login(token);
