const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');
const Formatter = require('../../core/formatter');
const definitions = require('../../commands/definitions.json');
const Communication = require('../../core/communication');
const defaultConfig = require('../../config.json');

const storage = Storage.getInstance();


// Reset storage before performing each unit test
beforeEach(() => {
    storage.set("config", {});
});


test("No member/admin channels configured, only category single value. Communication over valid channel", () => {

    let categoryName = "defaultCategory"
    let message = new MessageMock()
        .setUser(234234, "Max Mustermann", "23424")
        .setGuild(234234 ["hello", "some", "whatsovever"], categoryName)
        .setChannel("hello", categoryName)
        .create();
    let com =  new Communication(message);
    com.admin = null;
    com.member = null;
    com.category = categoryName;

    expect(com.isAllowed()).toBe(true);
});


test("No member/admin channels configured, only category single value. Communication over invalid channel", () => {

    let categoryName = "defaultCategory"
    let message = new MessageMock()
        .setUser(234234, "Max Mustermann", "23424")
        .setGuild(234234 ["hello", "some", "whatsovever"], categoryName)
        .setChannel("hello", "somewhere else")
        .create();
    let com =  new Communication(message);
    com.admin = null;
    com.member = null;
    com.category = categoryName;

    expect(com.isAllowed()).toBe(false);
});


test("No member/admin channels configured, only category as array", () => {

    let categoryName = ["defaultCategory", "otherCat", "whatever"]
    let message = new MessageMock()
        .setUser(234234, "Max Mustermann", "23424")
        .setGuild(234234 ["hello", "some", "whatsovever"], categoryName[1])
        .setChannel("hello", categoryName[1])
        .create();

    let com =  new Communication(message);
    com.admin = null;
    com.member = null;
    com.category = categoryName.map(name => name.toLowerCase());

    expect(com.isAllowed()).toBe(true);
});



test("Channels match for array of objects", () => {

    let categoryName = "defaultCategory"
    let channelName = "whatsoever";
    let message = new MessageMock()
        .setUser(234234, "Max Mustermann", "23424")
        .setGuild(234234 ["hello", "some", channelName], categoryName)
        .setChannel(channelName, categoryName)
        .create();

    let com = new Communication(message);
    com.category = categoryName;
    com.member = [
        {name: "defaults", category: "misc"}, 
        {name: channelName, category: categoryName}
    ];

    expect(com.__channelsMatch(channelName, categoryName)).toBe(true);
});


test("Channels match for array of strings", () => {
    let categoryName = "defaultCategory"
    let channelName = "whatsoever";
    let message = new MessageMock()
        .setUser(234234, "Max Mustermann", "23424")
        .setGuild(234234 ["hello", "some", channelName], categoryName)
        .setChannel(channelName, categoryName)
        .create();

    let com = new Communication(message);
    com.category = categoryName;
    com.member = ["defaults", channelName, "Welcome"];

    expect(com.__channelsMatch(channelName, categoryName)).toBe(true);
});


test("Channels match on not included category", () => {
    let categoryName = "defaultCategory"
    let channelName = "whatsoever";
    let message = new MessageMock()
        .setUser(234234, "Max Mustermann", "23424")
        .setGuild(234234 ["hello", "some", channelName], categoryName)
        .setChannel(channelName, categoryName)
        .create();

    let com = new Communication(message);
    com.category = categoryName;
    com.member = ["defaults", channelName, "Welcome"];

    expect(com.__channelsMatch(channelName, "some")).toBe(false);
});


test("Get category config", () => {

    let message = new MessageMock().mockIllegalMessage(234234);
    let com = new Communication(message);

    let actual = com.getCategoryConfig();
    expect(actual).toBe(defaultConfig.channels.category);
});


test("Retrieve channel configs from storage", () => {

    let guildId = 234234;
    let message = new MessageMock()
        .setUser(234234, "Max Mustermann", "2342")
        .setGuild(guildId, "some", "other")
        .create();

    let expected = {
        category: "none",
        member: "MemberChannel",
        admin: "AdminChannel"
    };
    storage.set("config." + guildId + ".channels", expected);
    let com = new Communication(message);
    com.setChannelConfigs();

    expect(com.category).toBe(expected.category);
    expect(com.member).toBe(expected.member);
    expect(com.admin).toBe(expected.admin);
});


test("Reason is direct message", () => {

    let userId = 2342;
    let message = new MessageMock().mockDirectMessage(userId);
    let com = new Communication(message);

    let actual = com.getReason();
    let expected = Formatter.format(definitions._defaults_.directMessage, userId);

    expect(actual).toBe(expected);
})