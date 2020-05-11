
# Queue Bot implementation
The queue is persistent in memory. Files are created where the 


# Index

1. Setup
2. Roadmap
3. Commands
    1. Enqueue
    2. Dequeue
    3. List
    4. Configure



## Setup

Setup up a bot in the discord.js console.



Put a configuration file into the project root named `config.json` with following content:

```json
    {
        "prefix": "a prefix to use like '/'",
        "token": "the bot token"
    }
```


## Roadmap

- [ ] Adding string [similiary algorithm](https://itnext.io/string-similarity-the-basic-know-your-algorithms-guide-3de3d7346227)  for correction of wrong input commands 
- [ ]  


## Commands

| Command | Parameters | Effect
| --- |--- | ---
| [/enqueue](#Enqueue) | - | Enqueues the user calling
| [/dequeue](#Dequeue) | - | Dequeues the next user from a queue
| [/list](#List) | - \| all | Returns the users queued before the caller or all user.
| [/configure](#Configure) | - | Configures the bot
| /help | - | Prints a help for the bot



### Enqueue


### Dequeue


### List


### Configure



