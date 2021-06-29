const path = require('path')
const express = require('express')
const hbs = require('hbs')
const utils = require('./utils')

const publicDir = path.join(__dirname, '../public')
const viewsDir = path.join(__dirname, '../templates/views')
const partialsDir = path.join(__dirname, '../templates/partials')

const port = process.env.PORT || 4000

const app = express()

app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerPartials(partialsDir)

app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "Abc"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: "Abc"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help?",
        name: "Abc",
        message: "This be not helpful at all"
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) return res.send({
        error: "No address provided"
    })

    utils.geocode(req.query.address, (error, {
        latitude,
        longitude,
        location
    } = {}) => {
        if (error) return res.send({
            error
        })

        utils.forecast(latitude, longitude, (error, forecast) => {
            if (error) return res.send({
                error
            })

            res.send({
                forecast,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "Help 404",
        name: "Abc",
        message: "Help Not found"
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        name: "Abc",
        message: "404<br>Not Found"
    })
})

app.listen(port, () => {
    console.log('Runnin');
})