const fs = require('fs');
const path = require('path');
const process = require('process');

const FsUtil = require('../../core/file');
const { cleanupDir } = require('../../core/testUtils');

let dataPath = path.join(process.cwd(), "data");



const fsUtils = new FsUtil();
cleanupDir();


// Teardown
afterEach(() => {    
    cleanupDir();

});


test("Create default folder", () => {

    fsUtils._setupDirectory();
    let pathExists = fs.existsSync(dataPath);
    
    expect(pathExists).toBe(true);
});


test("Write file", () => {
    
    let fileName = "check";
    fsUtils.writeData(fileName, {"first": "Max", "last": "Mustermann", "age": 15});

    let filePath = path.join(dataPath, fileName + ".json");
    let fileExists = fs.existsSync(filePath);

    expect(fileExists).toBe(true);
});


test("Create default queue.json file", () => {

    let filePath = path.join(dataPath, "queue.json");
    let preExists = fs.existsSync(filePath);

    fsUtils._initQueue();
    let postExists = fs.existsSync(filePath);

    expect(preExists != postExists).toBe(true);
});


test("Create default admin.json file", () => {

    let filePath = path.join(dataPath, "admin.json");
    let preExists = fs.existsSync(filePath);

    fsUtils._initAdminCache();
    let postExists = fs.existsSync(filePath);

    expect(preExists != postExists).toBe(true);
});


test("Create default config.json file", () => {

    let filePath = path.join(dataPath, "config.json");
    let preExists = fs.existsSync(filePath);

    fsUtils._initConfig();
    let postExists = fs.existsSync(filePath);

    expect(preExists != postExists).toBe(true);
});


test("Default config.json gets created", () => {

    // Create directory to test if default config file is created
    let configPath = path.join(process.cwd(), "no_config");
    fs.mkdirSync(configPath);

    // Switch into new directory create non-existent config, switch back
    process.chdir(configPath);
    FsUtil.createDefaultConfig();
    process.chdir(path.join(configPath, ".."));

    let filePath = path.join(configPath, "config.json");
    expect(fs.existsSync(filePath)).toBe(true);

    // Compare default config objects
    let content = require(filePath);
    let defaultContent = {
        "prefix": "/",
            "token": "",
            "adminRole": "Bot Admin",
            "channels":{
                "category": "bot",
                "member": "member",
                "admin": "admin"
            }
        };

    fs.unlinkSync(filePath)
    fs.rmdirSync(configPath);
    expect(content).toMatchObject(defaultContent);
});