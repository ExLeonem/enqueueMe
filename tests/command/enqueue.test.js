const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const { getConfig, writeConfig } = require('../../core/testUtils');
const Enqueue = require('../../commands/enqueue');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const MessageMock = require('../../core/messageMock');

let storage = Storage.getInstance();
let enqueue = new Enqueue("enqueue");

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

    enqueue.storage.set("queue", {});

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

    enqueue.storage.set("queue", {});
    
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

    enqueue.storage.set("queue", {});
    
    let message = new MessageMock()
        .setDirect()
        .setUser(2342, "John Doe", "2342")
        .create();

    let actual = enqueue.execute(message, []);
    let expected = Formatter.format(definitions._defaults_.directMessage, message.author.id);
    expect(actual).toBe(expected);
});


test("Valid category wrong channel", () => {

    enqueue.storage.set("queue", {});
    
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

    enqueue.storage.set("queue", {});

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

    enqueue.storage.set("queue", {});

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

    enqueue.storage.set("queue", {});

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
