
# Queue Bot implementation
EnqueueMe is a simple discord bot used to manage a simple queue. Server members are able to enqueue by typing */qme*, leave the queue by typing */cancel*. An enqueued member is able to check how many people are before him in the queue. Server members with a specific role are able to select members from the queue. The queue is persisted in a file.


# Example




# Index

1. [Setup](#Setup)
2. [Deployment](#Deployment)
3. [Roadmap](#Roadmap)
4. [Commands](#Commands)
    1. [Enqueue](#Endqueue)
    2. [Dequeue](#Dequeue)
    3. [List](#List)
5. [Documentation](#Documentation)
    1. [Creating commands](#Creating-commands)
    2. [Using the storage](#Storage)



## Setup

Setup up a bot in the discord.js console, following the official guide.


Put a configuration file into the project root named `config.json` with following content:

```json
    {
        "prefix": "a prefix to use like '/'",
        "token": "the bot token",
        "adminRole": "the admin role to allow query queue information from the bot"
    }
```

## Deployment

- docker-compose file
- Dockerfile


## Roadmap

- [ ] Adding [string similiary algorithm](https://itnext.io/string-similarity-the-basic-know-your-algorithms-guide-3de3d7346227) for suggestion of commands 
- [ ] Put the bot responses/command names into separate files
- [ ] Allow for random response selection
- [ ] Language support?
- [ ] Additional commands that could be interesting
    - [ ] empty -> empty the complete queue
    - [ ] has -> has someone waiting in the queue
    - [ ] limit -> limit the amount of people that can be queued
    - [ ] Re-enter limit (Limit the time until a user is able to enqueue again to prefent spam)


## Commands

| Command | Parameters | Effect
| --- |--- | ---
| /qme | - | Enqueues the user calling
| /cancel | - | Remove the calling user from the queue
| /next | - | Dequeues the next user from a queue. Only callable by members who'm are given appropriate role (configured in `./config.json` as adminRole)
| /list | - \| all | Returns the users queued before the caller or all user.
| /listen | - \| stop | If a user enqueues the user who called this command will be informed
| /putback | - | Puts a user back into the queue
| /help | - | Prints a help for the bot




## Documentation


### Creating commands

To define new commands you need tocreate a new file in the `/commands` directory for each command. You can define a command by subclassing from the Command class in`./core/command.js`. The constructor takes in the storage object. You need to call the parent constructor with the name of the command. Afterwards you need to overwrite the execute method and export the Class.

You can use the following boilerplate to define a new command.


```js

const Command = require('../core/command');

class CommandName extends Command {

    constructor(storage, fileName) {
        super(fileName); 
        this.storage = storage;
    }


    /**
     * 
     * @param {Object} message - The deafult discor message object
     * @param {*} args - The additional arguments passed with the command
     * 
     */
    execute(message, args) {

        // Command specific code here


        // You can return a message like this. Check the discord.js documentation for more information
        return message.channel.send("Hello World."); 
    }
}

module.exports = CommandName;
```

After creating the new command you need to register it in the `./bot.js` file. 

### Storage

A storage object is passed to the constructor of each command. The API for storage use is defined in `./core/storage.js`.
There are mainly two methods you can use, `set` to set a specific value or `get` to get a value stored under a key.


#### set(key, value)
Set a value for the given key. The key is a string, describing a path for navigating the json objects. Each key segement represents a single key. However the path segments must have at least 2-Segments. The first one is the file in which the data will be stored, the second one is the first key the value will be stored under.

| Parameter | Type | Description | Example
| --- | --- | --- | ---
| key | String | The key under which the value is stored. Key segements separated by dots. | queue.count
| value | * | The value to be stored under given key | 123, "Some String", [1, 2, 34]


#### get(key)
Retrieve a value for the given key if it exists, else return null.

| Parameter | Type | Description | Example
| --- | --- | --- | ---
| Key  | String | The key to get the value from | queue.member 
