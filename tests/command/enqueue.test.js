const { mockMessage, getConfig, writeConfig } = require('../../core/testUtils');
const Enqueue = require('../../commands/enqueue');
const Storage = require('../../core/storage');
const definitions = require('../../commands/definitions.json');

let storage = new Storage();
let enqueue = new Enqueue(storage, "enqueue");

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



test("Enqueue user", () => {

    let findElements = [
        {
            name: "member",
            parent: {
                name: "bot"
            }
        }
    ];

    let currentChannel = {
        name: "member",
        parent: {
            name: "bot"
        }
    }

    let message = mockMessage(1234, 23252, findElements, currentChannel);
    let actual = enqueue.execute(message, []);
    let expected = enqueue.formatResponse(definitions.enqueue.responses.enqueue, message.member.id)

    expect(actual).toBe(expected);
});


test("User already in queue", () => {

    enqueue.storage.set("queue", {});

    let findElements = [
        {
            name: "member",
            parent: {
                name: "bot"
            }
        }
    ];

    let currentChannel = {
        name: "member",
        parent: {
            name: "bot"
        }
    }

    let message = mockMessage(1234, 23252, findElements, currentChannel);
    enqueue.execute(message, []);
    let actual = enqueue.execute(message, []);

    let expected = enqueue.formatResponse(definitions.enqueue.responses.alreadyQueued, message.member.id)
    expect(actual).toBe(expected);
});


test("Same user different server", () => {

});


test("Don't allow direct messages", () => {

})

test("Wrong channel", () => {


});


test("Wrong category", () => {


});