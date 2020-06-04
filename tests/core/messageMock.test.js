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
        .setDirect(false)
        .setGuild(12423, ["Allgemein", "aufgaben"], "Text")
        .setChannel(channelName, "Text")
        .create();

    expect(message).toHaveProperty("channel.name", channelName);
});


test("guild message on specific channel and category", () => {

    let channelName = "Members";
    let category = "Bot";
    let message = new MessageMock()
        .setDirect(false)
        .setGuild(12342, ["Admin", channelName], category)
        .setChannel(channelName, category)
        .create();

    expect(message).toHaveProperty("channel.name", channelName);
    expect(message).toHaveProperty("channel.parent.name", category);
});


test("guild without channels", () => {

    let guildId = 123452;
    let message = new MessageMock()
        .setDirect()
        .setGuild(guildId)
        .setChannel("Default", "Test")
        .create();

    expect(message).toHaveProperty("guild.id", guildId);

    let channels = message.guild.channels.cache.each(channel => {channel.name});
    expect(channels).toEqual([]);
});


test("Guild cache channel methods exist.", () => {

    let message = new MessageMock()
        .setDirect(false)
        .setGuild(12314213, ["Member", "Admin", "Test"], "Bot")
        .create();


    expect(message.guild.channels.cache.find).toBeDefined();
    expect(message.guild.channels.cache.each).toBeDefined();
});