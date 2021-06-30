const request = require('request')

if (process.env.RELEASE !== 'release')
    require('dotenv').config()

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.GEOCODE_TOKEN}&limit=1`
    request({
        url,
        json: true
    }, (err, {
        body
    } = {}) => {
        if (err) return callback('Unable to connect.', undefined)
        if (body.message || body.features.length === 0) return callback('Unable to get the location.', undefined)
        callback(undefined, {
            latitude: body.features[0].center[1],
            longitude: body.features[0].center[0],
            location: body.features[0].place_name
        })
    })
}

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_TOKEN}&query=${latitude},${longitude}`
    request({
        url,
        json: true
    }, (error, {
        body
    } = {}) => {
        if (error) return callback('Unable to connect. Check your connection.', undefined);
        if (JSON.stringify(body).indexOf('<html>') > -1) return callback('Unable to connect. Try again after sometime.', undefined);
        if (body.error) return callback('Unable to find location.', undefined);
        callback(undefined, `It is currently ${body.current.temperature} degrees. It is ${body.current.weather_descriptions} and feels like ${body.current.feelslike} degrees.`);

    })
}
module.exports = {
    geocode: geocode,
    forecast: forecast
}