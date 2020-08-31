const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const defaultConfig = require("../../config.json");
const BotConfig = require('../../core/botConfig');
const Storage = require('../../core/storage');


const botconfig = new BotConfig();
const storage = Storage.getInstance();


// Reset the storage before each test
beforeEach(() => {
    storage.set("config", {});
})


test("Singleton generation", () => {

    let botConfig =  BotConfig.getInstance();
    expect(botConfig).not.toBe(null);
});


test("Load guild channel configuration", () => {

    let guildId = 234234;
    let guildChannelConfig = {category: "some", member: "single", admin: "ueberadmin"};
    storage.set("config." + guildId + ".channel", guildChannelConfig);

    let actual = botconfig.loadGuildChannels(guildId);
    expect(actual).toMatchObject(guildChannelConfig);
});


test("Set guild channel config", () => {

    let guildId = 234234;
    let guildChannelConfig = {category: "some", member: "single", admin: "ueberadmin"};
    botconfig.setGuildChannels(guildId, guildChannelConfig);

    let actual = storage.get("config." + guildId + ".channel");
    expect(actual).toMatchObject(guildChannelConfig);
});


test("Load guild queue configuration", () => {

    let guildId = 23423;
    let guildQueueConfig = {size: 15};
    storage.set("config." + guildId + ".queue", guildQueueConfig);

    let actual = botconfig.loadGuildQueue(guildId);
    expect(actual).toMatchObject(guildQueueConfig);
});


test("Set guild queue config", () => {

    let guildId = 23423;
    let guildQueueConfig = {size: 15};
    botconfig.setGuildQueue(guildId, guildQueueConfig);

    let actual = storage.get("config." + guildId + ".queue");
    expect(actual).toMatchObject(guildQueueConfig)
});


test("Set guild config", () => {

    let guildId = 23423;
    let guildConfig = {
        queue: {
            size: 15
        },
        channel: {
            category: "category",
            member: "some",
            admin: "other"
        }
    };
    botconfig.setGuildConfig(guildId, guildConfig);

    let actual = storage.get("config." + guildId);
    expect(actual).toMatchObject(guildConfig);
});


test("Get default", () => {

    let config = botconfig.getDefaultConfig();
    expect(config).toMatchObject(defaultConfig);
});


test("Config exists", () => {

    expect(botconfig.exists()).toBe(true);
});