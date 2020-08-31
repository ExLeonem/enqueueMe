const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const Listen = require('../../commands/listen');

const listen = new Listen("listen");
const storage = Storage.getInstance();


beforeEach(() => {
    storage.set("admin", {});
});


test("Block direct message", () => {

    let userId = 2342;
    let message = new MessageMock().mockDirectMessage(userId, "Max Mustermann", "23423");
    let actual = listen.execute(message);
    let expected = Formatter.format(definitions._defaults_.directMessage, userId);
    expect(actual).toBe(expected);
});


test("Block message from unconfigured channel/category", () => {

    let userId = 23423;
    let message = new MessageMock().mockIllegalMessage(userId, "Max Mustermann", "32342");
    let actual = listen.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});


test("Listen to queue, which is currently empty", () => {

    storage.set("queue", {});
    let userId = 234234;
    let subscribeMessage = new MessageMock(userId)
        .setUser(userId)
        .setGuild(234234)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();

    
    let response = listen.execute(subscribeMessage, []);
    let expected = listen.getResponse("startListen", userId);
    expect(response).toBe(expected);
});


test("Stop listening", () => {

    storage.set("queue", {});
    let userId = 234234;
    let subscribeMessage = new MessageMock(userId)
        .setUser(userId)
        .setGuild(234234)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();
    
    listen.execute(subscribeMessage, []);
    let response = listen.execute(subscribeMessage, ["stop"]);
    let expected = listen.getResponse("stopListen", userId);
    expect(response).toBe(expected);
});


test("Already listening", () => {

    storage.set("queue", {});
    let userId = 234234;
    let subscribeMessage = new MessageMock(userId)
        .setUser(userId)
        .setGuild(234234)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();
    
    listen.execute(subscribeMessage, []);
    let response = listen.execute(subscribeMessage, []);
    let expected = listen.getResponse("alreadyListen", userId);
    expect(response).toBe(expected);
});