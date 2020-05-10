const FsUtil = require('./file');


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
        this.data = this.fileWriter.readData();
        this.storage = data.storage;
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
     * @return {boolean} true if operation was successfully, else false 
     */
    add(key, value) {

    }

    /**
     * Searches for a value under given key.
     * 
     * @param {string} key Single/Multi-path segement separated by dots. (Example: 'key', 'key.nested_key', 'users.count', ...) 
     * @return {null | *} The value under the given path or null if nothing was found.
     */
    get(key) {

    }
}


module.exports = Storage;