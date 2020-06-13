const MessageMock = require('../../core/messageMock');


test("is direct message", () => {

    let message = new MessageMock().setDirect().create();
    expect(message).toHaveProperty("author", {});
    expect(message.member).toBeUndefined();
});


test("is guild message", () => {

    let message = new MessageMock().setDirect(false).create();
    expect(message).toHaveProperty("member", {});
    expect(message.author).toBeUndefined();
});


test("is message on specific channel", () => {
    
    let channelName = "Allgemein";
    let message = new MessageMock()
        .setGuild(12423, ["Allgemein", "aufgaben"], "Text")
        .setChannel(channelName, "Text")
        .create();

    expect(message).toHaveProperty("channel.name", channelName);
});


test("guild message on specific channel and category", () => {

    let channelName = "Members";
    let category = "Bot";
    let message = new MessageMock()
        .setGuild(12342, ["Admin", channelName], category)
        .setChannel(channelName, category)
        .create();

    expect(message).toHaveProperty("channel.name", channelName);
    expect(message).toHaveProperty("channel.parent.name", category);
});


test("guild without channels", () => {

    let guildId = 123452;
    let message = new MessageMock()
        .setGuild(guildId)
        .setChannel("Default", "Test")
        .create();

    expect(message).toHaveProperty("guild.id", guildId);

    let channels = message.guild.channels.cache.each(channel => {channel.name});
    expect(channels).toEqual([]);
});


test("Guild cache channel methods exist.", () => {

    let message = new MessageMock()
        .setGuild(12314213, ["Member", "Admin", "Test"], "Bot")
        .create();


    expect(message.guild.channels.cache.find).toBeDefined();
    expect(message.guild.channels.cache.each).toBeDefined();
});


test("Find method working", () => {

    let lookForName = "admin";
    let message = new MessageMock()
        .setGuild(22342)
        .addChannel("member", "bot")
        .addChannel("admin", "bot")
        .addChannel("something", "else")
        .create();

    let actual = message.guild.channels.cache.find(channel => channel.name = lookForName)
    expect(actual.name).toBe(lookForName);
    expect(actual.parent.name).toBe("bot");
});


test("Added channel send returns param itself", () => {

    let message = new MessageMock().addChannel("member", "bot");
    let channel = message.guildChannels[0];

    let expected = "content";
    expect(channel.send(expected)).toBe(expected);
});


test("Init multiple guild channels at once", () => {

    let messageMock = new MessageMock();

    let category = "bot";
    let channelNames = ["first", "second", "third"];
    let channels = messageMock.__createGuildChannels(channelNames, category);

    expect(channels.length).toBe(channelNames.length);
    expect(channels[1].name).toBe(channelNames[1]);
    expect(channels[1].parent.name).toBe(category)
    expect(channels[1].send(category)).toBe(category);
});