# Orion

Orion is a Slack bot who lives in my basement.

## Setup

* Have a slack workspace
* Set up a Real-Time Messaging API in Slack (possibly called `Custom Integrations / Bots` depending on lunar cycle)
* Take note of API Token
* Copy `app.exampleconfig.json` to `app.config.json` and replace API Token
* Find any other `plugins/*/*.exampleconfig.json` files that any plugins might have. Fix accordingly.

## Installing

* Clone the repo
* `npm install`
* `node app.js`
