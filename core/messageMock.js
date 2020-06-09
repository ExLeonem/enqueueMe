

/**
 * Class to provide mocks of discord.js messages for the test environment.
 * 
 * 
 * @author Makim Sandybekov
 * @date 30.05.2020
 * @version 1.0
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
        this.guildChannels = [];
        this.guild = {};
    }

    /**
     * Create the final message mock and returns it.
     * 
     * @return {Object} Return the create message object mock.
     */
    create() {

        // Create user information
        let userKey = "member";
        if (this.direct) {
            userKey = "author";
            this.setChannel("direct");
        }
        this.message[userKey] = this.user;
    
        // Create guild information
        this.message["guild"] = this.guild;
        if (!this.message.guild.channels) {
            this.message.guild["channels"] = {};
        }
        this.__setEachMethod();
        this.__setFindMethod();

        // Create channel information
        this.message["channel"] = this.channel;
        
        return this.message;
    }


    /**
     * Setup a specific user for the message mock or use random values.
     * 
     * @param {*} id The user id
     * @param {*} name The username
     * @param {*} discriminator The discriminator
     * @return {Object} The current message mock instance
     */
    setUser(id, name, discriminator) {

        this.user["id"] = id;
        this.user["user"] = {};
        this.user.user["username"] = name;
        this.user.user["discriminator"] = discriminator;

        return this;
    }


    /**
     * Creates the guild property with objects in cache to iterate over. 
     * Should only be used on mock message sent from a guild channel.
     * Both guildChanels and channelCategory needs to be filled to create channels
     * in the guild cache. If different channel-name/category  combinations are needed
     * use the addChannel function.
     * 
     * @param {*} guildId 
     * @param {string[]} channelNames An array of channel names.
     * @param {string} channelCategory The category under which the guild channels to put
     * @return {Object} The current message mock instance
     */
    setGuild(guildId, channelNames = null, channelCategory = null) {
        this.guild["id"] = guildId;

        if (channelNames && channelCategory) {

            let channels = this.__createGuildChannels(channelNames, channelCategory);
            this.guildChannels = channels.concat(this.guildChannels);
        }
    
        return this;
    }


    // __setGuildChannelCache() {

    // }


    /**
     * Adding a channel to the guild property cache. 
     * 
     * @param {string} channelName Name of the channel
     * @param {string} parentName Name of the parrent
     * @param {string} type The channel type [category | text | ...] (Check discord.js docs for more info)
     * @return {Object} The current message mock instance
     */
    addChannel(channelName, parentName, type = "text") {
        
        this.guildChannels.push({
            "type": type,
            "name": channelName,
            "parent": {
                "name": parentName
            },
            "send": function(content) {
                return content;
            }
        });

        return this;
    }


    /**
     * Set the current channel configuration.
     * 
     * @param {string} name 
     * @param {string} categoryName
     * @return {Object} The current message mock instance
     */
    setChannel(name, categoryName = "Default") {

        this.channel["name"] = name;
        this.channel["parent"] = {};
        this.channel["parent"]["name"] = categoryName; 
        this.channel["send"] = function(content) {
            return content;
        }

        return this;
    }


    /**
     * Set the type of message to direct message.
     * 
     * @return {Object} The current message mock instance
     */
    setDirect(isDirect = true) {
        this.direct = isDirect;
        return this;
        
    }



    // ------------------------
    // Utilities
    // ------------------------

    /**
     * Creates the cache if it is none-existent.
     * 
     * @private
     */
    __createNonExistentCache() {
        if (!this.guild.channels["cache"]) {
            this.guild.channels["cache"] = {};
        }
    }

    /**
     * Create guild channels to iterate over.
     * 
     * @private
     * @param {string} channelNames Array of channel names 
     */
    __createGuildChannels(channelNames, channelCategory) {

        let elements = [];

        for (let name of channelNames) {
            elements.push({
                "name": name,
                "parent": {
                    "name": channelCategory
                },
                "send": function(content) {
                    return content;
                }
            });
        }

        return elements;
    }

    /**
     * Sets the find method for the guild channel cache
     * 
     * @private
     */
    __setFindMethod() {

        this.__createNonExistentCache();
        let elements = this.guildChannels;
        this.guild.channels.cache["find"] = callback => {
            
            for (let element of elements) {
                
                if (callback(element)) {
                    return element;
                }
            }
        }
    }

    /**
     * Sets the each method for the guild channel cache
     * 
     * @private
     */
    __setEachMethod() {

        this.__createNonExistentCache();
        let elements = this.guildChannels;
        this.guild.channels.cache["each"] = callback => {

            for (let element of elements) {
                callback(element);
            }

            return elements;
        }
    }

}



module.exports = MessageMock;