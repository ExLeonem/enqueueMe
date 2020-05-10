const FsUtil = require('../utilities/file');


/**
 * Functions to interact with the local build storage.
 * Fetches all different files of the data directory into a single object.
 * 
 * @author Maksim Sandybekov
 * @date 7.5.20
 */
class Storage {

    // Initialize storage with default values
    constructor() {
        this.fileWriter = new FsUtil();
        this.storage = this.fileWriter.readData();
    }


    /**
     * Adding a new value under given key path.
     * 
     * Examples:
     *  add('hello', 22) -> results in {hello: 22}
     *  add('queue.users', []) -> results in: queue: {users: []}
     * 
     * @param {string} key Single or multi path segment separated by dots (Examples: 'key', 'key.nested_key', ...)
     * @param {*} value The value to save under given key
     * 
     * @return {boolean} true if operation was successfully, else false 
     */
    set(key, value) {

    }

    /**
     * Searches for a value under given key.
     * 
     * @param {string} key Single/Multi-path segement separated by dots. (Example: 'key', 'key.nested_key', 'users.count', ...) 
     * 
     * @return {null | *} The value under the given path or null if nothing was found.
     */
    get(key) {

        // Key can't exists because no key was given
        if (key.length < 0) {
            return null;
        }

        let selectors = key.split(".");
        let result = this.storage;
        
        selectors.forEach(subKey => {
            result = result[subKey];
        });


        return result;
    }
}


module.exports = Storage;