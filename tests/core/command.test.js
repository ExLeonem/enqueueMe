const Command = require('../../core/command');
const MessageMock = require('../../core/messageMock');


const command = new Command("test");

test("Test stub execution", () => {

    let message = new MessageMock().setChannel("member", "bot").create();
    let actual = command.execute(message);
    expect(actual).toBe("Execute template");
});



test("Retrieve command object representation", () => {

    let commandObject = command.getCommand();
    let messageMock = {
        name: "test",
        execute(message, args) {
            return command.execute(message, args);
        }
    };

    expect(JSON.stringify(commandObject)).toBe(JSON.stringify(messageMock));
});



test("Execute function of object the same as of extracted object representation", () => {

    let commandObj = command.getCommand();
    let message = new MessageMock().setChannel("member", "bot").create();

    expect(commandObj).toHaveProperty("execute");
    expect(commandObj.execute(message)).toBe(command.execute(message));
});
