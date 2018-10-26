var request = require('request');
var darkskyConfig = require('./darksky.config.json');

let getWeatherIconFor = function(darkskyIcon){
    switch (darkskyIcon) {
        case 'clear-day':
            return ':sunny:';
        case 'clear-night':
            return ':crescent_moon:';
        case 'partly-cloudy-day':
            return ':mostly_sunny:';
        case 'partly-cloudy-night':
        case 'cloudy':
            return ':cloud:';
        case 'rain':
            return ':rain_cloud:';
        case 'sleet':
            return ':snow_cloud:';
        case 'snow':
            return ':snowflake:';
        case 'wind':
            return ':wind_blowing_face:';
        case 'fog':
            return ':fog:';
        default:
            return '';
    }
};

module.exports.PluginName = 'Dark Sky Weather';

module.exports.CanHandleMessage = function(messageText){
    return messageText.toLowerCase().includes('weather');
};

module.exports.HandleMessage = function(event, sendMsg){
    request('https://api.darksky.net/forecast/' + darkskyConfig.apiKey + '/' + darkskyConfig.latLong, 
        function (error, response, body){
            let weatherInfo = JSON.parse(body);
            let responseStr = getWeatherIconFor(weatherInfo.currently.icon)
                + ' Currently, it is ' + weatherInfo.currently.summary 
                + ' and ' + Math.round(weatherInfo.currently.temperature) + '°F.';
            
            sendMsg(responseStr, event.channel);
        });
};