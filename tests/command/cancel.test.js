const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const Enqueue = require('../../commands/enqueue');
const Cancel = require('../../commands/cancel');


const cancel = new Cancel("cancel");
const enqueue = new Enqueue("enqueue");
const storage = new Storage();



test("Cancel enqeued user", () => {
    
    storage.set("queue", {})

    let userId = 12314;
    let guildId = 12312;
    let message = new MessageMock()
        .setUser(userId, "John Doe", "234234")
        .setGuild(guildId)
        .addChannel("member", "bot")
        .addChannel("admin", "bot")
        .setChannel("member", "bot")
        .create();

    
    enqueue.execute(message);
    let actual = cancel.execute(message);
    let expected = cancel.getResponse("removedUser", userId);

    expect(actual).toBe(expected);
});


test("Cancel user who is not enqueued", () =>  {

    storage.set("queue", {});

    let userId = 12341;
    let guildId = 12312;
    let message = new MessageMock()
        .setUser(userId, "John Doe", "3243")
        .setGuild(guildId)
        .addChannel("member", "bot")
        .setChannel("member", "bot")
        .create();


    let actual = cancel.execute(message);
    let expected = cancel.getResponse("notInQueue", userId);

    expect(actual).toBe(expected);
});



// test("Cancel on un-initialized queue", () => {

//     // content of queue.json = {}
//     storage.set("queue", {});
// });


test("Block direct messages.", () => {

    let userId = 2342;
    let message = new MessageMock().mockDirectMessage(userId);
    let actual = cancel.execute(message);
    let expected = Formatter.format(definitions._defaults_.directMessage, userId);
    expect(actual).toBe(expected);
});


test("Block messages from uncofigured channels", () => {

    let userId = 2342;
    let message = new MessageMock().mockIllegalMessage(userId);
    let actual = cancel.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});