const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const Config = require('../../commands/config');


const config = new Config("config");
const storage = Storage.getInstance();


test("adding channel configuration", () => {

});


test("show channel configs", () => {

});


test("Block direct messages.", () => {

    let userId = 23423;
    let message = new MessageMock().mockDirectMessage(userId);
    let actual = config.execute(message);
    let expected = Formatter.format(definitions._defaults_.directMessage, userId);
    expect(actual).toBe(expected);
});


test("Block messages from unconfigured channels/categories.", () => {

    let userId = 2342;
    let message = new MessageMock().mockIllegalMessage(userId);
    let actual = config.execute(message);
    let expected = Formatter.format(definitions._defaults_.channelConfig, userId);
    expect(actual).toBe(expected);
});
