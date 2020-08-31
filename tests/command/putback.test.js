const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const PutBack = require('../../commands/putBack');


const putback = new PutBack("putBack");
const storage = Storage.getInstance();


/**
 * Create a mock of an inserted user object for the queue.
 * 
 * @param {number} id The unique user identifier
 * @param {string} name The name of the user
 * @param {string} discriminator The discriminator used by discord (aka tag)
 * @return {Object}
 */
function mockUser(id, name, discriminator) {

    return {
        id: id,
        name: name,
        discriminator: discriminator,
        time: Date.now()
    }
}


/**
 * Create a mock for the storage queue
 * 
 * @return {Object}
 */
function mockQueue() {

    let queue = {member: [], count: 0}
    if (arguments.length == 0) {
        return queue;
    }

    // Users passed as function arguments
    let members = [];
    queue.member = Array.from(arguments);
    queue.count = queue.member.length;
    return queue;
}


/**
 * Wait until performaing an action.
 * 
 * @param {*} ms 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


beforeEach(() => {
    storage.set("admin", {});
});


test("Block direct messages.", () => {

    let userId = 23423;
    let message = new MessageMock().mockDirectMessage(userId);
    let actual = putback.execute(message);
    let expected = Formatter.format(definitions._defaults_.directMessage, userId);
    expect(actual).toBe(expected);
});


test("Block messages from unconfigured channel/category.", () => {

    let userId = 23423;
    let message = new MessageMock().mockIllegalMessage(userId);
    let actual = putback.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});


test("Put back cached user", () => {

    let user = mockUser(2352432, "John Doe", "23523");
    let guildId = 562323;
    storage.set("queue." + guildId, {member: [], count: 0});
    let userId = 23425423;
    storage.set("admin." + guildId + "." + userId, {cachedMembers: user});
    
    let message = new MessageMock()
        .setUser(userId)
        .setGuild(guildId)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();
    
    let actual = putback.execute(message);
    let expected = putback.getResponse("success", userId, user.id);
    expect(actual).toBe(expected);
});


test("Put back user, when cache is empty" , () => {
    
    let guildId = 562323;
    let userId = 23425423;
        let message = new MessageMock()
        .setUser(userId)
        .setGuild(guildId)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();
    
    let actual = putback.execute(message);
    let expected = putback.getResponse("noUser", userId);
    expect(actual).toBe(expected);
});


test("Put back user into queue with multiple members", () => {

    let firstUser = mockUser(2352432, "John Doe", "23523");
    let secondUser = mockUser(64348, "Linda Lindner", "50204");
    secondUser.time = secondUser.time + 1;
    let thirdUser = mockUser(69947, "Sam Samuel", "209348");
    thirdUser.time = thirdUser.time + 2;

    let guildId = 562323;
    storage.set("queue." + guildId, {member: [firstUser, thirdUser], count: 0});
    let userId = 23425423;
    storage.set("admin." + guildId + "." + userId, {cachedMembers: secondUser});
    
    let message = new MessageMock()
        .setUser(userId)
        .setGuild(guildId)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();
    
    let actual = putback.execute(message);
    let expected = putback.getResponse("success", userId, secondUser.id);
    expect(actual).toBe(expected);
});


test("Put back already existing", () => {

    let firstUser = mockUser(2352432, "John Doe", "23523");
    let secondUser = mockUser(64348, "Linda Lindner", "50204");
    secondUser.time = secondUser.time + 1;

    let guildId = 562323;
    storage.set("queue." + guildId, {member: [firstUser, secondUser], count: 0});
    let userId = 23425423;
    storage.set("admin." + guildId + "." + userId, {cachedMembers: secondUser});
    
    let message = new MessageMock()
        .setUser(userId)
        .setGuild(guildId)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();
    
    let actual = putback.execute(message);
    let expected = putback.getResponse("success", userId, secondUser.id);
    expect(actual).toBe(expected);
});