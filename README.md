# Orion

Orion is a Slack bot who lives in my basement. He is extendable via plugins, making it easy to add new features.

## Setup

* Have [a working Node.js environment](https://nodejs.org)
* Have a slack workspace
* Set up a Real-Time Messaging API in Slack (possibly called `Custom Integrations / Bots` depending on lunar cycle)
* Take note of API Token

## Installing

* Clone the repo
* `npm install`
* Copy `app.exampleconfig.json` to `app.config.json` and replace API Token
* Find any other `plugins/*/*.exampleconfig.json` files and fix accordingly.
* `node app.js`

## Usage

Orion will respond when he is @mentioned, or to any direct messages.
