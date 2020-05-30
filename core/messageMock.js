

/**
 * Class to provide mocks of discord.js messages for the test environment.
 * 
 * 
 * @author Makim Sandybekov
 * @date 30.05.2020
 */
class MessageMock {

    /**
     * @constructor
     */
    constructor() {
        this.direct = false;
        this.user = {};
        this.message = {};
        this.channel = {};
    }

    /**
     * Create the final message mock and returns it.
     * 
     * @return {Object}
     */
    create() {

        let userKey = "member";
        if (this.direct) {
            userKey = "author";
        }

        this.message[userKey] = this.user;
        this.message["guild"] = this.guild;
        this.message["channel"] = this.channel;

    }

    setUser(id, name, discriminator) {

        this.user["id"] = id;
        this.user["user"] = {}
        this.user.user["username"] = name;
        this.user.user["discriminator"] = discriminator;
        return this;
    }


    /**
     * 
     * @param {*} guildId 
     * @param {*} guildName 
     * @param {}
     */
    setGuild(guildId, guildName) {

    }


    /**
     * Create the channel configuration
     * 
     * @param {string} name 
     * @param {string} categoryName 
     */
    setChannel(name, categoryName) {

        this.channel["name"] = name;
        this.channel["parent"] = {};
        this.channel["parent"]["name"] = categoryName; 
        this.channel["send"] = function(content) {
            return content;
        }
    }


    /**
     * Set the type of message to direct message.
     * 
     */
    setDirect() {
        this.direct = true;
    }
}



module.exports = MessageMock;