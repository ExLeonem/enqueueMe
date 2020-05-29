const { mockMessage, mockDirectMessage, getConfig, writeConfig } = require('../../core/testUtils');
const Enqueue = require('../../commands/enqueue');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');

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
    let actual = enqueue.call(message, []);
    let expected = Formatter.format(definitions.enqueue.responses.enqueue, message.member.id)
    expect(actual).toBe(expected);
});


test("Valid category, valid channel, alreay in queue", () => {

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
    enqueue.call(message, []);
    let actual = enqueue.call(message, []);

    let expected = Formatter.format(definitions.enqueue.responses.alreadyQueued, message.member.id)
    expect(actual).toBe(expected);
});


test("Valid category, valid channel, enqueue from different server", () => {

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

    let firstMessage = mockMessage(1234, 23252, findElements, currentChannel);
    enqueue.call(firstMessage, []);
    
    let secondMessage = mockMessage(1235, 23252, findElements, currentChannel);
    let actual = enqueue.call(secondMessage, []);
    let expected = Formatter.format(definitions.enqueue.responses.enqueue, secondMessage.member.id);
    expect(actual).toBe(expected);
});


test("Direct message to bot", () => {

    enqueue.storage.set("queue", {});
    
    let message = mockDirectMessage(1234);
    let actual = enqueue.call(message, []);
    let expected = Formatter.format(definitions._defaults_.directMessage, message.author.id);
    expect(actual).toBe(expected);
});


test("Valid category wrong channel", () => {

    let findElements = [
        {
            name: "some",
            parent: {
                name: "bot"
            }
        }
    ];

    let currentChannel = {
        name: "some",
        parent: {
            name: "bot"
        }
    }

    // let message = mockMessage(1234, 23252, findElements, currentChannel);
    // let actual = enqueue.call(message);
    // let expected = Formatter.format(definitions._defaults_.);

});


test("wrong category valid channel name", () => {


});
