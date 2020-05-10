const fs = require('fs');
const path = require('path');
const process = require('process');


/**
 * Utilities to write and load json data to disk
 * 
 * @author Maksim Sandybekov
 * @date 7.5.20
 */
class FsUtil {

    /**
     * 
     * @param {string} dirPath Path to directory where to write data to, defaults to /data (from project root).
     */
    constructor(dirPath = path.join(process.cwd(), "..", "data")) {
        this.workingDir = dirPath;
        
        this.dirExists = this._setupDirectory();
        this._initDataStorage(path.join(this.workingDir, "storage.json"));
        // this._initUser();
    }


    /**
     * Read all data file from the storage directory and build an object.
     * 
     * Example:
     *  /data
     *      users.json
     *      storage.json
     * 
     *  results in following object: {"users": {}, "storage": {}}
     */
    readData() {

        let storage = {};

        // Build the storage object
        const storageFiles = fs.readdirSync(this.workingDir).filter(file => file.endsWith(".json"))
        for (file of storageFiles) {

            let fileName = file.split(".")[0];
            storage[fileName] = require(path.join(this.workingDir, file));
        }

        return storage;
    }

    /**
     * Write new data to the storage directory.
     * 
     * @param {Object} data Write data to the files in the  
     */
    writeData(filename, data) {

    }

    // ---------------------
    // Private functions
    // -------------------------

     /**
     * Creates a none existent 
     */
    _setupDirectory() {

        if (!fs.existsSync(this.workingDir)) {
            fs.mkdirSync(this.workingDir, {recursive: true});
        }

        return fs.existsSync(this.workingDir);
    }

    /**
     * Setup a data storage in form of a directory, loading already existing files.
     * 
     * @param {string} path Path of the directory where to setup a directory 
     */
    _initDataStorage(path) {

        if ()

    }

    _setupUserStorage(path) {
        
    }
}


module.exports = FsUtil;