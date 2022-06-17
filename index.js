const express = require('express')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config()

const routesV1 = require('./routes/v1')
routesV1(app)



const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
    console.log(`-- Server API-Webhooks running on port ${PORT}`)
})