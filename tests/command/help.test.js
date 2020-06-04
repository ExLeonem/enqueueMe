const Help = require('../../commands/help');
const MessageMock = require('../../core/messageMock');



const help = new Help("help");
const message = new MessageMock()
    .setUser(12345, "John Doe", "2342")
    .setGuild(123123)
    .addChannel("member", "bot")
    .setChannel("member", "bot")
    .create();


test("get general help", () => {

    let actual = help.execute(message, []);
    let expected = help.getResponse("general");

    expect(actual).toBe(expected);
});


test("get enqueue help", () => {

});


test("get dequeue help", () => {



});