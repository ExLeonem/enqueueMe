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
    constructor(dirPath = path.join(process.cwd(), "data")) {
        this.workingDir = dirPath;
        
        this.dirExists = this._setupDirectory();
        this._initQueue("queue.json");
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
        for (const file of storageFiles) {

            let fileName = file.split(".")[0];
            storage[fileName] = require(path.join(this.workingDir, file));
        }

        console.log(storage);
        return storage;
    }

    /**
     * Write new data to the storage directory.
     * 
     * @param {String} filename The name of the file to be written.
     * @param {Object} data Write data to the files in the  
     */
    writeData(filename, data) {

        // Add json ending if non-existent
        if (!filename.endsWith(".json")) {
            filename = filename+".json";
        }


        let content = JSON.stringify(data);
        let filePath = path.join(this.workingDir, content);
        fs.writeFileSync(filePath, data);
    }

    // ---------------------
    // Private functions
    // -------------------------

     /**
     * Setup a data storage in form of a directory, loading already existing files.
     * 
     * @return {boolean} - wether the directory was created successfully or not
     */
    _setupDirectory() {

        if (!fs.existsSync(this.workingDir)) {
            fs.mkdirSync(this.workingDir, {recursive: true});
        }

        return fs.existsSync(this.workingDir);
    }

    /**
     * Creates a default file to store the members of the queue.
     * 
     * @param {string} path Path of the directory where to setup a directory 
     */
    _initQueue(fileName) {


        let filePath = path.join(this.workingDir, fileName);
        if (this.dirExists && !fs.existsSync(filePath)) {

            let defaultQueue = {
                member: [],
                count: 0
            }
            
            let content = JSON.stringify(defaultQueue);
            fs.writeFileSync(filePath, content);
        } 
    }

    _setupUserStorage(path) {
        
    }
}


module.exports = FsUtil;