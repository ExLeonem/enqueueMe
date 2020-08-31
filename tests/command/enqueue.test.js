const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const { getConfig, writeConfig } = require('../../core/testUtils');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const MessageMock = require('../../core/messageMock');

const Listen = require('../../commands/listen');
const Enqueue = require('../../commands/enqueue');

let listen = new Listen("listen");
let enqueue = new Enqueue("enqueue");
let storage = Storage.getInstance();


const cachedConfig = getConfig();


// Setup the config.json before test execution
beforeAll(() => {
    writeConfig({
        ...cachedConfig,
        channels: {
            category: "bot",
            member: "member",
            admin: "admin"
        }
    });

});


// Reset the config file
afterAll(() => {
    writeConfig(cachedConfig);
    storage.set("queue", {})

});


test("Valid category, valid channel, first enqueue", () => {

    let message = new MessageMock()
        .setUser(1234, "Max Mustermann", "1323")
        .setGuild(23252, "Test")
        .addChannel("member", "bot")
        .setChannel("member", "bot")
        .create();


    let actual = enqueue.execute(message, []);
    let expected = Formatter.format(definitions.enqueue.responses.enqueue, message.member.id)
    expect(actual).toBe(expected);
});


test("Valid category, valid channel, alreay in queue", () => {

    let message = new MessageMock()
        .setUser(1234, "John Doe", "20384")
        .setGuild(23423, "Test")
        .addChannel("member", "bot")
        .setChannel("member", "bot")
        .create();
        
    enqueue.execute(message, []);
    let actual = enqueue.execute(message, []);

    let expected = Formatter.format(definitions.enqueue.responses.alreadyQueued, message.member.id)
    expect(actual).toBe(expected);
});


test("Valid category, valid channel, enqueue from different server", () => {

    let userId = 1234, userName = "John Doe", disc = "230234";
    let guildId = 2342, guildName = "Test";
    let firstMessage = new MessageMock()
        .setUser(userId, userName, disc)
        .setGuild(guildId, guildName)
        .addChannel("member", "bot")
        .setChannel("member", "bot")
        .create();

    enqueue.execute(firstMessage, []);
    
    let secondMessage = new MessageMock()
        .setUser(userId, userName, disc)
        .setGuild(guildId+1, "Some")
        .addChannel("member", "bot")
        .setChannel("member", "bot")
        .create();

    let actual = enqueue.execute(secondMessage, []);
    let expected = Formatter.format(definitions.enqueue.responses.enqueue, secondMessage.member.id);
    expect(actual).toBe(expected);
});


test("Direct message to bot", () => {

    let message = new MessageMock()
        .setDirect()
        .setUser(2342, "John Doe", "2342")
        .create();

    let actual = enqueue.execute(message, []);
    let expected = Formatter.format(definitions._defaults_.directMessage, message.author.id);
    expect(actual).toBe(expected);
});


test("Valid category wrong channel", () => {

    let message = new MessageMock()
        .setUser(12323, "John Doe", "2342")
        .addChannel("member", "bot")
        .addChannel("admin", "bot")
        .setChannel("some", "bot")
        .create();

    let actual = enqueue.execute(message);
    let expected = Formatter.format(definitions._defaults_.wrongChannel, 12323);

    expect(actual).toBe(expected);
});


test("Category exists, channel does not", () => {

    let userId = 12343;
    let message = new MessageMock()
        .setUser(userId, "John Doe", "34234")
        .addChannel("some", "bot")
        .addChannel("admin", "bot")
        .setChannel("some", "default")
        .create();


    let actual = enqueue.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelNonExistent, userId);

    expect(actual).toBe(expected);
});


test("Category and channel do not exist.", () => {

    let userId = 12342;
    let message = new MessageMock()
        .setUser(userId, "John Doe", "23423")
        .addChannel("member", "some")
        .addChannel("another", "some")
        .setChannel("another", "some")
        .create();

    let actual = enqueue.execute(message);
    let expected = Formatter.format(definitions._defaults_.categoryNonExistent, userId);
    
    expect(actual).toBe(expected);
});


test("Wrong category/channel but server is configured right.", () => {

    let userId = 12312;
    let message = new MessageMock()
        .setUser(userId, "John Doe", "23423")
        .addChannel("member", "bot")
        .addChannel("admin", "bot")
        .addChannel("some", "other")
        .setChannel("some", "other")
        .create();

    let actual = enqueue.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelConfig, userId);

    expect(actual).toBe(expected);
});


test("Enqueue while admin is listening to queue", () => {

    storage.set("admin", {});
    let guildId = 53423;
    let adminId = 234234;
    let listenMessage = new MessageMock()
        .setUser(adminId, "John Doe", "23423")
        .setGuild(guildId)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();
    listen.execute(listenMessage, []);

    let mockCallback = jest.fn(x => x);
    let userId = 45233;
    let enqueueMessage = new MessageMock()
        .setUser(userId, "Max Mustermann", "234253")
        .setGuild(guildId)
        .addMember(mockCallback, adminId)
        .addChannel("member", "bot")
        .setChannel("member", "bot")
        .create();

    enqueue.execute(enqueueMessage)
    expect(mockCallback.mock.calls.length).toBe(1);
});
