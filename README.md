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

## Plugins

* [Dark Sky](https://github.com/DallasEpperson/orion-bot-darksky) - Adds Dark Sky weather forecasting to Orion
* [Public IP](https://github.com/DallasEpperson/orion-bot-public-ip) - Adds ability for Orion to report its public IP address
* [QRZ.com](https://github.com/DallasEpperson/orion-bot-qrz) - Adds ability to query amateur radio callsign info
* [URL](https://github.com/DallasEpperson/orion-bot-urls) - Adds ability to query for known URLs
* [weeWX](https://github.com/DallasEpperson/orion-bot-weewx) - Adds ability to pull current and past weather information from weeWX into Orion

## Running on system startup (as a service)

### Linux

* Modify `orion-bot.service` to point to your particular paths
* Copy `orion-bot.service` to `/etc/systemd/system/orion-bot.service`
* Start via `systemctl start orion-bot`
* Enable run on startup via `systemctl enable orion-bot`
* See output logs via `tail -f /var/log/syslog`
