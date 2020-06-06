const FsUtil = require('./file');


/**
 * Singleton that provides functions persist data. 
 * Data is persisted in in files defined inside the data directory.
 * Fetches all different files of the data directory into a single object.
 * 
 * @author Maksim Sandybekov
 * @date 7.5.20
 * 
 * @class
 */
class Storage {

    // Initialize storage with default values
    constructor() {
        this.instance = null;
        this.fileWriter = new FsUtil();
        this.storage = this.fileWriter.readData();
    }


    /**
     * Singleton method. Create and keep only a single object of the storage around.
     */
    static getInstance() {
        
        if (!this.instance) {
            this.instance = new Storage();
        }

        return this.instance;
    }


    /**
     * Adding values to data files. Creating the if they are not existent. 
     * 
     * @example
     * add("queue.users", 22); // store {"users": 22} inside a file named queue.json
     * 
     * @example
     * add("queue.1231.servername", "Test Server"); // store {"1231": {"servername": "Test Server"}} inside a file named queue.json
     * 
     * @param {string} key Single or multi path segment separated by dots (Examples: 'key', 'key.nested_key', ...)
     * @param {*} value The value to save under given key
     * @return {Object} the javascript object that was saved 
     */
    set(key, value) {

        // Only allow string to be used as keys
        if (!(key instanceof String) && typeof key !== 'string') {
            throw new Error(`Parameter {Key} is not a string.`);
        }

        let subKeys = key.split('.').filter(sKey => sKey != '');
        if (subKeys.length <= 0) {
            return false;
            
        }

        let fileKey = subKeys.shift();
        let fileContent = this.storage[fileKey];

        // There no keys after document key selection
        if (subKeys.length <= 0) {
            this.storage[fileKey] = value;
            this.fileWriter.writeData(fileKey, value);
            return true;

        }

        // Iterate over sub-keys
        let result = fileContent;
        for (let i = 0; i < subKeys.length; i++) {
            
            // Check all sub-keys except the last one
            if (i != subKeys.length-1 && result[subKeys[i]] === undefined) {
                result[subKeys[i]] = {};

            }

            // Last key reached, update value
            if (i == subKeys.length - 1) {
                result[subKeys[i]] = value;
                break;

            }
            
            result = result[subKeys[i]] || null;
        }

        this.storage[fileKey] = fileContent;
        this.fileWriter.writeData(fileKey, fileContent);
        return true;
    }

    
    /**
     * Searches for a value under given key.
     * 
     * @example
     * get("queue.member"); // Returns the value saved under given key or undefined
     * 
     * @example
     * get("queue"); // Returns whole content of queue.json file
     * 
     * @param {string} key Single/Multi-path segement separated by dots. (Example: 'key', 'key.nested_key', 'users.count', ...) 
     * @return {null | *} The value under the given path or null if nothing was found.
     */
    get(key) {

        // Only allow strings to be used as keys
        if (!(key instanceof String  ) && typeof key !== 'string') {
            throw new Error(`Parameter {Key} is not a string.`);
        }

        let subKeys = key.split('.').filter(sKey => sKey != '');
        if (subKeys.length <= 0) {
            return null;
        }

        // Recursivly choose keys from storage
        let result = this.storage;        
        for (let i = 0; i < subKeys.length; i++) {

            if (result[subKeys[i]] === undefined) {
                return null;
            }
            
            result = result[subKeys[i]];
        }

        return result;
    }
}



module.exports = Storage;