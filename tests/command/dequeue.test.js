const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const Dequeue = require('../../commands/dequeue');


let dequeue = new Dequeue("dequeue");
let storage = Storage.getInstance();


test("call by non-admin", () => {
    
});


test("call by admin", () => {

});


test("dequeue empty queue", () => {

});


test("dequeue non-empty queue", () => {

});


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