const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const Dequeue = require('../../commands/dequeue');

let dequeue = new Dequeue("dequeue");
let storage = Storage.getInstance();


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


test("Block direct message", () => {

    let userId = 23423;
    let message = new MessageMock().mockDirectMessage(userId);
    let actual = dequeue.execute(message);
    let expected = Formatter.format(definitions._defaults_.directMessage, userId);
    expect(actual).toBe(expected);
});


test("Block messages from uncofigured channel", () => {

    let userId = 23423;
    let message = new MessageMock().mockIllegalMessage(userId);
    let actual = dequeue.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});


test("Queue is empty", () => {

    storage.set("queue", {});
    let userId = 34234;
    let message = new MessageMock() 
        .setUser(userId)
        .setGuild(23424)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create();

    let actual = dequeue.execute(message, []);
    let expected = dequeue.getResponse("queueEmpty", userId);
    expect(actual).toBe(expected);
});


test("Dequeu single person", () => {

    let guildId = 53243;
    let user = mockUser(234234, "John Doe", "234234");
    let queue = mockQueue(user);
    storage.set("queue." + guildId, queue);
    
    let message = new MessageMock()
        .setUser(2345243)
        .setGuild(guildId)
        .addChannel("admin", "bot")
        .setChannel("admin", "bot")
        .create()

    let actual = dequeue.execute(message);
    let expected = dequeue.getResponse("nextUp", user.id);
    expect(actual).toBe(expected);
});