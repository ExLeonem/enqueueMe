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



test("get general help", () => {

    let actual = help.execute(message, []);
    let expected = help.getHelpOverview(userId);

    expect(actual).toBe(expected);
});


test("too many arguments", () => {
    
    let args = ["qme", "cancel"]
    let actual = help.execute(message, args)
    let expected = help.getCommandHelp(args, userId);

    expect(actual).toBe(expected);
});


test("existing specific command", () => {

    let args = ["qme"];
    let actual = help.execute(message, args)
    let expected = Formatter.format(defintions.help.responses.enqueue, userId, defintions.enqueue.name);

    expect(actual).toBe(expected);
});


test("not existent specific command", () => {

    let args = ["something"];
    let actual = help.execute(message, args)
    let expected = Formatter.format(defintions.help.responses.noSuchCommand, userId);

    expect(actual).toBe(expected);
});


test("not existent help text for existent command", () => {

    // needs extension of defintions.json on test-suit run
});