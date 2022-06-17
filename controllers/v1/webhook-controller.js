const express = require('express')
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const nodemailer = require('nodemailer')
const mailgun = require('mailgun-js')
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: process.env.DOMAIN_MAILGUN })

const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const app = express()

dotenv.config()


const webhookMercadopago = (req, res) => {

    var data = req.body
    res.sendStatus(200)

    console.log(`** El ID de pago es: ${data.data.id} **`)

    var id_venta = data.data.id
    const token = process.env.ACCESS_TOKEN

    var url_download
    var song
    var email

    async function obtenerDatos() {

        let url = `https://api.mercadopago.com/v1/payments/${id_venta}?access_token=${token}`;
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let myJson = await response.json();
        let email = myJson.payer.email
        let song = myJson.description

        return [email, song]
    }

    obtenerDatos()
        .then((res) => {
            email = res[0]
            song = res[1]
            console.log(`bla bla es: ${song}`)
            console.log(`email es: ${email}`)

            if (song === 'cdscsd') {
                url_download = process.env.SONG_TELOPROMETO
            } else if (song === 'vff') {
                url_download = process.env.SONG_TRES
            } 


            const envioGoogle = async() => {

                const outputHTML = `
                                <h2>bla bla bla</h2>
                                <h3>bla bla bla bla</h3>
                                <p>${url_download}<p>
                                <a href="${url_download}"><button>lalala!</a>
                            `;

                const oauth2Client = new OAuth2(
                    process.env.CLIENT_ID,
                    process.env.CLIENTE_SECRET,
                    process.env.REDIRECT_URL
                )

                oauth2Client.setCredentials({
                    refres_token: process.env.REFRESH_TOKEN
                })

                const accessToken = oauth2Client.getAccessToken()


                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "saraza@saraza.com",
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENTE_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN,
                        accessToken: accessToken
                    }
                })

                const mailOptions = {
                    from: 'Pepe <no-reply@escuadron.com>',
                    to: 'cpepepepe@gmail.com',
                    subject: 'etc etc!!',
                    generateTextFromHTML: true,
                    html: outputHTML
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Email enviado exitosamente: %s', info.messageId)
                    }
                })

            }
            envioGoogle()

        }).catch(e => console.log(e))


    const envioMailgun = async() => {
        const contentHTML = `
            <h1>bla bla/h1>
            <ul>
                <li>ID de pago: ${data.data.id}</li>
                <li>ID de usuario: ${data.user_id}</li>
                <li>Fecha de venta: ${data.date_created}</li>
            </ul>
        `;

        const mail = {
            from: 'laalay@lala.com',
            to: 'lalala@pgmail.com',
            subject: 'etc etc ✔',
            generateTextFromHTML: true,
            html: contentHTML
        }

        mg.messages().send(mail, function(err, body) {
            if (err) {
                console.log(`Error al enviar correo: ${err.message}`)
            } else {
                console.log(body)
            }
        })
    }


    envioMailgun()
}




module.exports = {
    webhookMercadopago,
    //getPaymentTest
}