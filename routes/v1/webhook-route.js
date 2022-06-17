const express = require('express')
const webhookController = require('../../controllers/v1/webhook-controller')

const route = express.Router()

route.post('/webhook', webhookController.webhookMercadopago)
    //route.get('/testPayment', webhookController.getPaymentTest)





module.exports = route