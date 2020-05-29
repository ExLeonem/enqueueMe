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
    constructor(dirPath = path.join(process.cwd(), 'data')) {
        this.workingDir = dirPath;
        
        this.dirExists = this._setupDirectory();
        this._initQueue();
        this._initAdminCache();
        this._initConfig();
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
        const storageFiles = fs.readdirSync(this.workingDir).filter(file => file.endsWith('.json'))
        for (const file of storageFiles) {

            let fileName = file.split('.')[0];
            storage[fileName] = require(path.join(this.workingDir, file));
        }

        return storage;
    }

    
    /**
     * Write new data to the storage directory.
     * 
     * @param {string} filename The name of the file to be written.
     * @param {Object} data Write data to the files in the  
     */
    writeData(filename, data) {

        // Add json ending if non-existent
        if (!filename.endsWith('.json')) {
            filename = filename+'.json';

        }

        // Setup directory if it does not exist
        if (!fs.existsSync(this.workingDir)) {
            this._setupDirectory();

        }

        let content = JSON.stringify(data);
        let filePath = path.join(this.workingDir, filename);
        fs.writeFileSync(filePath, content);
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
     * @param {string} fileName The name of the file to be created in the working directory
     */
    _initQueue(fileName = "queue") {

        let content = {
            
        };

        this._writeDefaultConfig(fileName, content);
    }


    /**
     * Creates a file to keep track of admin member calls to the bot.
     * 
     * @param {*} fileName 
     */
    _initAdminCache(fileName = "admin") {

        let content = {

        };

        this._writeDefaultConfig(fileName, content);
    }


    /**
     * Create a configuration
     * 
     * @param {string} fileName The name of the file to be created in the working directory 
     */
    _initConfig(fileName = "config") {
        
        let content = {
                
        }

        this._writeDefaultConfig(fileName, content);
    }


    /**
     * Creates a file in the working directory if it not already exists. 
     * 
     * @param {string} fileName The name of the file to be created 
     * @param {object} initialConent The initial content of the file 
     */
    _writeDefaultConfig(fileName, initialContent = {}) {

        let filePath = path.join(this.workingDir, fileName + ".json");

        if (!fs.existsSync(filePath)) {
            this.writeData(fileName, initialContent);
        }
    }
}


module.exports = FsUtil;