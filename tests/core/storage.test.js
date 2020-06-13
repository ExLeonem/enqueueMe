const fs = require('fs');
const path = require('path');
const process = require('process');
const Storage = require('../../core/storage');

const dataPath = path.join(process.cwd(), "data");
let storage;


// Setup 
beforeEach(() => {
    storage = new Storage();
});


// Teardown
afterEach(() => {
    fs.readdirSync(dataPath, {"withFileTypes": true}).forEach((element) => {

       let itemPath = path.join(dataPath, element.name);

       // Clean-up json files from directory
       if (element.isFile()) {
           fs.unlinkSync(itemPath);

       }
   });
});


test("Initial files are created", () => {

    let dataDirContent = fs.readdirSync(dataPath);
    expect(dataDirContent.length).toBeGreaterThan(0);
});


test("Create new file with content", () => {

    let fileName = "new";
    let value = {
        "name": "Max Mustermann",
        "new": true
    };
    storage.set("new", value);

    let filePath = path.join(dataPath, fileName + ".json");
    let content = JSON.parse(fs.readFileSync(filePath));

    expect(content.new).toBe(true);
});


test("Adding new key to default", () => {

    let value = "hello";
    storage.set("queue.var", value);

    let filePath = path.join(dataPath, "queue.json");
    let content = JSON.parse(fs.readFileSync(filePath));

    expect(content.var).toBe(value);
});


test("Update single key under json file", () => {

    let newValue = 2;
    storage.set("queue.count", newValue);

    let filePath = path.join(dataPath, "queue.json");
    let content = JSON.parse(fs.readFileSync(filePath));

    expect(content.count).toBe(2);
});


test("Update complete file", () => {

    let newValue = {
        count: 12,
        members: []
    };
    storage.set("queue", newValue);

    let filePath = path.join(dataPath, "queue.json");
    let content = JSON.parse(fs.readFileSync(filePath));

    expect(content.count).toBe(12);
});


test("Retrieve file content", () => {

    storage.set("queue.count", 6);
    let defaultMemberCount = storage.get("queue.count");
    expect(defaultMemberCount).toBe(6);
});


test("Insert a series of non-existent key segmeents.", () => {

    storage.set("queue", {});

    let insertValue = 22;
    let key = "queue.hey.what.else";
    storage.set(key, insertValue);

    let actual = storage.get(key);
    expect(actual).toBe(insertValue);
});


test("Empty key was given", () => {

    let wasCreated = storage.set("", 124);
    expect(wasCreated).toBe(false);
});


test("Insert at non-string key", () => {

    let storageUpdate = () => storage.set(["some", "keys"], {});
    expect(storageUpdate).toThrow(Error);
});


test("Retrieve at non-string key", () => {

    let storageRetrieve = () => storage.get(22);
    expect(storageRetrieve).toThrow(Error);
});


test("Retrieve empty string.", () => {

    let actual = storage.get("");
    expect(actual).toBe(null)
});