const definitions = require('../commands/definitions.json');
const Communication = require('./communication');
const Formatter = require('../core/formatter');
const Storage = require('./storage');


/**
 * Parent class of every command.
 * Defines the general api to be used by each command.
 * 
 * @author Maksim Sandybekov
 * @date 10.05.2020
 * 
 * @class
 * @namespace
 * @property {String} name The name of the command
 * @property {Object} params Additional paramters passed with the command
 * @property {Object} responses The responses for this specific command
 */
class Command {

    /**
     * @constructor
     * @param {string} fileName Key by which to access the command name from the definition file. Command name defaults to the Filename
     * @param {Object} params Additional parameters.
     */
    constructor(fileName, params = {}) {

        this.def = definitions[fileName] || "";
        this.name = this.def.name || fileName;
        this.responses = this.def.responses || {};
        this.params = params;
        this.storage = Storage.getInstance();
    }


    /**
     * Executes the main logic of the command
     * 
     * @param {*} message A discord.js message object representing a request.
     * @param {*} args Arguments passed in addition to the command call
     */
    execute(message, args) {

        // Stub implementation
        return message.channel.send("Execute template");
    }


    /**
     * Creates and returns a object representation of the command. Used to init discord.js commands.
     *  
     * @return {Object} An object representation of the command.
     */
    getCommand() {

        let commandObject = this;

        return {
            name: this.name,
            ...this.params,
            execute(message, args) {
                return commandObject.execute(message, args);
            }
        }
    }


    /**
     * Returns a command specific response for a user, additionally supplied arguments besides name are used to replace template sequeuence of the string.
     * 
     * @example
     * getResponse("enqueueFirst", userId);
     * 
     * @example
     * getResponse("success", userId, memberId);
     * 
     * @param {string} name The key of the response. Used to access the responses for the calling command.
     * @return {string} Reponse with template sequences replaced.
     */
    getResponse(name) {

        let response = this.responses[name];
        let prevArguments = Object.keys(arguments).sort().slice(1).map(index => arguments[index]);
        return Formatter.format(response, ...prevArguments); 
    }
}



module.exports = Command;