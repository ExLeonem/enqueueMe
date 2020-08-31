const fs = require('fs');
const process = require('process');
const path = require('path');

const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const Help = require('../../commands/help');
const definitions = require('../../commands/definitions.json');
const Formatter = require('../../core/formatter');
const MessageMock = require('../../core/messageMock');


let help = new Help("help");
let userId = 12345;
let message = new MessageMock()
    .setUser(userId, "John Doe", "2342")
    .setGuild(123123)
    .addChannel("member", "bot")
    .setChannel("member", "bot")
    .create();



/**
 * Append a command entry to the definitions.json file. For testing purposes.
 * 
 * @private
 * @param {string} commandName The name of the pseudo command to add
 */
function addCommand(commandName) {

    let filePath = path.join(process.cwd(), "commands", "definitions.json");
    let content = require(filePath);

    content[commandName] = {
        name: commandName,
        responses: {
            "none": "hey"
        }
    };

    fs.writeFileSync(filePath, JSON.stringify(content));
}


/**
 * Remove a command entry from the definitions.json file. For testing purposes.
 * 
 * @private
 * @todo Add normal formatting to out-writing json (destroys the formatting of definitions.json)
 * @param {string} commandName 
 */
function rmCommand(commandName) {

    let filePath = path.join(process.cwd(), "commands", "definitions.json");
    let content = require(filePath);

    delete content[commandName];
    fs.writeFileSync(filePath, JSON.stringify(content));
}


test("Get general help", () => {

    let actual = help.execute(message, []);
    let expected = help.getHelpOverview(userId);

    expect(actual).toBe(expected);
});


test("Too many arguments", () => {
    
    let args = ["qme", "cancel"]
    let actual = help.execute(message, args)
    let expected = help.getCommandHelp(args, userId);

    expect(actual).toBe(expected);
});


test("Existing specific command", () => {

    let args = ["qme"];
    let actual = help.execute(message, args)
    let expected = Formatter.format(definitions.help.responses.enqueue, userId, definitions.enqueue.name);

    expect(actual).toBe(expected);
});


test("Not existent specific command", () => {

    let args = ["something"];
    let actual = help.execute(message, args)
    let expected = Formatter.format(definitions.help.responses.noSuchCommand, userId);

    expect(actual).toBe(expected);
});


test("Trying to contact from not configured channel/category", () => {

    let userId = 23423;
    let message = new MessageMock().mockIllegalMessage(userId, "Max Mustermann", "203423");
    let actual = help.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});


test("Try retrieve help for non existent help", () => {

    // Setup the command key
    let commandName = "pseudo";
    addCommand(commandName);
    help = new Help("help");

    // Test
    let args = ["pseudo"];
    let actual = help.execute(message, args);
    let expected = Formatter.format(definitions.help.responses.noHelp, userId);
    expect(actual).toBe(expected);
    rmCommand(commandName);
});