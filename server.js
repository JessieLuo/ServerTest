const express = require('express')
const mongoose = require('mongoose')
const https = require('https')
const Client = require('./model/client')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/cusLogin.html')
})

mongoose.connect("mongodb://localhost:27017/client", { useNewUrlParser: true })

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const client = new Client({
        fname: firstName,
        lname: lastName,
        email: email
    })
    client
        .save()
        .catch((err) => console.log(err));

    //
    const msg = {
        to: '1152122933@qq.com', // Change to your recipient
        from: 'jessiescrew98@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'Hello, thank you for register to my application',
        html: '<strong>Hello, thank you for register to my application</strong>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
    res.send('Emial has send to you')
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}

app.listen(port, function (req, res) {
    console.log('server is running successfully')
})

