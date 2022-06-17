const app = require('../../app')
const webhookRoutes = require('./webhook-route')

module.exports = app => {
    app.use('/api/v1/example', webhookRoutes)
}