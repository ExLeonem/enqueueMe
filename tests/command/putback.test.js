const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const PutBack = require('../../commands/putBack');


const putback = new PutBack("putBack");
const storage = Storage.getInstance();


test("valid putback", () => {

});


test("No user in cache to putback", () => {

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