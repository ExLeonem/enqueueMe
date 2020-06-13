const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const Storage = require('../../core/storage');
const MessageMock = require('../../core/messageMock');
const defintions = require('../../commands/definitions.json');
const Formatter = require('../../core/formatter');
const List = require('../../commands/list');

const listCommand = new List("list");
const storage = Storage.getInstance();


/**
 * Create a mock user entry for storage queue
 * 
 * @param {number} id Unique identifier of the user
 * @param {string} name The user name
 * @param {string} discriminator The discord tag
 * @return {Object} A mock of a user object included inside the storage queue.
 */
function mockUser(id, name, discriminator) {

    return {
        "id": id,
        "name": name,
        "discriminator": discriminator,
        "time": Date.now()
    };
}


/**
 * Mock the storage queue object
 * 
 * @param {Object[]} args Multiple arguments all represnting a user.
 * @return {Object} A mock of the storage queue.  
 */
function mockStorageQueue() {
    let queue = {member: [], count: 0};

    // Users passed to the function
    if (arguments.length == 0) {
        return queue;
    }


    queue.member = Array.from(arguments);
    queue.count = queue.member.length;
    return queue;
}


// Reset the queue before each test
beforeEach(() => {
    storage.set("queue", {});
});


test("Empty queue", () => {
    
    let guildId = 2342342;
    let userId = 12314;
    let message = new MessageMock()
        .setUser(userId, "Max Mustermann", "23423")
        .setGuild(guildId, "test")
        .setChannel("member", "bot")
        .addChannel("member", "bot")
        .create();

    let actual = listCommand.execute(message);
    let expected = listCommand.getResponse("enqueueFirst", userId);
    expect(actual).toBe(expected);
});


test("Not in line", () => {

    let guildId = 2342342;
    let firstUser = mockUser(12312, "John Doe", "234234");
    let secondUser = mockUser(32432, "Linda Lindner", "5234");
    let queue = mockStorageQueue(firstUser, secondUser);
    storage.set("queue." + guildId, queue);

    let userId = 12314;
    let message = new MessageMock()
        .setUser(userId, "Max Mustermann", "23423")
        .setGuild(guildId, "test")
        .setChannel("member", "bot")
        .addChannel("member", "bot")
        .create();

    let actual = listCommand.execute(message);
    let expected = listCommand.getResponse("notInLine", userId);
    expect(actual).toBe(expected);
});



test("Next in line", () => {

    let guildId = 2342342;
    let callingUserId = 234234;
    let firstUser = mockUser(callingUserId, "Max Mustermann", "2342");
    let secondUser = mockUser(35234, "John Doe", "034223");
    let thirdUser = mockUser(30504, "Linda Lindner", "30242");
    let queue = mockStorageQueue(firstUser, secondUser, thirdUser);
    storage.set("queue." + guildId, queue);

    let message = new MessageMock()
        .setUser(callingUserId, "Max Mustermann", "23423")
        .setGuild(guildId, "test")
        .setChannel("member", "bot")
        .addChannel("member", "bot")
        .create();

    let response = listCommand.execute(message);
    let expected = listCommand.getResponse("nextUp", callingUserId);
    expect(response).toBe(expected);
});


test("Multiple members in queue, last position", () => {

    let guildId = 2342342;
    let callingUserId = 234234;
    let secondUser = mockUser(35234, "John Doe", "034223");
    let thirdUser = mockUser(30504, "Linda Lindner", "30242");
    let firstUser = mockUser(callingUserId, "Max Mustermann", "2342");
    let queue = mockStorageQueue(thirdUser, secondUser, firstUser);
    storage.set("queue." + guildId, queue);

    let message = new MessageMock()
        .setUser(callingUserId, "Max Mustermann", "23423")
        .setGuild(guildId, "test")
        .setChannel("member", "bot")
        .addChannel("member", "bot")
        .create();

    let actual = listCommand.execute(message);
    let expected = listCommand.getResponse("membersBefore", callingUserId, queue.count - 1);
    expect(actual).toBe(expected);
});

test("Multiple members in queue, center position", () => {

    let guildId = 2342342;
    let callingUserId = 234234;
    let secondUser = mockUser(35234, "John Doe", "034223");
    let firstUser = mockUser(callingUserId, "Max Mustermann", "2342");
    let thirdUser = mockUser(30504, "Linda Lindner", "30242");
    let queue = mockStorageQueue(thirdUser, firstUser, secondUser);
    storage.set("queue." + guildId, queue);

    let message = new MessageMock()
        .setUser(callingUserId, "Max Mustermann", "23423")
        .setGuild(guildId, "test")
        .setChannel("member", "bot")
        .addChannel("member", "bot")
        .create();

    let actual = listCommand.execute(message);
    let expected = listCommand.getResponse("membersBefore", callingUserId, 1);
    expect(actual).toBe(expected);
});


test("Block direct message", () => {

    let userId = 123123;
    let message = new MessageMock().mockDirectMessage(userId, "Max Mustermann", "23423");
    let actual = listCommand.execute(message);
    let expected = Formatter.format(defintions._defaults_.directMessage, userId);
    expect(actual).toBe(expected);
});


test("Block message from wrong channel", () => {

    let userId = 1323423;
    let message = new MessageMock().mockIllegalMessage(userId, "Max Mustermann", "23423");
    let actual = listCommand.execute(message);
    let expected = Formatter.format(defintions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});