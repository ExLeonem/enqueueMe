const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const Help = require('../../commands/help');
const defintions = require('../../commands/definitions.json');
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
    let expected = Formatter.format(defintions.help.responses.enqueue, userId, defintions.enqueue.name);

    expect(actual).toBe(expected);
});


test("Not existent specific command", () => {

    let args = ["something"];
    let actual = help.execute(message, args)
    let expected = Formatter.format(defintions.help.responses.noSuchCommand, userId);

    expect(actual).toBe(expected);
});


test("Trying to contact from not configured channel/category", () => {

    let userId = 23423;
    let message = new MessageMock().mockIllegalMessage(userId, "Max Mustermann", "203423");
    let actual = help.execute(message);
    let expected = Formatter.format(defintions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});