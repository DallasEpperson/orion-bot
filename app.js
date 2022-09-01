#!/usr/bin/env node
require('dotenv').config();

const {App: SlackApp, LogLevel} = require('@slack/bolt');
const glob = require('glob');
const path = require('path');
const log = require('./logging');
const semver = require('semver');

const slackApp = new SlackApp({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000,
    deferInitialization: true,
    logLevel: LogLevel.WARN
});

const orionVersion = require('./package.json').version;

const loadPlugins = async () => {
    let loadedPlugins = [];
    const pluginPath = './plugins/';
    log.internal(`Scanning ${pluginPath} for plugins.`);
    let pluginFiles = glob.sync(path.join(pluginPath, '*/index.js'));
    for (let i = 0; i < pluginFiles.length; i++) {
        let loadedPlugin = require('./' + pluginFiles[i]);
        if(!loadedPlugin.WrittenForVersion || !semver.valid(loadedPlugin.WrittenForVersion)){
            log.error(`Plugin "${loadedPlugin.PluginName}" was not written for this version of Orion.`);
            continue;
        }

        if(semver.diff(orionVersion, loadedPlugin.WrittenForVersion) == 'major'){
            log.error(`Plugin "${loadedPlugin.PluginName}" was written for a different major version of Orion (${loadedPlugin.WrittenForVersion}). Attempting to load regardless.`);
        }

        if(!loadedPlugin.init){
            loadedPlugins.push(loadedPlugin);
            continue;
        }
        try {
            loadedPlugin.init();
            loadedPlugins.push(loadedPlugin);
        } catch(initErr){
            log.error(`Plugin "${loadedPlugin.PluginName}" not loaded. Reason:\n${initErr}`);
        }
    }
    let pluginLoadReport = [`Loaded the following ${loadedPlugins.length} plugins:`];
    pluginLoadReport = pluginLoadReport.concat(...loadedPlugins.map((a) => {return `  ${a.PluginName} Version ${a.Version}`}));
    log.internal(pluginLoadReport.join('\n'));
    return loadedPlugins;
};

const registerMessageHandlers = async (slackApp, plugins) => {
    log.internal("Registering message handlers");
    let c = 0;
    for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        for (let j = 0; j < plugin.MessageHandlers.length; j++) {
            const handler = plugin.MessageHandlers[j];
            slackApp.message(handler.syntax, handler.handler);
            c++;
        }
    }
    log.internal(`Registered ${c} message handlers.`);
};

(async () => {
    log.startup();
    let plugins = await loadPlugins();
    await slackApp.init();
    await slackApp.start();
    log.internal("Connected to Slack.");
    await registerMessageHandlers(slackApp, plugins);
})();
