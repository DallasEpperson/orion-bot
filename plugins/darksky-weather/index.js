var request = require('request');
var darkskyConfig = require('./darksky.config.json');

let generalForecastRgx = /((what( is|'s| will|'ll)?)|((tell|show) me))\sthe\s(weather|forecast|weather forecast)\s(for |be (like )?)?(tomorrow|today|tonight)/gmi;

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
    if(generalForecastRgx.test(messageText))
        return true;
    
    return false; //TODO add more specifiec rgx, like "tell me the humidity for tomorrow"
};

module.exports.HandleMessage = function(event, sendMsg){
    //TODO determine time requested instead of this hardcoded tomorrow val
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    tomorrow.setHours(12,0,0,0);
    
    request('https://api.darksky.net/forecast/' + darkskyConfig.apiKey + '/' + darkskyConfig.latLong + ',' + Math.round(tomorrow.getTime() / 1000), 
        function (error, response, body){
            let weatherInfo = JSON.parse(body);
            //TODO reply with time requested
            let responseStr = getWeatherIconFor(weatherInfo.currently.icon)
                + ' Tomorrow at noon, it will be ' + weatherInfo.currently.summary 
                + ' and ' + Math.round(weatherInfo.currently.temperature) + '°F.';
            
            sendMsg(responseStr, event.channel);
        });
};